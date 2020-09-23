const User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

//authentication using passport 

passport.use(new LocalStrategy({
                usernameField:'email',
                //for adding the req for the req.flash()
                passReqToCallback : true
            },function(req,email,password,done){
                //find a user and establish the identity
                User.findOne({email : email},function(err,user){
                    if(err){
                        req.flash('error','err in finding the user --> passport ',err);
                        return done(err);
                    }

                    if(!user || user.password!=password){
                        req.flash('error','Invalid username/password ');
                        return done(null,false);
                    }
                    return done(null,user);
                })
            }
));

//serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialize the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
            if(err){
                console.log('Error in finding user -->passport ');
                return done(err);
            }

            return done(null,user);
    });
});


passport.checkAuthentication=function(req,res,next){
    //if user is authenticated then let the user to view the page or let the req pass to the next function i.e. controller's action
    if(req.isAuthenticated()){
        return next();
    }

    //if user is not signed in
    return res.redirect('/users/signIn');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views 
        res.locals.user = req.user;
    }
    next();
}

module.exports=passport;