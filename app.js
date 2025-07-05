// ---------------------- Setting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const Listing = require("./Model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./Model/review");

// ---------------------- Connection setup ---------------------->
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to Database......");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

// ------------------  Basic App Configuration ------------------>
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// ------------------------- Function ------------------------->
const validateListing = (req, res, next) => {
  console.log(req.body);
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};

// ------------------------- API ROUTE ------------------------->
// Home Route
app.get(
  "/",
  wrapAsync((req, res) => {
    res.send("Hi, i am root");
  })
);

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  })
);

// New Route
app.get(
  "/listings/new",
  wrapAsync((req, res) => {
    res.render("listings/new.ejs");
  })
);

// Update Creation Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    console.log(newlisting);
    await newlisting.save();
    res.redirect("/listings");
  })
);

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/show.ejs", { listingData });
  })
);

// Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
  })
);

// Update Edition Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
      throw new expressError(400, "Send a valid data");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Add review Route
app.post("/listings/:id/reviews", validateReview, async (req, res) => {
  let { id } = req.params;
  let listingx = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listingx.reviews.push(newReview);
  await newReview.save();
  await listingx.save();

  res.redirect(`/listings/${id}`);
});

// ---------------------- Middlewares ---------------------->
// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { err });
// });

// ---------------------- Server Setup ---------------------->
app.listen(port, () => {
  console.log(`App is listning on port: ${port}`);
});
