const mongoose = require("mongoose");

const purchasePartySchema = new mongoose.Schema({
  partyId: { type: String, required: true, unique: true }, // e.g., NAMP001
  type: { type: String, default: "purchase" },
  name: { type: String, required: true },
  companyName: String,
  accountDetails: String, // ✅ Add this line
  phone: String,
  email: String,
  address: String,
  notes: String, // ✅ Add this line
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PurchaseParty", purchasePartySchema, "purchase_parties");
