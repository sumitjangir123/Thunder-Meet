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

module.exports.student = async function (req, res) {
    let user = await User.findById(req.user._id).populate("friendships");

    return res.render('student_dashboard', {
        title: "student section",
        links: user.friendships
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
    let user = await User.findById(req.user._id).populate("friendships");

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
            links: user.friendships
        })

    } else {
        req.flash("error", "you are not a valid teacher :(");
        return res.redirect("/");
    }

}


module.exports.createClass = async function (req, res) {

    let org = await Org.findOne({
        token: req.user.token
    });

    
    let users = await User.find({
        access: "student",
        org: org.organization,
        year: req.body.year,
        branch: req.body.branch
    })



        let CheckUser= await User.findOne({
            access : "student",
            org : org.organization,
            year : req.body.year,
            branch : req.body.branch
        })
        .populate("friendships");

        for(i of CheckUser.friendships){
            
            if(i.classOf!="undefined"){
                req.flash("error","sorry "+ i.classOf+ " class is live now");
                req.flash("error","according to the student "+CheckUser.email);
                return res.redirect("back");
            }
        }
       


        //removing all ids from users
        for(i of users){
            await User.findOneAndUpdate({
                email: i.email
            }, {
                friendships: [],
                totalClass: i.totalClass+1
            })
        }
        //removing all ids from teacher
    await User.findOneAndUpdate({
        email: req.user.email
    }, {
        friendships: []
    })


    let temp_teacher = await User.findOneAndUpdate({
        email: req.user.email
    }, {
        totalClass: req.user.totalClass + 1
    })

    const oAuth2Client = new OAuth2(
        '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
        'hFTuBGp0WALLex6g9eh2mrCZ'
    )

    oAuth2Client.setCredentials({
        refresh_token: req.user.refreshToken,
    });



    var link = null;
    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    // Create a new event start date instance for temp uses in our calendar.
    const eventStartTime = new Date()


    eventStartTime.setDate(eventStartTime.getDate())

    console.log(eventStartTime);
    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date()
    eventEndTime.setDate(eventEndTime.getDate())
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)


    // Create a dummy event for temp uses in our calendar
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
            dateTime: eventStartTime,
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'Asia/Kolkata',
        },
    }

    // Check if we a busy and have an event on our calendar for the same time.
    calendar.freebusy.query(
        {
            resource: {
                timeMin: eventStartTime,
                timeMax: eventEndTime,
                timeZone: 'Asia/Kolkata',
                items: [{ id: 'primary' }],
            },
        },
        (err, res) => {


            // Check for errors in our query and log them if they exist.
            if (err) return console.error('Free Busy Query Error: ', err)

            // Create an array of all events on our calendar during that time.
            const eventArr = res.data.calendars.primary.busy

            // Check if event array is empty which means we are not busy
            if (eventArr.length === 0)
                // If we are not busy create a new calendar event.
                return calendar.events.insert(
                    { calendarId: 'primary', conferenceDataVersion: '1', resource: event },
                    (err, temp) => {
                        // Check for errors and log them if they exist.
                        if (err) return console.error('Error Creating Calender Event:', err)
                        // Else log that the event was created.
                        let link = temp.data.hangoutLink;


                        let friend = Friends.create({
                            meetLinks: temp.data.hangoutLink,
                            localLinks: crypto.randomBytes(20).toString('hex'),
                            classOf: req.body.subject
                        })



                        // for saving the links to every student
                        users.forEach(function(olx){
                            friend.then((peep)=>{
                                olx.friendships.push(peep);
                                olx.save();
                            });  

                        });



                    
                        //also saving for the teacher
                        friend.then((peep) => {
                            temp_teacher.friendships.push(peep);
                            temp_teacher.save();
                        });

                        //starting users source link assignment

                        for (user of users) {

                            // Create a new instance of oAuth and set our Client ID & Client Secret.
                            const oAuth2Client = new OAuth2(
                                '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
                                'hFTuBGp0WALLex6g9eh2mrCZ'
                            )

                            oAuth2Client.setCredentials({
                                refresh_token: user.refreshToken,
                            });


                            // Create a new calender instance.
                            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

                            // Create a new event start date instance for temp uses in our calendar.
                            const eventStartTime = new Date()


                            eventStartTime.setDate(eventStartTime.getDate())

                            console.log(eventStartTime);
                            // Create a new event end date instance for temp uses in our calendar.
                            const eventEndTime = new Date()
                            eventEndTime.setDate(eventEndTime.getDate())
                            eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)


                            // Create a dummy event for temp uses in our calendar
                            const event = {
                                summary: "next class of " + req.body.subject + " - " + req.user.name,
                                location: "Jawahar Lal Nehru Marg, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017",
                                description: "by Thunder Meet : thethunderbirdus@gmail.com",
                                colorId: 1,
                                source: {
                                    title: "Class Link of " + req.body.subject,
                                    url: link
                                },
                                start: {
                                    dateTime: eventStartTime,
                                    timeZone: 'Asia/Kolkata',
                                },
                                end: {
                                    dateTime: eventEndTime,
                                    timeZone: 'Asia/Kolkata',
                                },
                            }

                            // Check if we a busy and have an event on our calendar for the same time.
                            calendar.freebusy.query(
                                {
                                    resource: {
                                        timeMin: eventStartTime,
                                        timeMax: eventEndTime,
                                        timeZone: 'Asia/Kolkata',
                                        items: [{ id: 'primary' }],
                                    },
                                },
                                (err, res) => {


                                    // Check for errors in our query and log them if they exist.
                                    if (err) return console.error('Free Busy Query Error: ', err)

                                    // Create an array of all events on our calendar during that time.
                                    const eventArr = res.data.calendars.primary.busy

                                    // Check if event array is empty which means we are not busy
                                    if (eventArr.length === 0)
                                        // If we are not busy create a new calendar event.
                                        return calendar.events.insert(
                                            { calendarId: 'primary', sendUpdates: 'all', resource: event },
                                            err => {
                                                // Check for errors and log them if they exist.
                                                if (err) return console.error('Error Creating Calender Event:', err)
                                                // Else log that the event was created.
                                                return console.log('Calendar event successfully created.')
                                            }
                                        )

                                    // If event array is not empty log that we are busy.
                                    return console.log(`Sorry I'm busy...`)
                                }
                            )
                        }
                        //end of users source link assignment
                        return console.log('Calendar event successfully created.');
                    }
                )

            return console.log(`Sorry I'm busy...`)
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