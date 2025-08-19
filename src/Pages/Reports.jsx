import { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [reportType, setReportType] = useState('sales');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/${reportType}`);
      const filtered = res.data.filter(item => {
        const date = new Date(item.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        return (!from || date >= from) && (!to || date <= to);
      });
      setData(filtered);
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  };

  const generatePDF = async () => {
    try {
      const params = new URLSearchParams({
        reportType,
        fromDate,
        toDate,
      });

      const response = await fetch(
        `http://localhost:8000/api/reports/pdf?${params.toString()}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={reportType}
          onChange={e => setReportType(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="sales">Sales</option>
          <option value="expenses">Expenses</option>
          <option value="purchase">Purchase</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>

        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Generate PDF
        </button>
      </div>

      <div className="overflow-auto mt-4">
        <table className="w-full table-auto border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              {reportType === 'sales' && (
                <>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Customer</th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Qty</th>
                  <th className="border px-4 py-2">Amount</th>
                </>
              )}
              {reportType === 'purchase' && (
                <>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Qty</th>
                  <th className="border px-4 py-2">Amount</th>
                </>
              )}
              {reportType === 'expenses' && (
                <>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Details</th>
                  <th className="border px-4 py-2">Amount</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="border px-4 py-2">{i + 1}</td>
                {reportType === 'sales' && (
                  <>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.customer}</td>
                    <td className="border px-4 py-2">{item.product}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">₹{item.amount}</td>
                  </>
                )}
                {reportType === 'purchase' && (
                  <>
                    <td className="border px-4 py-2">{item.date || '-'}</td>
                    <td className="border px-4 py-2">{item.name || item.productName}</td>
                    <td className="border px-4 py-2">{item.quantity || '-'}</td>
                    <td className="border px-4 py-2">₹{item.totalPrice}</td>
                  </>
                )}
                {reportType === 'expenses' && (
                  <>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2">{item.category}</td>
                    <td className="border px-4 py-2">{item.details || '-'}</td>
                    <td className="border px-4 py-2">₹{item.amount}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
