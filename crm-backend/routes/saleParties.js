const express = require("express");
const router = express.Router();
const SaleParty = require("../models/SaleParty");

// Generate unique NAMS ID
// Generate unique NARS ID
const generatePartyId = async () => {
  const count = await SaleParty.countDocuments({ type: "sale" });
  const nextNum = (count + 1).toString().padStart(3, "0");
  return `NARS${nextNum}`;
};
// GET /api/sale-parties/generate-id - Generate next NARS ID
router.get("/generate-id", async (req, res) => {
  try {
    const count = await SaleParty.countDocuments();
    const nextNum = (count + 1).toString().padStart(3, "0");
    res.json({ partyId: `NARS${nextNum}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /api/sale-parties - Add a new sale party (customer)
// GET /api/sale-parties/search/:query - Search by name or partyId
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const results = await SaleParty.find({
      $or: [
        { name: { $regex: new RegExp(query, "i") } },
        { partyId: { $regex: new RegExp(query, "i") } }
      ]
    });
    if (results.length === 0) return res.status(404).json({ error: "No matches found" });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const partyId = await generatePartyId();
    const party = new SaleParty({ partyId, name, phone, email, address });
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sale-parties - Get all sale parties
router.get("/", async (req, res) => {
  try {
    const parties = await SaleParty.find().sort({ createdAt: -1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sale-parties/:id - Get sale party by ID (NAMSxxx)
router.get("/:id", async (req, res) => {
  try {
    const party = await SaleParty.findOne({ partyId: req.params.id });
    if (!party) return res.status(404).json({ error: "Sale party not found" });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    // Destructure only allowed fields
    const { name, phone, email, address } = req.body;

    const updated = await SaleParty.findOneAndUpdate(
      { partyId: req.params.id },
      { name, phone, email, address }, // ❌ Do not allow partyId to update
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Party not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update party" });
  }
});


// DELETE sale party
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SaleParty.findOneAndDelete({ partyId: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Party not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete party" });
  }
});

module.exports = router;
