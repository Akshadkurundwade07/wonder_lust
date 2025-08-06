const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./listing'); // Adjust the path as necessary

main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  async function main(){
  mongoose.connect("mongodb://localhost:27017/wanderlust", {
    
  });
}


app.listen(8080,() => {
  console.log('Server is running on port 8080');
});

app.get('/', (req, res) => {
  console.log('Hello World');
  res.send('Hello World');
}); 

app.get('/testlisting', async (req, res) => {
  let samplelisting = new Listing({
    title: "Sample Listing",
    description: "This is a sample listing for testing purposes.",
    
    price: 100,
    location: "Sample Location",
    country: "Sample Country"
  });

  await samplelisting.save();
  console.log('Sample listing saved');
  res.send('Sample listing created');
});