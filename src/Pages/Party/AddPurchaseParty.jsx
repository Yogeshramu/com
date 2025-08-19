import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPurchaseParty = () => {
  const [formData, setFormData] = useState({
    partyId: "",
    name: "",
    companyName: "",
    phone: "",
    email: "",
    address: "",
    accountDetails: "",
    notes: ""
  });

  useEffect(() => {
    const fetchPartyId = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/purchase-parties/generate-id");
        setFormData(prev => ({ ...prev, partyId: res.data.partyId }));
      } catch (err) {
        console.error("Failed to fetch party ID", err);
      }
    };

    fetchPartyId();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/purchase-parties", formData);
      alert("Purchase party added successfully!");
      setFormData({ partyId: "", name: "", companyName: "", phone: "", email: "", address: "", accountDetails: "", notes: "" });
      const res = await axios.get("http://localhost:8000/api/purchase-parties/generate-id");
      setFormData(prev => ({ ...prev, partyId: res.data.partyId }));
    } catch (err) {
      alert("Error adding purchase party");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Add Purchase Party</h2>

      <input type="text" name="partyId" value={formData.partyId} disabled className="w-full border p-2 rounded bg-gray-100" placeholder="Party ID" />
      <input type="text" name="name" placeholder="Party Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="accountDetails" placeholder="Account Details" value={formData.accountDetails} onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Party</button>
    </form>
  );
};

export default AddPurchaseParty;
