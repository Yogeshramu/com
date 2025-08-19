const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  originalname: String,
  mimetype: String,
  buffer: Buffer,
});

const purchaseSchema = new mongoose.Schema({
  date: Date,
  phone: String,
  email: String,
  productName: String,
  purchasedFrom: String,
  amount: Number,
  address: String,
  quantity: Number,
  note: String,
  partyId: String,
  images: [imageSchema],
});

module.exports = mongoose.model('Purchase', purchaseSchema);
