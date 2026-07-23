const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");

const { saveRedirectUrl , validateUser} = require("../middleware.js");

const userController = require("../controllers/user.js")

//signUp user
router.get("/signUp", userController.renderSignupForm );

//add user
router.post("/signUp",validateUser,wrapAsync(userController.signup));

//login user
router.get("/login", userController.renderLoginform);

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureFlash:true , failureRedirect : "/login"}),
userController.login);


//logout user
router.get("/logout",userController.logout);

module.exports = router;