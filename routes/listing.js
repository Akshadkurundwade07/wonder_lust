const express = require("express");
const router = express.Router()
const wrapasync = require("../utils/wrapasync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

// index rooute 
router.get ("/", wrapasync(async (req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index",{ allListings });
}));

//New route
router.get("/new", (req,res) => {
  res.render("listings/new.ejs")
})

//Show Route
router.get("/:id",wrapasync(async (req,res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","Cannot find that listing!");
    res.redirect("/listings"); 
  }
  
  res.render("listings/show",{ listing });
  //added some extra changes
}));

//create route
router.post("/",validateListing,wrapasync(async(req,res,next) =>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","Successfully created a new listing!");
    
    res.redirect("/listings");
}));


//edit Route
router.get("/:id/edit", wrapasync(async (req,res) =>{
 
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Cannot find that listing!");
    return res.redirect("/listings"); 
  } 
  res.render("listings/edit.ejs", { listing })
}));

//Update route
router.put("/:id",validateListing,wrapasync(async (req,res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success","Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",wrapasync(async (req,res)=>{
  let {id} = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id)
  console.log(deletedlisting)
  req.flash("success","Listing deleted successfully!");
  res.redirect("/listings")
}));

module.exports = router;