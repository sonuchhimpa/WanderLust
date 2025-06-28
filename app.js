// ---------------------- Setting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const listing = require("./Model/listing");
const path = require("path");
const methodOverride = require("method-override");

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

// Show Route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listingData = await listing.findById(id);
  res.render("listings/show.ejs", { listingData });
});

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post("/listings",async (req,res)=>{
  const newlisting = new listing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
});

// Edit Route
app.get("/listing/:id/edit" ,async (req,res)=>{
  let {id} = req.params;
  let data = await listing.findById(id);
  res.render("listings/edit.ejs" ,{data});
});

// Update Route
app.put("/listing/:id", async(req,res)=>{
  let {id} = req.params;
  await listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listing/${id}`);
});

// Delete Route
app.delete("/listing/:id", async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});



// Test Route
// app.get("/testListing" , async (req,res)=>{
//     let sampleListing = new listing({
//         title : "My new Home",
//         description : "by the beach",
//         image : {filename : "listingimage"},
//         price : 1200,
//         location : "goa",
//         country : "India"
//     })
//     await sampleListing.save();
//     console.log("Sample is saved");
//     res.send("Successful testing");
// });

// ---------------------- Server Setup ---------------------->
app.listen(port, () => {
  console.log(`App is listning on port: 8080 ${port}`);
});
