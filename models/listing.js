const mongoose = require('mongoose');

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
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;