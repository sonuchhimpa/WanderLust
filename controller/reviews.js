module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listingx = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listingx.reviews.push(newReview);
    await newReview.save();
    await listingx.save();
    req.flash("success", "Review added");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};