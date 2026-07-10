const express = require('express');
const app = express();
const PORT = 8080;

// const Listing = require('./models/listing');
// const listingSchema = require("./schema.js");
const listings = require("./routes/listing.js");

// const Review = require("./models/review.js");
// const reviewSchema = require("./schema.js");
const reviews = require("./routes/review.js");

// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const path = require('path');
const methodOverride = require('method-override');
const ejsMate =  require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

app.engine("ejs",ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

const sessionOptions = {
    secret:"mysupersecretkey",
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7* 24 *60*60*1000,
        httpOnly : true
    },
};

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

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*splat", (req,res,next) =>{
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