const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index",{ allListings });
}

module.exports.renderNewForm = (req,res) => {
   res.render("listings/new.ejs")
}

module.exports.showListing = async (req,res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner" );
  if(!listing){
    req.flash("error","Cannot find that listing!");
    res.redirect("/listings"); 
  }
  console.log(listing);
  res.render("listings/show",{ listing });
  //added some extra changes
}

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
    
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  const newlisting = new Listing(req.body.listing);
  
  newlisting.owner = req.user._id;
  newlisting.image = {url, filename};
  newlisting.geometry = response.body.features[0].geometry;
  
  let savedListing = await newlisting.save();
  console.log(savedListing);
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req,res) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Cannot find that listing!");
    return res.redirect("/listings"); 
  } 
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};
 

module.exports.deleteListing = async (req,res)=>{
  let {id} = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id)
  console.log(deletedlisting)
  req.flash("success","Listing deleted successfully!");
  res.redirect("/listings")
}
