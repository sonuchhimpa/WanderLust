// ---------------------- Getting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";


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



// ---------------------- Server Setup ---------------------->
app.listen(port,()=>{
    console.log(`App is listning on port: 8080 ${port}`);
});

