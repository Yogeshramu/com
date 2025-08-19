import { useState } from "react";
import axios from "axios";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    mobileIndia: "",
    designation: "",
    department: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      gender: "",
      dob: "",
      mobileIndia: "",
      designation: "",
      department: "",
      email: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remove empty strings for optional fields
    const payload = { ...formData };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });

    try {
      await axios.post("http://localhost:8000/api/employees", payload);
      alert("Employee added successfully!");
      handleReset();
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center mb-2">Add Employee</h2>

      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        placeholder="Full Name"
        className="w-full border p-2 rounded"
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Date of Birth"
      />

      <input
        type="tel"
        name="mobileIndia"
        value={formData.mobileIndia}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Mobile No"
      />

      <input
        type="text"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Designation"
      />

      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Department"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Email"
      />

      <div className="flex justify-between">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Employee
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddEmployee;
