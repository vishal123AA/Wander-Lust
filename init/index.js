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
    initData.data = initData.data.map((obj) => ({...obj,owner : "6a5896162d985fe63f3c9c9e",}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data", initData.data);
}

initDB();