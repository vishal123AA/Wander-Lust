const express = require("express");
const router = express.Router();

// const User = require("../models/user");

router.get("/signUp", (req,res) => {
    res.render("users/signUp.ejs");
});

module.exports = router;