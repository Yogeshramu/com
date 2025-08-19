import React, { useEffect, useState } from "react";
import axios from "axios";

const ListSaleParties = () => {
  const [parties, setParties] = useState([]);
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [editData, setEditData] = useState({ name: "", phone: "", email: "", address: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    const res = await axios.get("http://localhost:8000/api/sale-parties");
    setParties(res.data);
  };

  const handleEditClick = (party) => {
    setEditingPartyId(party.partyId);
    setEditData({
      name: party.name,
      phone: party.phone || "",
      email: party.email || "",
      address: party.address || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/sale-parties/${editingPartyId}`, editData);
      setEditingPartyId(null);
      fetchParties();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`http://localhost:8000/api/sale-parties/${id}`);
    fetchParties();
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const filtered = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sales Parties</h2>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />
        <button
          onClick={() => setSearchTerm("")}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Party ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No results found.
                </td>
              </tr>
            ) : (
              filtered.map((party) =>
                editingPartyId === party.partyId ? (
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
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPartyId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={party.partyId} className="hover:bg-gray-50">
                    <td className="border p-2">{party.partyId}</td>
                    <td className="border p-2">{party.name}</td>
                    <td className="border p-2">{party.phone}</td>
                    <td className="border p-2">{party.email}</td>
                    <td className="border p-2">{party.address}</td>
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

export default ListSaleParties;
