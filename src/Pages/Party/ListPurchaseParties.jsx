import React, { useEffect, useState } from "react";
import axios from "axios";

const ListPurchaseParties = () => {
  const [parties, setParties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    companyName: "",
    accountDetails: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/purchase-parties");
      setParties(res.data);
    } catch (err) {
      console.error("Error fetching purchase parties:", err);
    }
  };

  const handleEditClick = (party) => {
    setEditingId(party.partyId);
    setEditData({
      name: party.name,
      companyName: party.companyName || "",
      accountDetails: party.accountDetails || "",
      phone: party.phone || "",
      email: party.email || "",
      address: party.address || "",
      notes: party.notes || ""
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/purchase-parties/${editingId}`, editData);
      setEditingId(null);
      fetchParties();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this party?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/purchase-parties/${id}`);
      fetchParties();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const filtered = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Purchase Parties</h2>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />
        <button
          onClick={handleReset}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Party ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Account Details</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">No matching results</td>
              </tr>
            ) : (
              filtered.map((party) =>
                editingId === party.partyId ? (
                  <tr key={party.partyId} className="bg-yellow-50">
                    <td className="border p-2">{party.partyId}</td>
                    <td className="border p-2">
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="companyName"
                        value={editData.companyName}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="accountDetails"
                        value={editData.accountDetails}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="address"
                        value={editData.address}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        name="notes"
                        value={editData.notes}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={party.partyId} className="hover:bg-gray-50">
                    <td className="border p-2">{party.partyId}</td>
                    <td className="border p-2">{party.name}</td>
                    <td className="border p-2">{party.companyName}</td>
                    <td className="border p-2">{party.accountDetails}</td>
                    <td className="border p-2">{party.phone}</td>
                    <td className="border p-2">{party.email}</td>
                    <td className="border p-2">{party.address}</td>
                    <td className="border p-2">{party.notes}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleEditClick(party)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(party.partyId)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPurchaseParties;
