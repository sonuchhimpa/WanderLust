// ---------------------- Setting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const listing = require("./Model/listing");
const path = require("path");



// ---------------------- Connection setup ---------------------->
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("Connected to Database......");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}


// ------------------  Basic App Configuration ------------------>
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


// ------------------------- API ROUTE ------------------------->
// Home Route
app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

//Index Route
app.get("/listings" ,async (req,res)=>{
    let listings = await listing.find({});
    res.render("listings/index.ejs",{listings})
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
app.listen(port,()=>{
    console.log(`App is listning on port: 8080 ${port}`);
});

