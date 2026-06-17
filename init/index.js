const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data.js');

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

async function initDB() {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data", initData.data);
}

initDB();