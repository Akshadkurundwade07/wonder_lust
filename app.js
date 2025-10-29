const express = require('express');

const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); // Adjust the path as necessary
const path = require("path");   
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require('./models/review.js');
const listings = require("./routes/listing.js")


const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); 
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


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


const validateListing = (req, res, next) => {
  let {error} = lisitingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

app.use("/listings",listings);

// adding review
// post route
app.post("/listings/:id/reviews",validateReview,wrapasync(async(req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));
//Index route
app.post("/listings/:id/reviews",validateReview,wrapasync(async(req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));

// delete review route 
app.delete("/listings/:id/reviews/:reviewId",wrapasync(async(req,res) =>{
  let { id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviewS: reviewId}});
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`)
}))




app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));

});

app.use((err,req,res,next)=> { 
  let{statusCode=500, message="something went wrong"} = err; 
  res.status(statusCode).render("error.ejs", {err});
})