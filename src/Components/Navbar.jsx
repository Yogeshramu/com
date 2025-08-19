import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      <div className="text-lg font-bold">Welcome</div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
