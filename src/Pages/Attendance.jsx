import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceData, setAttendanceData] = useState({}); // { employeeId: "Present" }
  const [summaryEmployeeId, setSummaryEmployeeId] = useState("");
  const [summaryStartDate, setSummaryStartDate] = useState("");
  const [summaryEndDate, setSummaryEndDate] = useState("");
  const [summary, setSummary] = useState(null);

  // Fetch employees
  useEffect(() => {
    axios.get("http://localhost:8000/employee")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch attendance for selected date
  useEffect(() => {
    if (!attendanceDate) return;
    axios.get("http://localhost:8000/attendance", { params: { date: attendanceDate } })
      .then(res => {
        // Map attendance to employeeId => status
        const map = {};
        res.data.forEach((att) => {
          map[att.employeeId._id] = att.status;
        });
        setAttendanceData(map);
      })
      .catch(err => console.error(err));
  }, [attendanceDate]);

  // Handle attendance status change per employee
  const handleStatusChange = (employeeId, status) => {
    setAttendanceData(prev => ({ ...prev, [employeeId]: status }));
  };

  // Save all attendance marks for selected date
  const saveAttendance = async () => {
    try {
      await Promise.all(
        employees.map(emp => {
          const status = attendanceData[emp._id] || "Absent"; // Default absent if not marked
          return axios.post("http://localhost:8000/attendance", {
            employeeId: emp._id,
            date: attendanceDate,
            status,
          });
        })
      );
      alert("Attendance saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance.");
    }
  };

  // Fetch attendance summary
  const fetchSummary = () => {
    if (!summaryEmployeeId || !summaryStartDate || !summaryEndDate) {
      alert("Select employee, start and end date for summary.");
      return;
    }
    axios.get("http://localhost:8000/attendance/summary", {
      params: {
        employeeId: summaryEmployeeId,
        startDate: summaryStartDate,
        endDate: summaryEndDate,
      }
    }).then(res => setSummary(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      {/* Mark Attendance Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Mark Attendance</h2>
        <label>
          Select Date:{" "}
          <input
            type="date"
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>

        <table className="w-full mt-4 border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Employee Name</th>
              <th className="border px-2 py-1">Designation</th>
              <th className="border px-2 py-1">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="border-t">
                <td className="border px-2 py-1">{emp.fullName}</td>
                <td className="border px-2 py-1">{emp.designation || "-"}</td>
                <td className="border px-2 py-1">
                  <select
                    value={attendanceData[emp._id] || "Absent"}
                    onChange={e => handleStatusChange(emp._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={saveAttendance}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Attendance
        </button>
      </section>

      {/* Attendance Summary Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Attendance Summary</h2>

        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            value={summaryEmployeeId}
            onChange={e => setSummaryEmployeeId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={summaryStartDate}
            onChange={e => setSummaryStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            value={summaryEndDate}
            onChange={e => setSummaryEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <button
            onClick={fetchSummary}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Summary
          </button>
        </div>

        {summary && (
          <div className="bg-gray-50 p-4 rounded border max-w-md">
            <p>Total Days Recorded: {summary.totalDays}</p>
            <p>Present: {summary.presentCount}</p>
            <p>Absent: {summary.absentCount}</p>
            <p>Leave: {summary.leaveCount}</p>

            <div className="mt-2">
              <p><strong>Dates Present:</strong> {summary.dates.Present.join(", ") || "None"}</p>
              <p><strong>Dates Absent:</strong> {summary.dates.Absent.join(", ") || "None"}</p>
              <p><strong>Dates Leave:</strong> {summary.dates.Leave.join(", ") || "None"}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AttendancePage;
