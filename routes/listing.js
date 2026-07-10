const express = require("express");
const router = express.Router();

const Listing = require('../models/listing');
const {listingSchema} = require("../schema.js"); 

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req,res,next)=>{
    let {error} =  listingSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el) =>  el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
}

//index route
router.get("/", wrapAsync(async(req,res,next) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

router.get("/new",(req,res) => {
    res.render("listings/new.ejs");
});

// show route
router.get("/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/show.ejs", {listing});
    }
}));

//add listing
router.post("/",validateListing,wrapAsync(async(req,res,next) => {
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
      await newListings.save();
      req.flash("success","New listing Created!");
      res.redirect("/listings");

}));

//edit
router.get("/:id/edit",wrapAsync(async(req, res) => {
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
router.put("/:id",validateListing ,wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete
router.delete("/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;