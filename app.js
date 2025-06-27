// Getting packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");


// Home Route API
app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});



// Server Setup
app.listen(8080,()=>{
    console.log("App is listning on port: 8080");
});

