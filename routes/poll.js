const express =require('express');
const router=express.Router();
const passport=require('passport')

const pollController=require("../controllers/poll_controller");

//if some who knows a little bit about html wants to do a request , so for that a second level
router.post("/create",passport.checkAuthentication,pollController.create);
router.get("/check/:id",passport.checkAuthentication,pollController.check);
router.get("/vote/:id",pollController.vote);
router.post("/voting/:id",pollController.votingData);

//make it available for user.js file
module.exports=router;