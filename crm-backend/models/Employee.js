const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date },
  mobileIndia: { type: String },
  designation: { type: String },
  department: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema, "employees");
