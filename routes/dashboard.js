const express =require('express');
const router=express.Router();

const dashController=require("../controllers/dash_controller");

router.get("/student",dashController.student);
router.get("/teacher",dashController.teacher);

//make it available for user.js file
module.exports=router;