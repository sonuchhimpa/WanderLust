const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../Model/listing.js");

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

// -------------------- Initialize Database -------------------->
const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data.data);
  console.log("Data is initialized");
};

initDB();
