var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

function seedDB()
{
  console.log("SeedDB is Connected!");
}

// Comment.create(
//   {
//     text: "This place is great, but I was there was an internet",
//     author: "Homer"
//   }
// )

module.exports = seedDB;