const express = require("express");
const router = express.Router();

const Listing = require('../models/listing');
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

//index route
router.get("/", wrapAsync(async(req,res,next) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

router.get("/new",isLoggedIn,(req,res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
});

// show route
router.get("/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path :"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/show.ejs", {listing});
    }
}));

//add listing
router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res) => {
    // let {title,description,image,price,location,country} = req.body;
    // let newListing = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    // await newListing.save();
      const newListings = new Listing(req.body.listing);
      newListings.owner =req.user._id;
      await newListings.save();
      req.flash("success","New listing Created!");
      res.redirect("/listings");

}));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/edit.ejs",{listing});
    }
}));

//update
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req, res) =>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;