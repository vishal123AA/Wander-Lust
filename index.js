const express = require('express');
const app = express();
const PORT = 8080;

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});