const mongoose = require("mongoose");
const pagination = require('mongoose-paginate-v2')
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: String,
  price: Number,
  rating: Number,
  image: String,
  category: String,
});

hotelSchema.plugin(pagination )
const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
