const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2 } = google.auth
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
const { v4: uuidV4 } = require('uuid');



//upper part for api access

const User = require("../models/user");
const Org = require("../models/organization");
const Friends = require("../models/friendship");
const crypto = require("crypto");
const Attendance = require("../models/attendance");

module.exports.student = async function (req, res) {

    if(!req.user){
        req.flash("error","Session Timeout ! Login Again ");
        return res.redirect("/");
    }
    let classes = await Friends.find({
        branch: req.user.branch,
        year: req.user.year
    }).sort('-createdAt');

    let attend = await Attendance.find({
        student: req.user.name,
        branch : req.user.branch,
        year : req.user.year
    }).populate("teacher")

    console.log(attend);
    return res.render('student_dashboard', {
        title: "student section",
        links: classes,
        attend: attend
    })
}

module.exports.teacher = async function (req, res) {

    if (!req.user) {
        req.flash("error", "sign in first");
        return res.redirect("/");
    }


    //fetching organization info
    let org = await Org.findOne({
        token: req.user.token
    });



    //fetching class info
    let classes = await Friends.find({moderator:req.user.email}).sort('-createdAt').sort('-createdAt');

    if (org.length != 0) {

        //fetching students for info
        let users = await User.find({
            access: "student",
            org: org.organization
        })


        req.flash("success", "Teacher(" + req.user.name + ") Dashboard");
        return res.render('teacher_dashboard', {
            title: "admin section",
            students: users,
            org: org,
            links: classes
        })

    } else {
        req.flash("error", "you are not a valid teacher :(");
        return res.redirect("/");
    }

}


module.exports.createClass = async function (req, res) {

    var date1 = req.body.date + "T" + (req.body.time).split(":")[0] + ":00" + ":30";
    var date2 = req.body.date + "T" + (req.body.time).split(":")[0] + ":45" + ":30";


    var x = new Date(req.body.date + "T" + (req.body.time).split(":")[0] + ":00" + ":30");
    var y = new Date(req.body.date + "T" + (req.body.time).split(":")[0] + ":45" + ":30");


    var end1 = req.body.date + "T" + (x.getUTCHours()) + ":" + (x.getUTCMinutes()) + ":00" + ".000Z";
    var end2 = req.body.date + "T" + (y.getUTCHours()) + ":" + (y.getUTCMinutes()) + ":00" + ".000Z";


    let org = await Org.findOne({
        token: req.user.token
    });

    if (org == undefined) {
        req.flash("error", "sorry, your organisation is not defined");
        return res.redirect("/");
    }

    //fetching all the users of that class
    let users = await User.find({
        access: "student",
        org: org.organization,
        year: req.body.year,
        branch: req.body.branch
    })

    //if no. of students =0
    if (users.length == 0) {
        req.flash("error", "can't create a class without students");
        return res.redirect("back");
    }



    //setting details for teacher
    let oAuth2Client = new OAuth2(
        '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
        'hFTuBGp0WALLex6g9eh2mrCZ'
    )

    oAuth2Client.setCredentials({
        refresh_token: req.user.refreshToken,
    });

    // Create a new calender instance.
    let calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


    //checking whether teacher is budy or not
    let result = await calendar.events.list({
        calendarId: 'primary',
        timeMin: end1,
        timeMax: end2,
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
    });

    let events = result.data.items;
    if (events.length) {
        req.flash("error", "Sorry, You Are Busy With " + events[0].summary);
        return res.redirect("back");
    }

    //checking end




    //checking started for students
    oAuth2Client.setCredentials({
        refresh_token: users[0].refreshToken,//a random user
    });

    // Create a new calender instance for a student to check
    calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    //checking whether student is busy or not
    result = await calendar.events.list({
        calendarId: 'primary',
        timeMin: end1,
        timeMax: end2,
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime',
    });

    events = result.data.items;

        console.log(events);
    if (events.length) {
        req.flash("error", "Sorry, Students Are Busy With " + events[0].summary + " | will end at "+ ((events[0].end.dateTime).split("T")[1]).split("+")[0]  +" | According to the user " + users[0].email);
        return res.redirect("back");
    }

    //checking end for students


    //update teacher's class info
    await User.findOneAndUpdate({
        email: req.user.email
    }, {
        totalClass: req.user.totalClass + 1
    })



    // Create a new event start date instance for teacher in their calendar.
    const eventStartTime = new Date();
    eventStartTime.setDate((req.body.date).split("-")[2]);
    const eventEndTime = new Date();
    eventEndTime.setDate((req.body.date).split("-")[2]);
    eventEndTime.setMinutes(eventStartTime.getMinutes() + 45);



    // Create a dummy event for temp users in our calendar
    const event = {
        summary: "next class of " + req.body.subject + " - " + req.user.name,
        location: "Jawahar Lal Nehru Marg, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017",
        description: "by Thunder Meet : thethunderbirdus@gmail.com",
        colorId: 1,
        conferenceData: {
            createRequest: {
                requestId: "zzz",
                conferenceSolutionKey: {
                    type: "hangoutsMeet"
                }
            }
        },
        start: {
            dateTime: date1,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: date2,
            timeZone: 'Asia/Kolkata',
        },
    }


    //IMPORTANT
    //switching to the teacher again
    oAuth2Client.setCredentials({
        refresh_token: req.user.refreshToken,
    });

    // Create a new calender instance.
    calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    calendar.events.insert(
        { calendarId: 'primary', conferenceDataVersion: '1', resource: event },
        (err, temp) => {
            // Check for errors and log them if they exist.
            if (err) return console.error('Error Creating Calender Event:', err)
            // Else log that the event was created.
            let link = temp.data.hangoutLink;

             Friends.create({
                startFrom:req.body.date +"T"+req.body.time,
                moderator:req.user.email,
                meetLinks: temp.data.hangoutLink,
                localLinks: crypto.randomBytes(20).toString('hex'),
                classOf: req.body.subject,
                branch:req.body.branch,
                year:req.body.year
            })



            //updating the total class values 
            users.forEach(function(olx){
                olx.totalClass=olx.totalClass+1;
                olx.save()
            });
            
           
            //starting users source link assignment
            for (user of users) {

                // Create a new instance of oAuth and set our Client ID & Client Secret.
                oAuth2Client.setCredentials({
                    refresh_token: user.refreshToken,
                });

                // Create a new calender instance.
                calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


                // Create a dummy event for temp uses in our calendar
                const event = {
                    summary: "next class of " + req.body.subject + " - " + req.user.name,
                    location: "Jawahar Lal Nehru Marg, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017",
                    description: "by Thunder Meet : "+link,
                    colorId: 1,
                    source:{
                        title:"Class Link",
                        url:link
                    },
                    start: {
                        dateTime: date1,
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: date2,
                        timeZone: 'Asia/Kolkata',
                    },
                }

                return calendar.events.insert(
                    { calendarId: 'primary', sendUpdates: 'all', resource: event },
                    err => {
                        // Check for errors and log them if they exist.
                        if (err) return console.error('Error Creating Calender Event:', err)
                        // Else log that the event was created.
                        return console.log('Calendar event successfully created.')
                    }
                )

            }

        }
    )

req.flash("success", users.length + " students will be informed for the class");
return res.redirect("back");
}




module.exports.generate = async function (req, res) {
    res.redirect(`/dashboard/generate/${uuidV4()}`);
}

module.exports.room = async function (req, res) {
    if (req.user) {
        res.render('room', { title: "Thunder meeting", roomId: req.params.room, name: req.user.name })
    } else {
        req.flash("error", "Login to join the meeting !");
        return res.redirect("/");
    }

}