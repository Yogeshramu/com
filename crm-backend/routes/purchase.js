const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const mongoose = require("mongoose");
const multer = require("multer");
const PDFDocument = require("pdfkit");

// Use in-memory storage for images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all purchases
router.get("/", async (req, res) => {
  try {
    const data = await Purchase.aggregate([
      {
        $lookup: {
          from: "purchase_parties",
          localField: "partyId",
          foreignField: "partyId",
          as: "partyInfo",
        },
      },
      { $unwind: { path: "$partyInfo", preserveNullAndEmptyArrays: true } },
      { $sort: { date: -1 } },
    ]);
    const resp = data.map((p) => ({
      ...p,
      images: p.images?.map((img) => ({
        originalname: img.originalname,
        mimetype: img.mimetype,
      })) || [],
    }));
    res.json(resp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// POST new purchase
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) {
      data.images = req.files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));
    }
    const purchase = new Purchase(data);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add purchase" });
  }
});

// PATCH purchase
router.patch("/:id", upload.array("images"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) {
      const existing = (await Purchase.findById(req.params.id)).images || [];
      data.images = existing.concat(
        req.files.map((file) => ({
          originalname: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer,
        }))
      );
    }
    const updated = await Purchase.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update purchase" });
  }
});

// DELETE purchase
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// DOWNLOAD purchase PDF
router.get("/:id/download", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid purchase ID" });
    }

    const purchase = await Purchase.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "purchase_parties",
          localField: "partyId",
          foreignField: "partyId",
          as: "partyInfo",
        },
      },
      {
        $unwind: {
          path: "$partyInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!purchase.length)
      return res.status(404).json({ message: "Purchase not found" });

    const p = purchase[0];
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${p.partyId}.pdf`
    );
    doc.pipe(res);

    doc.fillColor("#1F2937").fontSize(20).text("NUR AFIQ RECYCLING", 50, 50);
    doc.fontSize(10).fillColor("#4B5563");
    doc.text("123 Serap Lane", 50);
    doc.text("Kuala Lumour, Malaysia", 50);
    doc.text("+60 3-1234-5678", 50);
    doc.text("info@nurafiqrecycling.com", 50);

    doc.fontSize(20).fillColor("#1F2937").text("INVOICE", 400, 50, { align: "right" });
    doc.fontSize(10).fillColor("#000");
    doc.text(`Invoice #: ${p.partyId}`, 400, 75, { align: "right" });
    doc.text(`Date: ${p.date ? new Date(p.date).toLocaleDateString() : ""}`, 400, 90, { align: "right" });

    doc.moveDown(2);
    doc.fillColor("#1F2937").fontSize(12).text("Bill To:", 50, 160);
    doc.font("Helvetica").fontSize(10).fillColor("#000");
    doc.text(`${p.partyInfo?.name || p.purchasedFrom}`, 50);
    doc.text(`${p.partyInfo?.address || p.address}`, 50);
    doc.text(`${p.partyInfo?.phone || p.phone}`, 50);
    doc.text(`${p.partyInfo?.email || p.email}`, 50);

    let tableTop = 250;
    const descriptionX = 150;
    const quantityX = 350;
    const unitPriceX = 420;
    const amountX = 500;

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#ffffff");
    doc.rect(50, tableTop, 500, 20).fill("#1F2937");
    doc.text("Product", descriptionX, tableTop + 5);
    doc.text("Quantity", quantityX, tableTop + 5);
    doc.text("Unit Price", unitPriceX, tableTop + 5);
    doc.text("Amount", amountX, tableTop + 5);

    const rowY = tableTop + 25;
    doc.font("Helvetica").fillColor("#000");
    doc.text(p.productName, descriptionX, rowY);
    doc.text(p.quantity, quantityX, rowY);
    doc.text(`${p.amount}`, unitPriceX, rowY);
    doc.text(`${p.amount * p.quantity}`, amountX, rowY);

    const totalY = rowY + 40;
    doc.fontSize(10).font("Helvetica-Bold").text("Subtotal:", 400, totalY);
    doc.text(`${p.amount * p.quantity}`, 500, totalY, { align: "right" });
    doc.text("Total:", 400, totalY + 15);
    doc.text(`${p.amount * p.quantity}`, 500, totalY + 15, { align: "right" });

    doc.fontSize(10).fillColor("gray").text("Thank you for your business!", 50, 750, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
