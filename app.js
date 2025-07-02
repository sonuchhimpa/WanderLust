// ---------------------- Setting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const listing = require("./Model/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");

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
// ------------------------- API ROUTE ------------------------->
// Home Route
app.get("/", (req, res) => {
  res.send("Hi, i am root");
});

//Index Route
app.get("/listings", async (req, res) => {
  let listings = await listing.find({});
  res.render("listings/index.ejs", { listings });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listingData = await listing.findById(id);
  res.render("listings/show.ejs", { listingData });
});

// Update Creation Route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
  })
);

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await listing.findById(id);
  res.render("listings/edit.ejs", { data });
});

// Update Edition Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.all("", (req, res, next) => {
  next(new expressError(404, "Page Not Found!"));
});

// ---------------------- Middlewares ---------------------->
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// ---------------------- Server Setup ---------------------->
app.listen(port, () => {
  console.log(`App is listning on port: 8080 ${port}`);
});
