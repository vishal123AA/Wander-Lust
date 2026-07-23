const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");

const { saveRedirectUrl , validateUser} = require("../middleware.js");

const userController = require("../controllers/user.js")

//here we combine the route signUp user and add user
router.route("/signUp")
.get("/signUp", userController.renderSignupForm )
.post("/signUp",validateUser,wrapAsync(userController.signup));

//here we combine the login form and login user
router.route("/login")
.get("/login", userController.renderLoginform)
.post("/login",saveRedirectUrl,passport.authenticate('local',{failureFlash:true , failureRedirect : "/login"}),
userController.login);

//logout user
router.get("/logout",userController.logout);

module.exports = router;