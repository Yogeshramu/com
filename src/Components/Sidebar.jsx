import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  BookOpen,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();

  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const toggleDropdown = (menu) => {
    setOpenDropdowns((prev) => {
      const isCurrentlyOpen = prev[menu];
      return isCurrentlyOpen ? {} : { [menu]: true };
    });
  };

  const isActive = (path) => location.pathname === path;
  const startsWith = (basePath) => location.pathname.startsWith(basePath);

  const getActiveIcon = () => {
    if (startsWith("/purchase")) return <ShoppingCart size={24} className="text-green-600" />;
    if (startsWith("/sales")) return <DollarSign size={24} className="text-green-600" />;
    if (startsWith("/expenses")) return <FileText size={24} className="text-green-600" />;
    if (startsWith("/employee")) return <Users size={24} className="text-green-600" />;
    if (startsWith("/party")) return <Building2 size={24} className="text-green-600" />;
    if (startsWith("/attendance")) return <User size={24} className="text-green-600" />;
    if (startsWith("/reports")) return <BookOpen size={24} className="text-green-600" />;
    return <Home size={24} className="text-green-600" />;
  };

  const MenuItem = ({ icon, label, children }) => {
    const isOpen = openDropdowns[label];
    return (
      <div className="mb-1">
        <button
          onClick={() => toggleDropdown(label)}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition group"
        >
          {icon}
          {!collapsed && <span className="ml-3 flex-1 text-left font-medium tracking-wide">{label}</span>}
          {!collapsed && (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 group-hover:rotate-180 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>
        <div className={`ml-3 transition-all ${isOpen ? "max-h-96" : "max-h-0 overflow-hidden"}`}>
          {children}
        </div>
      </div>
    );
  };

  const SubLink = ({ to, label }) => (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `block ml-6 px-4 py-2 text-sm rounded-lg transition font-medium tracking-wide ${
          isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-green-50"
        }`
      }
    >
      {!collapsed && label}
    </NavLink>
  );

  return (
    <>
      {!mobileOpen && (
        <div className="lg:hidden fixed top-2 left-2 z-50">
          <button onClick={toggleMobile}>
            <Menu size={28} />
          </button>
        </div>
      )}

      <aside
        className={`${collapsed ? "w-20" : "w-64"} min-h-screen bg-white border-r shadow-xl rounded-tr-3xl fixed top-0 left-0 z-40 transition-all duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b">
          {!collapsed ? (
            <div className="space-y-1">
              <div>{getActiveIcon()}</div>
              <h2 className="text-xl font-bold text-green-600 tracking-wide">Noor ♻ Afiq</h2>
              <p className="text-xs text-gray-400">Sustainable CRM Panel</p>
            </div>
          ) : (
            getActiveIcon()
          )}
          <button onClick={toggleSidebar} className="hidden lg:block">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button onClick={toggleMobile} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50 transition font-medium tracking-wide ${
                isActive ? "bg-green-100 text-green-700" : "text-gray-700"
              }`
            }
          >
            <Home size={20} className={isActive("/") ? "text-green-600" : ""} />
            {!collapsed && "Dashboard"}
          </NavLink>

          <MenuItem icon={<ShoppingCart size={20} className={startsWith("/purchase") ? "text-green-600" : ""} />} label="Purchase">
            <SubLink to="/purchase/add" label="Add Purchase" />
            <SubLink to="/purchase/list" label="List Purchase" />
          </MenuItem>

          <MenuItem icon={<DollarSign size={20} className={startsWith("/sales") ? "text-green-600" : ""} />} label="Sales">
            <SubLink to="/sales/add" label="Add Sales" />
            <SubLink to="/sales/list" label="List Sales" />
          </MenuItem>

          <MenuItem icon={<FileText size={20} className={startsWith("/expenses") ? "text-green-600" : ""} />} label="Expenses">
            <SubLink to="/expenses/add" label="Add Expense" />
            <SubLink to="/expenses/list" label="List Expense" />
          </MenuItem>

          <MenuItem icon={<Users size={20} className={startsWith("/employee") ? "text-green-600" : ""} />} label="Employees">
            <SubLink to="/employee/add" label="Add Employee" />
            <SubLink to="/employee/list" label="List Employee" />
          </MenuItem>

          <MenuItem icon={<Building2 size={20} className={startsWith("/party") ? "text-green-600" : ""} />} label="Clients">
            <SubLink to="/party/purchaseparty/add" label="Add Supplier" />
            <SubLink to="/party/purchase/list" label="List Supplier" />
            <SubLink to="/party/saleparty/add" label="Add Customers" />
            <SubLink to="/party/sale/list" label="List Customers" />
          </MenuItem>

          <NavLink
            to="/attendance"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50 transition font-medium tracking-wide ${
                isActive ? "bg-green-100 text-green-700" : "text-gray-700"
              }`
            }
          >
            <User size={20} className={isActive("/attendance") ? "text-green-600" : ""} />
            {!collapsed && "Attendance"}
          </NavLink>

          <NavLink
            to="/reports"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50 transition font-medium tracking-wide ${
                isActive ? "bg-green-100 text-green-700" : "text-gray-700"
              }`
            }
          >
            <BookOpen size={20} className={isActive("/reports") ? "text-green-600" : ""} />
            {!collapsed && "Reports"}
          </NavLink>
        </nav>
      </aside>

      <div className={`transition-all duration-300 pt-4 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Your page content here */}
      </div>
    </>
  );
};

export default Sidebar;