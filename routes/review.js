// ---------------------- Setting packages ---------------------->
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const { reviewSchemaJoi } = require("../schema.js");
const Review = require("../Model/review");
const Listing = require("../Model/listing.js");

// ------------------------- Function ------------------------->
const validateReview = (req, res, next) => {
  let { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

// ------------------------- API ROUTE ------------------------->
// Add review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingx = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listingx.reviews.push(newReview);
    await newReview.save();
    await listingx.save();
    req.flash("success", "Review added");

    res.redirect(`/listings/${id}`);
  })
);

// Delete review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
