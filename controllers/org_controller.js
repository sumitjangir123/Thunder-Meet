const Organization = require('../models/organization');
const Org= require('../models/organization');
const crypto = require('crypto');
const queue = require('../config/kue');
const resetPasswordEmail = require('../workers/new_org');

module.exports.register=async function(req,res){
    return res.render('joinUs', {
        title: "Register Your organization",
    })
}

module.exports.instituteDetails=async function(req,res){

    
    req.body.token=crypto.randomBytes(20).toString('hex');
    
    let org = await Organization.create(req.body);


    console.log(org);

    if (org) {
        let job = queue.create('orgQueue', org).save(function (err) {
            if (err) { console.log('error in creating a queue', err); return; }

            console.log('job enqueued', job.id)
        })

        req.flash('success', 'check your email account, your institute key is generated !');
        return res.redirect('back');

    }
    return res.redirect("/");
}