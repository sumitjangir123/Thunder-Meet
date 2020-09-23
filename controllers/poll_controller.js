const Post = require("../models/post");
const Poll= require('../models/polls');
const User = require('../models/user');
const Choices= require('../models/pollsChoices');
const Ip=require('../models/ips');

module.exports.create=async function(req,res){
    var x=req.body.all;
    var i=0;

    let poll=await Poll.create({
        title: req.body.pollingData,
        user: req.user.id
    })

    while(req.body.times>i){
        let choices1=await Choices.create({
            content: x[i],
            value: "0",
            user: req.user.id
        })
        poll.choices.push(choices1);
        i++;
    }
    poll.save();
    req.flash('success', ' poll created successfully !');
    res.redirect('/');
}

module.exports.check=async function(req,res){
    // res.render("check",{
    //     title:"poll status",
    // })

    let poll=await Poll.findById(req.params.id);
    poll= await poll.populate("choices").execPopulate();

    res.render("poll_check",{
        title: "status",
        poll: poll
    })


}

module.exports.vote= async function(req,res){
  
    let poll=await Poll.findById(req.params.id);
    poll= await poll.populate("choices").execPopulate();

    let id=req.params.id;
    res.render("voteNow",{
        title: "voting section",
        poll: poll,
        id: id
    })
    
}

module.exports.votingData=async function(req,res){
    let poll=await Poll.findById(req.params.id);
    poll= await poll.populate("choices ip").execPopulate();


    let check =await Ip.find({
        content:req.body.ip,
        from:req.params.id

    })

    if(check.length>=1){
        req.flash("error","it seems you have already submitted this form");
        return res.redirect("/");
    }

    let x=0;
    var temp= req.body;
    for(i of poll.choices){
        if(temp[x]=="on"){
            i.value=i.value * 1 + 1;
        }
        i.save();
        x++;
    }

    let ip=await Ip.create({
        content:req.body.ip,
        from: req.params.id
    })

    poll.ip.push(ip);
    poll.save();
    
    req.flash("success","voting completed")
    res.redirect("/");
}