const mongoose = require('mongoose');
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://images.pexels.com/photos/30767893/pexels-photo-30767893.jpeg",
        set : (v) => v==='' ?"https://images.pexels.com/photos/30767893/pexels-photo-30767893.jpeg" : v
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id :{$in : listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;