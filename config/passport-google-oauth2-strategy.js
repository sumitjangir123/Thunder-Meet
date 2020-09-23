const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2 } = google.auth
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
  ''
)

//upper part for api access



//this part is for passport auth2.0
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');
const { json } = require('express');

//tell passport to use a new strategy for google login 
passport.use(new googleStrategy({
  clientID: "656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com",
  clientSecret: "",
  callbackURL: ""
},
  function (accessToken, refreshToken, requestParams, profile, cb) {

    console.log(profile);
    //     var o = {}
    //     var key = 'access_token';
    //     o[key] = accessToken;

    //     var temp=JSON.stringify(o);
    //     // fs.writeFile(TOKEN_PATH, JSON.stringify(o), (err) => {
    //     //     if (err) return console.error(err);
    //     //     console.log('Token stored to', TOKEN_PATH);
    //     // });
    console.log("refresh", refreshToken);
    console.log(requestParams);

    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    })

    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

    // Create a new event start date instance for temp uses in our calendar.
    const eventStartTime = new Date()

    eventStartTime.setDate(eventStartTime.getDate())

    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date()
    eventEndTime.setDate(eventEndTime.getDate())
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

    // Create a dummy event for temp uses in our calendar
    const event = {
      summary: "next class of Dr. amit kumar",
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






    //check event list user

    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('hey thunder! The API returned an error from fetch side: ' + err);
      const events = res.data.items;

      if (events.length) {
        console.log('Upcoming ' + events.length + ' events:');
        events.map((event, i) => {
          console.log("hey Thunder link is here : ", event.hangoutLink);
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('hey Thunder! No upcoming events found.');
      }
    });



    //next 10 events shown end here












    //managing our local thunder meet users here 



    //find a user 
    User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
      if (err) { console.log('error in google strategy-passport', err); return; }
      if (user) {
        //if user is found, set this user as req.user
        return cb(null, user);
      } else {
        //if not found then create the user and set it as req.user
        User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          org : profile._json.hd,
          password: crypto.randomBytes(20).toString('hex'),
          avatar: profile.photos[0].value,
          registered: false,
          accessToken:accessToken,
          refreshToken:refreshToken
        }, function (err, user) {
          if (err) { console.log('error in creating the user in google strategy-passport', err); return; }
          else {
            return cb(null, user);
          }
        });
      }
    });
  }
));

module.exports = passport;