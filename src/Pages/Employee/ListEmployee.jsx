import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const ListEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employees");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedEmployee({ ...filteredEmployees[index] });
  };

  const handleChange = (e) => {
    setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/employees/${editedEmployee._id}`, editedEmployee);
      const updatedList = employees.map((emp) =>
        emp._id === editedEmployee._id ? editedEmployee : emp
      );
      setEmployees(updatedList);
      setEditIndex(null);
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee List</h2>

      <input
        type="text"
        placeholder="Search by Name, Email or Designation"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-4 py-2 mb-4 w-full md:w-1/3 rounded"
      />

      <table className="w-full border shadow bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border">Name</th>
            <th className="text-left px-4 py-2 border">Email</th>
            <th className="text-left px-4 py-2 border">Designation</th>
            <th className="text-left px-4 py-2 border">Mobile</th>
            <th className="text-left px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">No employees found.</td>
            </tr>
          ) : (
            filteredEmployees.map((emp, i) => (
              <tr key={emp._id} className="border-t">
                <td className="px-4 py-2">
                  {editIndex === i ? (
                    <input name="fullName" value={editedEmployee.fullName} onChange={handleChange} className="border px-2 py-1 rounded" />
                  ) : (
                    emp.fullName
                  )}
                </td>
                <td className="px-4 py-2">
                  {editIndex === i ? (
                    <input name="email" value={editedEmployee.email} onChange={handleChange} className="border px-2 py-1 rounded" />
                  ) : (
                    emp.email || "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {editIndex === i ? (
                    <input name="designation" value={editedEmployee.designation} onChange={handleChange} className="border px-2 py-1 rounded" />
                  ) : (
                    emp.designation || "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {editIndex === i ? (
                    <input name="mobileIndia" value={editedEmployee.mobileIndia} onChange={handleChange} className="border px-2 py-1 rounded" />
                  ) : (
                    emp.mobileIndia || "-"
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editIndex === i ? (
                    <>
                      <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                      <button onClick={() => setEditIndex(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(i)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(emp._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                      <Link to={`/employees/${emp._id}`}>
  <button className="bg-purple-500 text-white px-3 py-1 rounded">View</button>
</Link>

                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployee;
