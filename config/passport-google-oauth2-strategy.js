const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { OAuth2 } = google.auth
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  '656640366395-5tcdds420ghq7195tfsbi04i7rduaans.apps.googleusercontent.com',
  'hFTuBGp0WALLex6g9eh2mrCZ'
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
  callbackURL: "http://localhost:8000/users/auth/google/callback"
},
  function (accessToken, refreshToken, requestParams, profile, cb) {

    console.log(profile);

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
          totalClass:0,
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