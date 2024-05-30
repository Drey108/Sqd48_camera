const mongoose = require('mongoose');

// Define the schema for SellItem
const sellItemSchema = new mongoose.Schema({
  name: String,
  imgurl: String,
  price: Number,
  created_by: { type: String, required: true } 
});

// Create a model based on the schema, specifying the collection name
const SellItem = mongoose.model('SellItem', sellItemSchema, 'cartitems');

module.exports = SellItem;