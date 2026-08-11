const Listing = require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken  = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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

module.exports.filterByCategory = async(req,res) =>{
    let {categoryName} = req.params;
    let allListings= await Listing.find({ category: categoryName });

    if(allListings.length == 0){
        req.flash("error", "No listings found for this category!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
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

    let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;

    const newListings = new Listing(req.body.listing);
    newListings.owner =req.user._id;
    newListings.image = {url,filename};
    newListings.geometry = response.body.features[0].geometry;
    let savedListing =  await newListings.save();
    console.log(savedListing);
    req.flash("success","New listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm =async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload","/upload/h_200,w_250");

    if(!listing){
        req.flash("error","Listing you want didn't Exists");
        res.redirect("/listings");
    }else{
      res.render("listings/edit.ejs",{listing,orignalImageUrl});
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

module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }

    let searchQuery = new RegExp(q, "i");

    const allListings = await Listing.find({
        $or: [
            { title: searchQuery },
            { location: searchQuery },
            { country: searchQuery }
        ]
    });

    if (allListings.length === 0) {
        req.flash("error", "No listings found matching your search.");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
};
