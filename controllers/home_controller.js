const db = require('../config/mongoose');
const Post = require("../models/post");
const User = require("../models/user");
const Like = require('../models/like');
const Poll= require('../models/polls');
const Choices= require('../models/pollsChoices');

//home controller
module.exports.home = async function (req, res) {
    try {
        //populate the user of each post
        let post_list = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate('photos')
            .populate({
                path: 'comment',
                populate: {
                    path: 'user likes'
                }
            }).populate('likes');
        
        //populate users
        let users = await User.find({})
        
        let poll= await Poll.find({})
        .sort('-createdAt')
        .populate({
            path: 'choices',
            populate:{
                path: 'user'
            }
        }).populate('user');
      
     

        return res.render('home', {
            post_list: post_list,
            users_list: users,
            title: "Thunder Meet",
            poll:poll
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
}

module.exports.about= async function(req,res){
    try {
        return res.render('about', {
            title: "Sumit Kumar"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.policies= async function(req,res){
    try {
        return res.render('privacyPolicies',{
            title: "privacy policies"
        })
    } catch (error) {
        console.log(error);
    }
}
