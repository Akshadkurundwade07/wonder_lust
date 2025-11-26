const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

// ------------------ INDEX ------------------
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ------------------ NEW FORM ------------------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ------------------ SHOW LISTING ------------------
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ------------------ CREATE LISTING ------------------
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();

  // Cloudinary file
  const url = req.file.path;
  const filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

// ------------------ EDIT FORM ------------------
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  // Safe handle missing image
  let originalImageUrl =
    listing.image && listing.image.url
      ? listing.image.url
      : "/default.jpg";

  // Apply Cloudinary transform ONLY when URL contains "/upload"
  if (originalImageUrl.includes("/upload")) {
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/w_250"
    );
  }

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// ------------------ UPDATE LISTING ------------------
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update text fields
  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  // Only update image if a new one was uploaded
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// ------------------ DELETE LISTING ------------------
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
