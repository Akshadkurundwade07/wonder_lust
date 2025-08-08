const mongoose = require('mongoose');
const initData = require('./data.js'); // Adjust the path as necessary
 // Adjust the path as necessary
const Listing = require('../models/listing.js'); 
const mongourl = "mongodb://127.0.0.1:27017/wanderlust"; // Adjust the URL as necessary

main()
.then(() => {
    console.log('Connected to MongoDB');
    })
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main(){
    await mongoose.connect(mongourl);
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    await Listing.insertMany(initData.data); // Insert new listings
    console.log("data was initialized");

}

initDB();