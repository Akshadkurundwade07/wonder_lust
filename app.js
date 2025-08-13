const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing'); // Adjust the path as necessary
const path = require("path"); 


main()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(8080,() => {
        console.log('Server is running on port 8080');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  async function main(){
  mongoose.connect("mongodb://localhost:27017/wanderlust", {
    
  });
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); 






app.get('/', (req, res) => {
  console.log('Hello World');
  res.send('Hello World');
}); 

app.get ("/listings", async (req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index",{ allListings })
  });

app.get("/listings/new",(req,res) =>{
  res.render("listings/new");
});


app.get("/listings/:id",async (req,res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show",{ listing });
});

//create route

app.post("/listings", async(req,res) =>{
  //let{ title,description ,image , price, country, location} = req.body;
  const newlisting = new Listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings")
  console.log(listing);

})

// app.get('/testlisting', async (req, res) => {
//   let samplelisting = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing for testing purposes.",
    
//     price: 100,
//     location: "Sample Location",
//     country: "Sample Country"
//   });

//   await samplelisting.save();
//   console.log('Sample listing saved');
//   res.send('Sample listing created');
// });