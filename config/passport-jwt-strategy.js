const User=require('../models/user');
const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env= require('./environment');

let opts= {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtpayload, done) {
    User.findById(jwtpayload._id, function(err, user) {
        if (err){ console.log('error in finding user from JWT');return done(err, false);}
        if (user){ return done(null, user);}
        else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports= passport;