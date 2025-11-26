const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");

const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage})

// INDEX + CREATE
router.route("/")
    .get(wrapasync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapasync(listingController.createListing)
    );
    

// NEW ROUTE (must come BEFORE any :id route)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// EDIT ROUTE (must come BEFORE show route)
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapasync(listingController.renderEditForm)
);

// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(wrapasync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapasync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapasync(listingController.deleteListing)
    );

module.exports = router;
