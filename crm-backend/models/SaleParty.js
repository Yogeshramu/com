const mongoose = require("mongoose");

const salePartySchema = new mongoose.Schema({
  partyId: { type: String, required: true, unique: true },
  type: { type: String, default: "sale" },
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SaleParty", salePartySchema, "sale_parties");
