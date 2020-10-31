const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2 } = google.auth


//upper part for api access

const User = require("../models/user");
const Attendance = require("../models/attendance");
const Org = require("../models/organization");

module.exports.takeAttendance = async function (req, res) {

    let teacher = await User.findOne({email:req.query.name});


    const oAuth2Client = new OAuth2(
      '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
      'hFTuBGp0WALLex6g9eh2mrCZ'
    )
    oAuth2Client.setCredentials({
      refresh_token: teacher.refreshToken
  });




  // const drive = google.drive({version: 'v3', auth:oAuth2Client});

  // var fileMetadata = {
  //   'name': 'thunderhithunder.jpg'
  // };
  // var media = {
  //   mimeType: 'image/jpeg',
  //   body: fs.createReadStream("assets/images/image.jpg")
  // };
  // drive.files.create({
  //   resource: fileMetadata,
  //   media: media,
  //   fields: 'id'
  // }, function (err, file) {
  //   if (err) {
  //     // Handle error
  //     console.error(err);
  //   } else {
  //     console.log('File Id: ', file.data.id);
  //   }
  // });




    // let attendance= Attendance.create({
    //     teacherId: req.query.name,
    //     sheetId: req.query.sheetId
    // })


    const sheets = google.sheets({version: 'v4', auth:oAuth2Client});

    let result = await sheets.spreadsheets.values.get({
      spreadsheetId: req.query.sheetId,
      range:'A2:D'
    });

    let sheetResult= result.data.values;
     
    if(sheetResult.length){

      for(i of sheetResult){
        
        let a = i[3].split(':');
        let attend =await Attendance.findOne({
          student:i[0],
          branch : req.query.branch,
          teacher : teacher._id,
          year : req.query.year
        });

        if(!attend){
          attend = await Attendance.create({
            teacher : teacher._id,
            branch : req.query.branch,
            year : req.query.year,
            student : i[0],
            duration : (+a[0]) * 60 + (+a[1])
          })
        }else{
            await Attendance.findByIdAndUpdate(attend._id,{
            duration : (+a[0]) * 60 + (+a[1]) + attend.duration
          });
        }
      }

    }

    console.log("Done");
}