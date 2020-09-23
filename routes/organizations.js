const express =require('express');
const router=express.Router();

const orgController=require("../controllers/org_controller");

router.get("/register",orgController.register);
router.post("/instituteDetails",orgController.instituteDetails);

//make it available for user.js file
module.exports=router;