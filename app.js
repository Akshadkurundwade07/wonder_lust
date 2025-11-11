const express = require('express');
const mongoose = require('mongoose');
const path = require("path");   
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js");

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


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));

});

app.use((err,req,res,next)=> { 
  let{statusCode=500, message="something went wrong"} = err; 
  res.status(statusCode).render("error.ejs", {err});
})