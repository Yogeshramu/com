const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  partyId: { type: String, required: true }, // customerId like NARS001
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  address: { type: String },
  note: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Sale", saleSchema);
