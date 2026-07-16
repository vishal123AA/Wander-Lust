const express = require("express");
const router = express.Router();

const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const {userSchema} = require("../schema.js"); 

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
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
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

module.exports = router;