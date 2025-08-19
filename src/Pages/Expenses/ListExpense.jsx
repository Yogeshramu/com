import { useEffect, useState } from "react";
import axios from "axios";

const ListExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:8000/expenses");
    setExpenses(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/expenses/${id}`);
    fetchExpenses();
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm(exp);
  };

  const handleSave = async () => {
    await axios.patch(`http://localhost:8000/expenses/${editingId}`, editForm);
    setEditingId(null);
    fetchExpenses();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expense List</h2>
      <table className="w-full bg-white rounded shadow border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id} className="border-t">
              <td className="px-4 py-2">
                {editingId === exp._id ? (
                  <input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="border px-2"
                  />
                ) : (
                  exp.category
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === exp._id ? (
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="border px-2"
                  />
                ) : (
                  `₹${exp.amount}`
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === exp._id ? (
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="border px-2"
                  />
                ) : (
                  exp.date
                )}
              </td>
              <td className="px-4 py-2 space-x-2">
                {editingId === exp._id ? (
                  <button onClick={handleSave} className="text-green-600">Save</button>
                ) : (
                  <button onClick={() => handleEdit(exp)} className="text-blue-600">Edit</button>
                )}
                <button onClick={() => handleDelete(exp._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListExpense;
