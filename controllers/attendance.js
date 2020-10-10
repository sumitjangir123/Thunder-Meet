const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2 } = google.auth


//upper part for api access

const User = require("../models/user");
const Attendance = require("../models/attendance");
const Org = require("../models/organization");

module.exports.takeAttendance = async function (req, res) {

    let user = await User.findOne({email:req.query.name});
    let org = await Org.findOne({token:user.token});


    const oAuth2Client = new OAuth2(
      '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
      'hFTuBGp0WALLex6g9eh2mrCZ'
    )
    oAuth2Client.setCredentials({
      refresh_token: user.refreshToken
  });




  const drive = google.drive({version: 'v3', auth:oAuth2Client});

  var fileMetadata = {
    'name': 'thunderhithunder.jpg'
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream("assets/images/image.jpg")
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.data.id);
    }
  });




    // let attendance= Attendance.create({
    //     teacherId: req.query.name,
    //     sheetId: req.query.sheetId
    // })

    // const sheets = google.sheets({version: 'v4', auth:oAuth2Client});
    // sheets.spreadsheets.values.get({
    //   spreadsheetId: req.query.sheetId,
    //   range:'A1:D4'
    // }, (err, res) => {
    //   if (err) return console.log('The API returned an error: ' + err);
      
    //   const rows = res.data.values;
    //   console.log(rows);
    //   if (rows.length) {
    //     rows.map((row) => {
    //       console.log(`${row[0]}, ${row[2]}`);
    //     });

    //     req.flash("success","Attendance Fetched Successfully");
    //   } else {
    //     console.log('No data found.');
    //   }
    // });

}