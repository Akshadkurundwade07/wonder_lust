const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description: String,
  img : {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/025/465/196/small_2x/vacation-beach-error-404-flash-message-lying-sunbathing-girl-looking-at-ocean-empty-state-ui-design-page-not-found-popup-cartoon-image-flat-illustration-concept-on-white-background-vector.jpg ",
    set: (v) => v ==="" ? "https://static.vecteezy.com/system/resources/thumbnails/025/465/196/small_2x/vacation-beach-error-404-flash-message-lying-sunbathing-girl-looking-at-ocean-empty-state-ui-design-page-not-found-popup-cartoon-image-flat-illustration-concept-on-white-background-vector.jpg " : v
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;