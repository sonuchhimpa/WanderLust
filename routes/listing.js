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

// ------------------------- API ROUTE ------------------------->
//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  })
);

// New Route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync((req, res) => {
    res.render("listings/new.ejs");
  })
);

// Update Creation Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    console.log(newlisting);
    console.log(req.user);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
  })
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listingData) {
      req.flash("error", "listing not existed");
      return res.redirect("/listings");
    }
    console.log(listingData);
    res.render("listings/show.ejs", { listingData });
  })
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
