const express = require("express");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");

const router = express.Router();

// Define your schemas (or import from models)
const salesSchema = new mongoose.Schema({
  date: Date,
  customer: String,
  product: String,
  quantity: Number,
  amount: Number,
});
const expenseSchema = new mongoose.Schema({
  date: Date,
  category: String,
  details: String,
  amount: Number,
});
const purchaseSchema = new mongoose.Schema({
  date: Date,
  name: String,
  quantity: Number,
  totalPrice: Number,
});

const Sales = mongoose.models.Sales || mongoose.model("Sales", salesSchema, "sales");
const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema, "expenses");
const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema, "purchases");

// Helper to build date filter
function buildDateQuery(fromDate, toDate) {
  const query = {};
  if (fromDate) query.$gte = new Date(fromDate);
  if (toDate) query.$lte = new Date(toDate);
  return Object.keys(query).length ? query : null;
}

// Fetch report data by type
async function getReportData(reportType, fromDate, toDate) {
  const dateQuery = buildDateQuery(fromDate, toDate);
  const filter = dateQuery ? { date: dateQuery } : {};

  switch (reportType) {
    case "sales":
      return await Sales.find(filter).sort({ date: 1 }).lean();
    case "expenses":
      return await Expense.find(filter).sort({ date: 1 }).lean();
    case "purchase":
      return await Purchase.find(filter).sort({ date: 1 }).lean();
    default:
      return [];
  }
}

router.get("/pdf", async (req, res) => {
  try {
    const { reportType = "sales", fromDate, toDate } = req.query;
    const data = await getReportData(reportType, fromDate, toDate);

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Disposition", `attachment; filename=${reportType}-report.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(22).font("Helvetica-Bold").text(`${reportType.toUpperCase()} Report`, { align: "center", underline: true });
    doc.moveDown();

    // Date range info
    if (fromDate || toDate) {
      const fromStr = fromDate ? new Date(fromDate).toLocaleDateString() : "Start";
      const toStr = toDate ? new Date(toDate).toLocaleDateString() : "End";
      doc.fontSize(10).font("Helvetica-Oblique").fillColor("#555").text(`Date Range: ${fromStr} to ${toStr}`, { align: "center" });
      doc.moveDown();
      doc.fillColor("black");
    }

    // Setup table headers & rows based on reportType
    let headers = [];
    let rows = [];

    if (reportType === "sales") {
      headers = ["#", "Date", "Customer", "Product", "Qty", "Amount"];
      rows = data.map((item, i) => [
        i + 1,
        new Date(item.date).toLocaleDateString(),
        item.customer,
        item.product,
        item.quantity,
        `₹${item.amount.toFixed(2)}`,
      ]);
    } else if (reportType === "purchase") {
      headers = ["#", "Date", "Product", "Qty", "Amount"];
      rows = data.map((item, i) => [
        i + 1,
        item.date ? new Date(item.date).toLocaleDateString() : "-",
        item.name || "-",
        item.quantity || "-",
        `₹${item.totalPrice?.toFixed(2) || 0}`,
      ]);
    } else if (reportType === "expenses") {
      headers = ["#", "Date", "Category", "Details", "Amount"];
      rows = data.map((item, i) => [
        i + 1,
        new Date(item.date).toLocaleDateString(),
        item.category,
        item.details || "-",
        `₹${item.amount.toFixed(2)}`,
      ]);
    }

    // Layout constants
    const tableTop = doc.y + 20;
    const rowHeight = 20;
    const maxRowsPerPage = 25;

    let colWidths;
    if (reportType === "sales") colWidths = [30, 70, 110, 110, 50, 70];
    else if (reportType === "purchase") colWidths = [30, 90, 160, 50, 70];
    else colWidths = [30, 70, 100, 150, 70];

    // Draw table header
    function drawTableHeader(y) {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#222");
      let x = doc.page.margins.left;
      headers.forEach((header, i) => {
        doc.text(header, x + 2, y + 5, { width: colWidths[i], align: "left" });
        x += colWidths[i];
      });
      doc.strokeColor("#aaaaaa").lineWidth(1)
        .moveTo(doc.page.margins.left, y + rowHeight)
        .lineTo(doc.page.width - doc.page.margins.right, y + rowHeight)
        .stroke();
    }

    // Draw a row
    function drawRow(row, y) {
      doc.font("Helvetica").fontSize(10).fillColor("black");
      let x = doc.page.margins.left;
      row.forEach((cell, i) => {
        doc.text(cell, x + 2, y + 5, {
          width: colWidths[i],
          align: i === row.length - 1 ? "right" : "left",
        });
        x += colWidths[i];
      });
      doc.strokeColor("#eeeeee").lineWidth(0.5)
        .moveTo(doc.page.margins.left, y + rowHeight)
        .lineTo(doc.page.width - doc.page.margins.right, y + rowHeight)
        .stroke();
    }

    let y = tableTop;
    let rowCount = 0;

    drawTableHeader(y);
    y += rowHeight;

    for (let i = 0; i < rows.length; i++) {
      if (rowCount >= maxRowsPerPage) {
        doc.addPage();
        y = doc.page.margins.top;
        drawTableHeader(y);
        y += rowHeight;
        rowCount = 0;
      }
      drawRow(rows[i], y);
      y += rowHeight;
      rowCount++;
    }

    if (rows.length === 0) {
      doc.font("Helvetica-Oblique").fontSize(12).fillColor("#666").text("No records found for the selected criteria.", doc.page.margins.left, y + 10);
    }

    // Footer page numbers
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor("#999").text(`Page ${i + 1} of ${range.count}`, doc.page.width - doc.page.margins.right - 50, doc.page.height - 30, { align: "right" });
    }

    doc.end();

  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
