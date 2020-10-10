const User = require("../models/user");
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const queue = require('../config/kue');
const resetPasswordEmail = require('../workers/reset_password_email');
const ResetPasswordToken = require('../models/reset_password_token');
const crypto = require('crypto');
var mongoose = require('mongoose');
const Org = require("../models/organization");
const { sync } = require("gulp-sass");
const { localsName } = require("ejs");

module.exports.profile = async function (req, res) {
    //no. of registered users
    let number = await (await User.find({})).length;
    let posts = await Post.find({ user: req.params.id });

    let user = await User.findById(req.params.id);
    
    return res.render('profile', {
        title: "profile page",
        profile_user: user,
        number: number,
        post: posts.length,
        posts: posts
    })
}
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated() && req.user.registered==true) {
        return res.redirect('/users/profile');
    }
    
    if (req.isAuthenticated() && req.user.registered!=true) {
        return res.render('user_register', {
            title: "TM ! Registration"
        })
    }

    return res.render('user_sign_up', {
        title: "TM ! Sign Up"
    })
}

module.exports.signIn = function (req, res) {

    if (req.isAuthenticated() && req.user.registered==true) {
        return res.redirect('/');
    }

    if (req.isAuthenticated() && req.user.registered!=true) {
        return res.render('user_register', {
            title: "TM ! Registration"
        })
    }

    return res.render('user_sign_in', {
        title: "TM ! SignIn"
    })

}

module.exports.create_user =async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash("error","password is not matching !")
        return res.redirect('back');
    }


    let check= User.findOne({name:req.user.name,email:req.user.email});

    if(check.length !=0 && check.access){
        req.flash("error","you are already registered !");
        return res.redirect("/")
    }

    if(req.body.same=="student"){
        let user=await User.findOneAndUpdate({name:req.user.name,email:req.user.email}, {
            contact: req.body.contact,
            roll: req.body.roll,
            branch: req.body.branch,
            password:req.body.password,
            year:req.body.year,
            registered:true,
            access:req.body.same
        });
    }else if(req.body.same=="teacher"){
        let org= await Org.findOne({
            token : req.body.AccessToken
        })

        if(org){
            let user=await User.findOneAndUpdate({name:req.user.name,email:req.user.email}, {
                contact: req.body.contact,
                roll: req.body.roll,
                password:req.body.password,
                registered:true,
                access:req.body.same,
                token: req.body.AccessToken
            });

            console.log(org);
            org.teachers.push(user);
            org.save();

            req.flash("success"," Hi "+req.user.name + ", now you are a registered teacher of " + org.name);
            return res.redirect("/");
            
        }else{
            req.flash("error","Invalid Institute key !");
            return res.redirect("back");
        }
       

    }
 


    req.flash("success","user successfully registered");
    return res.redirect('/')
  
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    
    if(!req.user.registered){
        req.flash('warning', 'First Things First Pls Register');
        return res.redirect('/');
    }else{
        req.flash('success', 'WELCOME '+ req.user.name);
        return res.redirect('/');
    }
    
    
}

//to sign out the user
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'session destroyed');
    return res.redirect('/');
}

module.exports.update = async function (req, res) {

    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadAvatar(req, res, function (err) {
                if (err) {
                    console.log('****multer error', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {

                    // if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                    //     fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    // }

                    //this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        } catch (error) {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }

}

module.exports.EnterMail = function (req, res) {
    res.render('enterMail', {
        title: 'Reset Your Password'
    })
}

module.exports.resetPassword = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            let resetToken = await ResetPasswordToken.create({
                user: user._id,
                token: crypto.randomBytes(20).toString('hex')
            });

            resetToken = await resetToken.populate('user', 'name email').execPopulate();
            // commentsMailer.newComment(comment);

            let job = queue.create('passQueue', resetToken).save(function (err) {
                if (err) { console.log('error in creating a queue', err); return; }

                console.log('job enqueued', job.id)
            })

            req.flash('success', 'check your email account, your token will be expire in 5 mins');
            return res.redirect('back');

        } else {
            req.flash('error', 'Looks like the user is not registered!');
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error', error); return;
    }
}

module.exports.resetForm = async function (req, res) {
    // console.log(req.params.token);
    let resetPasswordToken = await ResetPasswordToken.findOne({ token: req.params.token });

    if (resetPasswordToken) {
            let doc = {
                updatedAt: Date.now(),
            }

            ResetPasswordToken.findByIdAndUpdate(resetPasswordToken.id, doc, function (err, raw) {
                return res.render('passResForm', {
                    title: 'Enter your password',
                    token: req.params.token
                });
            });
        
    } else {
        req.flash('error', 'your token has been expired ! Generate a new one');
        return res.redirect('back');
    }
}

module.exports.setNewPass = async function (req, res) {
    try {

        if (req.body.password != req.body.confirm_password) {
            req.flash('error', 'bhai password to sahi daal de :(');
            return res.redirect('back');
        }

        let user = await ResetPasswordToken.findOne({ token: req.body.token });

        if (user) {
            user = await user.populate('user').execPopulate();

            let pass = {
                password: req.body.password
            }

            User.findByIdAndUpdate(user.user.id, pass, function (err, raw) {
                req.flash('success', 'Woo-hoo! your password has been changed');
                return res.redirect('/users/signIn');
            });
        } else {
            console.log('user not found'); return;
        }
    } catch (error) {
        console.log('error', error); return;
    }
}