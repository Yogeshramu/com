const express = require("express");
const router = express.Router();
const Party = require("../models/PurchaseParty");

// Helper to generate unique purchase party ID with NAS prefix
const generatePartyId = async () => {
  const count = await Party.countDocuments({ type: "purchase" });
  const nextNum = (count + 1).toString().padStart(3, "0");
  return `NAS${nextNum}`;
};

// ✅ GET /generate-id → get next NAS party ID
router.get("/generate-id", async (req, res) => {
  try {
    const partyId = await generatePartyId();
    res.json({ partyId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST / → add new purchase party
router.post("/", async (req, res) => {
  try {
    const { name, companyName, phone, email, address, accountDetails, notes } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const partyId = await generatePartyId();
    const newParty = new Party({
      partyId,
      type: "purchase",
      name,
      companyName,
      phone,
      email,
      address,
      accountDetails,
      notes
    });

    await newParty.save();
    res.status(201).json(newParty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET / → fetch all purchase parties
router.get("/", async (req, res) => {
  try {
    const parties = await Party.find({ type: "purchase" }).sort({ createdAt: -1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /search/:name → search by name (case-insensitive)
router.get("/search/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const parties = await Party.find({
      type: "purchase",
      name: { $regex: new RegExp(name, "i") },
    });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /:id → get party by NAS ID
router.get("/:id", async (req, res) => {
  try {
    const party = await Party.findOne({ partyId: req.params.id, type: "purchase" });
    if (!party) return res.status(404).json({ error: "Purchase party not found" });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH /:id → update party info
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Party.findOneAndUpdate(
      { partyId: req.params.id, type: "purchase" },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Purchase party not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE /:id → delete party
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Party.findOneAndDelete({ partyId: req.params.id, type: "purchase" });
    if (!deleted) return res.status(404).json({ error: "Party not found" });
    res.json({ message: "Party deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
