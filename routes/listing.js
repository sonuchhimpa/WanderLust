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
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
      req.flash("error", "listing not existed");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { data });
  })
);

// Update Edition Route
router.put(
  "/:id",
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
      throw new expressError(400, "Send a valid data");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated successfully");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
