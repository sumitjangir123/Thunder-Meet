const express =require('express');
const router=express.Router();

console.log("router loaded !!");


//setting home file controller
const homeController=require('../controllers/home_controller');

router.get("/",homeController.home);
router.get("/about",homeController.about);
router.get("/privacyPolicies",homeController.policies);
router.use("/users",require("./users"));
router.use("/post",require("./posts"));
router.use("/comment",require('./comments'));
router.use("/api",require('./api'));
router.use("/likes",require('./likes'));
router.use("/dashboard",require('./dashboard'));
router.use("/organizations",require('./organizations'));
router.use("/attendance",require('./attendance'));
//make it for outer index.js
module.exports =router;