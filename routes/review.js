// ---------------------- Setting packages ---------------------->
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../Model/review");
const Listing = require("../Model/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");


// ------------------------- API ROUTE ------------------------->
// Add review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete review
router.delete(
  "/:reviewId",
  isAuthor,
  isLoggedIn,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
