import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) return <p className="text-center mt-10">Loading employee data...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Employee Details</h2>
      <p><strong>Full Name:</strong> {employee.fullName}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Mobile:</strong> {employee.mobileIndia}</p>
      <p><strong>Gender:</strong> {employee.gender}</p>
      <p><strong>DOB:</strong> {employee.dob?.slice(0, 10)}</p>
      <p><strong>Designation:</strong> {employee.designation}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Salary:</strong> ₹{employee.salary}</p>
      <p><strong>Created At:</strong> {employee.createdAt?.slice(0, 10)}</p>
    </div>
  );
};

export default ViewEmployee;
