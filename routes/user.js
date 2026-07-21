const express = require("express");
const router = express.Router();

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const {userSchema} = require("../schema.js"); 
const passport = require("passport");

const validateUser = (req,res,next)=>{
    let {error} =  userSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el) =>  el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
}

//signUp user
router.get("/signUp", (req,res) => {
    res.render("users/signUp.ejs");
});

//add user
router.post("/signUp",validateUser,wrapAsync(async(req,res) =>{
    try{ 
        const{username,password,email} = req.body.user;
        const newUser = new User({email,username});
        const registerdUser = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup") 
    }
}));

//login user
router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate('local',{failureFlash:true , failureRedirect : "/login"}),async(req,res) =>{
    req.flash("success", "Welcome to WanderLust");
    res.redirect("/listings");
});


//logout user
router.get("/logout",(req,res,next) =>{
    req.logout((err) => {
        if(err){
         return next (err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings"); 
    })
});

module.exports = router;