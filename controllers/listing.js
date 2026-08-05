const Listing = require("../models/listing");
const { findById } = require("../models/review");
const cloudinary = require("cloudinary").v2;

module.exports.index = async(req,res) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path :"reviews",populate:{path:"author"}}).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/show.ejs", {listing});
    }
};

module.exports.createListing = async(req,res) => {
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

      let url = req.file.path;
      let filename = req.file.filename;

      const newListings = new Listing(req.body.listing);
      newListings.owner =req.user._id;
      newListings.image = {url,filename};
      await newListings.save();
      req.flash("success","New listing Created!");
      res.redirect("/listings");
};

module.exports.renderEditForm =async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/edit.ejs",{listing});
    }
};

module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url,filename};
       listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(listing.image && listing.image.filename){
        await cloudinary.uploader.destroy(listing.image.filename,{invalidate:true});
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};