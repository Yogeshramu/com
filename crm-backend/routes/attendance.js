// routes/attendance.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// Mark or update attendance for an employee on a date
router.post("/", async (req, res) => {
  try {
    const { employeeId, date, status, note } = req.body;
    if (!employeeId || !date || !status) {
      return res.status(400).json({ error: "employeeId, date, and status are required" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0); // normalize date

    // Upsert attendance
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: attendanceDate },
      { status, note, date: attendanceDate },
      { new: true, upsert: true }
    );

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// Get attendance for a single date (optionally for all employees)
router.get("/", async (req, res) => {
  try {
    let { date, employeeId } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date query param required (YYYY-MM-DD)" });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const query = { date: queryDate };
    if (employeeId) query.employeeId = employeeId;

    const attendance = await Attendance.find(query).populate("employeeId");
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// Get attendance summary for employee between dates
router.get("/summary", async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    if (!employeeId || !startDate || !endDate) {
      return res.status(400).json({ error: "employeeId, startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Count present/absent/leave and collect dates
    const summary = {
      Present: [],
      Absent: [],
      Leave: [],
    };

    attendanceRecords.forEach((rec) => {
      summary[rec.status].push(rec.date.toISOString().slice(0, 10));
    });

    res.json({
      totalDays: attendanceRecords.length,
      presentCount: summary.Present.length,
      absentCount: summary.Absent.length,
      leaveCount: summary.Leave.length,
      dates: summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance summary" });
  }
});

module.exports = router;
