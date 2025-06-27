const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listningSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : String,
        url : {
            type : String,
            default : "https://plus.unsplash.com/premium_photo-1685133855379-711aa008f7ba?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1685133855379-711aa008f7ba?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },
    price : Number,
    location : String,
    country : String
});

const listing = mongoose.model("listing", listningSchema);
module.exports = listing;