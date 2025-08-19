import React, { useEffect, useState } from "react";
import axios from "axios";

const AddSaleParty = () => {
  const [formData, setFormData] = useState({
    partyId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Fetch partyId on mount
  useEffect(() => {
    const fetchPartyId = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/sale-parties/generate-id");
        setFormData((prev) => ({ ...prev, partyId: res.data.partyId }));
      } catch (err) {
        console.error("Failed to fetch sale party ID", err);
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
      await axios.post("http://localhost:8000/api/sale-parties", formData);
      alert("Sale party added successfully!");
      setFormData({ partyId: "", name: "", phone: "", email: "", address: "" });

      // Refresh new partyId
      const res = await axios.get("http://localhost:8000/api/sale-parties/generate-id");
      setFormData((prev) => ({ ...prev, partyId: res.data.partyId }));
    } catch (err) {
      alert("Failed to add sale party");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Add Sale Party</h2>

      <input
        type="text"
        name="partyId"
        value={formData.partyId}
        disabled
        className="w-full border p-2 rounded bg-gray-100"
        placeholder="Party ID"
      />

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Customer Name"
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-2 rounded"
      />
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Add Party
      </button>
    </form>
  );
};

export default AddSaleParty;
