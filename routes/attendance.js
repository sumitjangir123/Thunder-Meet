const express =require('express');
const router=express.Router();

const dashController=require("../controllers/attendance");

router.get("/",dashController.takeAttendance);

//make it available for user.js file
module.exports=router;