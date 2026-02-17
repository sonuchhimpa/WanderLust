// ---------------------- Setting packages ---------------------->
const Listing = require("../Model/listing.js");
const expressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isEditAble,
  isOwner,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controller/listings.js");


// ------------------------- API ROUTE ------------------------->
//Index Route
router.get("/",wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm)
);

// Update Creation Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// Edit Route
router.get(
  "/:id/edit",
  isEditAble,
  isOwner,
  wrapAsync(listingController.editListing)
);

// Update Edition Route
router.put(
  "/:id",
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
