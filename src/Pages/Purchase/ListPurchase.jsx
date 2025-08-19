import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaDownload, FaSearch, FaEye } from "react-icons/fa";

const ListPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewImages, setViewImages] = useState([]);

  useEffect(() => fetchPurchases(), []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/purchase?from=${fromDate}&to=${toDate}`
      );
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPurchases();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this purchase?")) return;
    await axios.delete(`http://localhost:8000/purchase/${id}`);
    fetchPurchases();
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:8000/purchase/${id}/download`, "_blank");
  };

  const filtered = purchases.filter((p) =>
    Object.values({
      partyId: p.partyId,
      name: p.partyInfo?.name || p.purchasedFrom,
      phone: p.partyInfo?.phone || p.phone,
      email: p.partyInfo?.email || p.email,
      address: p.partyInfo?.address || p.address,
      productName: p.productName,
      note: p.note,
    })
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Filter & Search */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
        {["From Date", "To Date"].map((label, i) => (
          <div key={i} className="flex-1 min-w-[150px]">
            <label className="block text-sm">{label}</label>
            <input
              type="date"
              value={i === 0 ? fromDate : toDate}
              onChange={(e) =>
                i === 0 ? setFromDate(e.target.value) : setToDate(e.target.value)
              }
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
        <div className="flex-1 relative">
          <label className="block text-sm">Search</label>
          <input
            type="text"
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full pl-8"
          />
          <FaSearch className="absolute top-3 left-2 text-gray-500" />
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm table-fixed">
          <thead className="bg-gray-100 text-left">
            <tr>
              {[
                "ID",
                "Party Name",
                "Phone",
                "Email",
                "Address",
                "Date",
                "Product",
                "Quantity",
                "Amount",
                "Note",
                "Images",
                "Actions",
              ].map((h) => (
                <th key={h} className="p-2 border">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b align-top">
                <td className="p-2 border">{p.partyId}</td>
                <td className="p-2 border">{p.partyInfo?.name || p.purchasedFrom}</td>
                <td className="p-2 border">{p.partyInfo?.phone || p.phone}</td>
                <td className="p-2 border">{p.partyInfo?.email || p.email}</td>
                <td className="p-2 border">{p.partyInfo?.address || p.address}</td>
                <td className="p-2 border">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-2 border">{p.productName}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border">{p.amount}</td>
                <td className="p-2 border">{p.note}</td>
                <td className="p-2 border text-center">
                  {p.images?.length ? (
                    <button
                      onClick={() =>
                        setViewImages(
                          p.images.map(
                            (img, i) =>
                              `http://localhost:8000/purchase/${p._id}/image/${i}`
                          )
                        )
                      }
                      className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                      title="View Images"
                    >
                      <FaEye />
                    </button>
                  ) : (
                    "--"
                  )}
                </td>
                <td className="p-2 border flex space-x-2">
                  <button onClick={() => handleDownload(p._id)} className="p-2 bg-yellow-500 text-white rounded">
                    <FaDownload />
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="p-2 bg-red-500 text-white rounded">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {viewImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setViewImages([])}
        >
          <div className="bg-white p-4 rounded shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {viewImages.map((url, i) => (
              <img key={i} src={url} alt={`Purchase image ${i + 1}`} className="max-h-[60vh] object-contain border rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPurchase;
