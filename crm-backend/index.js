const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const purchaseRoutes = require("./routes/purchase");
const salesRoutes = require("./routes/sales");
const expenseRoutes = require("./routes/expenses");
const reportRoutes = require("./routes/reports");

const employeeRoute = require("./routes/employee");
const purchasePartyRoutes = require("./routes/purchaseParties");
const salePartyRoutes = require("./routes/saleParties");
const attendanceRouter = require("./routes/attendance");
const app = express();
const path = require('path');
const PORT = 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://jack:jack@cluster0.chfrxhe.mongodb.net/crmDB")
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/purchase", purchaseRoutes);
app.use("/sales", salesRoutes);
app.use("/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/purchase-parties", purchasePartyRoutes);
app.use("/api/sale-parties", salePartyRoutes);
app.use("/attendance", attendanceRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use("/api/employees", employeeRoute);// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
