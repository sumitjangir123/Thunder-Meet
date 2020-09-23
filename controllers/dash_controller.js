const User = require("../models/user");
const Org = require("../models/organization");

module.exports.student=async function(req,res){
    return res.render('student_dashboard', {
        title: "student section",
    })
}

module.exports.teacher=async function(req,res){

    let org= await Org.findOne({
        token: req.user.token
    });


   if(org.length !=0){
        let users =await User.find({
            access : "student",
            org : org.organization
        })

        req.flash("success","Teacher("+req.user.name +") Dashboard");
        return res.render('teacher_dashboard', {
            title: "admin section",
            students: users
        })

   }else{
       req.flash("error","you are not a valid teacher :(");
       return res.redirect("/");
   }

    
req.flash("error","something went wrong !");
return res.redirect("/");
   
   
}

