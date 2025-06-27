// ---------------------- Getting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const listing = require("./Model/listing");

// ---------------------- Connection setup ---------------------->
main().then(()=>{
    console.log("Connected to Database......");
})

async function main() {
    await mongoose.connect(mongo_url);
}


// ------------------------- API ROUTE ------------------------->
// Home Route
app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

// Test Route
app.get("/testListing" , async (req,res)=>{
    let sampleListing = new listing({
        title : "My new Home",
        description : "by the beach",
        price : 1200,
        locaton : "goa",
        country : "India"
    })
    await sampleListing.save();
    console.log("Sample is saved");
    res.send("Successful testing");
});


// ---------------------- Server Setup ---------------------->
app.listen(port,()=>{
    console.log(`App is listning on port: 8080 ${port}`);
});

