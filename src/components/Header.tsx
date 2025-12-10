import { Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import ariesLogo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* LEFT SIDE LOGO */}
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <img src={ariesLogo} className="h-12 cursor-pointer" />
        </Link>

        {/* TOP NAV MENU */}
        <nav className="flex gap-6 text-sm font-semibold">
          <Link className="hover:text-orange-600" to="/admin">
            Dashboard
          </Link>

          <Link className="hover:text-orange-600" to="/admin/city">
            City Master
          </Link>

          <Link className="hover:text-orange-600" to="/admin/industry">
            Industry Master
          </Link>

          <Link className="hover:text-orange-600" to="/admin/expo">
            Expo Master
          </Link>

          <Link className="hover:text-orange-600" to="/admin/users">
            User Master
          </Link>
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <button
        className="bg-[#005B9D] text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}
