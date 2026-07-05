const express = require('express');
const app = express();
const PORT = 8080;

const path = require('path');
const Listing = require('./models/listing');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const Review = require("./models/review.js");
const reviewSchema = require("./schema.js");

const methodOverride = require('method-override');

const ejsMate =  require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const mongoose = require('mongoose');
// const { measureMemory } = require('vm');
const Mongo_URL = 'mongodb://localhost:27017/Wander-Lust';

main()
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection failed");
        console.log(err);
    });

async function main() {
    await mongoose.connect(Mongo_URL);
}

app.get('/', (req, res) => {
    res.send("this is the base route");
});

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

const validateReview = (req,res,next)=>{
    let {error} =  reviewSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el) =>  el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
}
 
//index route
app.get("/listings", wrapAsync(async(req,res,next) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//add listing
app.post("/listings",validateListing,wrapAsync(async(req,res,next) => {
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
      res.redirect("/listings");

}));

//edit
app.get("/listings/:id/edit",wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update
app.put("/listings/:id",validateListing ,wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete
app.delete("/listings/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//post review add
app.post("/listings/:id/reviews",validateReview,wrapAsync( async(req,res) => {
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}));

//delete the review
app.delete("/listings/:id/reviews/:reviewId" ,wrapAsync(async(req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


app.all("/*splat", (req,res,next) =>{
    next(new ExpressError(404, "path not created i.e wrong path"));
});

app.use((err,req,res,next) => {
    let {status = 500,message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});