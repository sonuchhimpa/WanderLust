const Listing = require('../Model/listing.js');

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
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
};

module.exports.createListing = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    console.log(newlisting);
    console.log(req.user);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

