const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const SaleParty = require("../models/SaleParty");

// GET /sales (with aggregation to fetch customer info)
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $lookup: {
          from: "sale_parties",
          localField: "partyId",
          foreignField: "partyId",
          as: "customerInfo"
        }
      },
      { $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true } },
      { $sort: { date: -1 } }
    ]);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /sales
router.post("/", async (req, res) => {
  const sale = new Sale(req.body);
  try {
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /sales/:id
router.patch("/:id", async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSale) return res.status(404).json({ message: "Sale not found" });
    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /sales/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) return res.status(404).json({ message: "Sale not found" });
    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
