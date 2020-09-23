const express =require('express');
const router=express.Router();
const passport=require('passport')

const postController=require("../controllers/post_controller");

//if some who knows a little bit about html wants to do a request , so for that a second level
router.post("/create",passport.checkAuthentication,postController.create);
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);
//make it available for user.js file
module.exports=router;