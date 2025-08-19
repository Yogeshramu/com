import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    purchases: 0,
    sales: 0,
    expenses: 0,
    employees: 0,
    revenue: 0,
    profit: 0
  });

  const [recentActivities] = useState([
    { id: 1, type: 'sale', desc: 'New sale: Gold Ring - ₹25,000', time: '2 hours ago', icon: '💰' },
    { id: 2, type: 'purchase', desc: 'Purchase: Silver Chain - ₹15,000', time: '4 hours ago', icon: '🛒' },
    { id: 3, type: 'employee', desc: 'New employee added: John Doe', time: '1 day ago', icon: '👤' },
    { id: 4, type: 'expense', desc: 'Office rent paid - ₹12,000', time: '2 days ago', icon: '💸' },
    { id: 5, type: 'attendance', desc: '15 employees marked present', time: '3 days ago', icon: '✅' }
  ]);

  const quickActions = [
    { title: 'Add Sale', link: '/sales/add', icon: '💰', color: 'bg-green-500' },
    { title: 'Add Purchase', link: '/purchase/add', icon: '🛒', color: 'bg-blue-500' },
    { title: 'Add Employee', link: '/employee/add', icon: '👤', color: 'bg-purple-500' },
    { title: 'Add Expense', link: '/expenses/add', icon: '💸', color: 'bg-red-500' },
    { title: 'Mark Attendance', link: '/attendance', icon: '✅', color: 'bg-yellow-500' },
    { title: 'View Reports', link: '/reports', icon: '📊', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    // Simulate fetching stats
    setStats({
      purchases: 156,
      sales: 243,
      expenses: 89,
      employees: 25,
      revenue: 1250000,
      profit: 350000
    });
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Sales</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.sales}</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Purchases</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.purchases}</p>
            </div>
            <div className="text-2xl">🛒</div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Expenses</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.expenses}</p>
            </div>
            <div className="text-2xl">💸</div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Employees</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.employees}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Revenue</p>
              <p className="text-lg md:text-xl font-bold text-green-600">₹{(stats.revenue/100000).toFixed(1)}L</p>
            </div>
            <div className="text-2xl">📈</div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide">Profit</p>
              <p className="text-lg md:text-xl font-bold text-blue-600">₹{(stats.profit/100000).toFixed(1)}L</p>
            </div>
            <div className="text-2xl">💎</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className={`${action.color} text-white p-3 md:p-4 rounded-lg text-center hover:opacity-90 transition-opacity`}
            >
              <div className="text-xl md:text-2xl mb-1 md:mb-2">{action.icon}</div>
              <div className="text-xs md:text-sm font-medium">{action.title}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-lg">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.desc}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/reports" className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Activities →
          </Link>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Monthly Performance</h2>
          <div className="h-48 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-2">📊</div>
              <p className="text-gray-600 text-sm md:text-base">Chart visualization would go here</p>
              <p className="text-xs text-gray-500 mt-1">Sales vs Purchases trend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products/Services */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Top Selling Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-left py-2 hidden sm:table-cell">Category</th>
                <th className="text-right py-2">Sold</th>
                <th className="text-right py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Gold Ring</td>
                <td className="py-2 text-gray-600 hidden sm:table-cell">Jewelry</td>
                <td className="py-2 text-right">45</td>
                <td className="py-2 text-right font-medium">₹11,25,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Silver Chain</td>
                <td className="py-2 text-gray-600 hidden sm:table-cell">Jewelry</td>
                <td className="py-2 text-right">32</td>
                <td className="py-2 text-right font-medium">₹4,80,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Diamond Earrings</td>
                <td className="py-2 text-gray-600 hidden sm:table-cell">Jewelry</td>
                <td className="py-2 text-right">18</td>
                <td className="py-2 text-right font-medium">₹9,00,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;