const express = require('express');
const app = express();
const PORT = 8080;

const path = require('path');
const Listing = require('./models/listing');
const wrapAsync = require("./utils/wrapAsync.js");

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


 
//index route
app.get("/listings",async(req,res) => {
    let allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id",async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//add listing
app.post("/listings",wrapAsync( async(req,res,next) => {
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
app.get("/listings/:id/edit",async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete
app.delete("/listings/:id", async(req, res) =>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.use((err,req,res,next) => {
    res.send("something went wrong")
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});