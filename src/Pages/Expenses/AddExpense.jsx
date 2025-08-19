import { useState } from "react";
import axios from "axios";

const AddExpense = () => {
  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    details: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/expenses", form);
      alert("Expense added successfully!");
      setForm({
        date: "",
        category: "",
        amount: "",
        details: "",
      });
    } catch (err) {
      console.error("Failed to add expense:", err);
      alert("Failed to add expense. Check console for details.");
    }
  };

  const handleReset = () => {
    setForm({
      date: "",
      category: "",
      amount: "",
      details: "",
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="travel">Travel</option>
          <option value="office">Office Supplies</option>
          <option value="utilities">Utilities</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="Details (optional)"
          className="w-full border px-4 py-2 rounded"
          rows={3}
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Expense
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
