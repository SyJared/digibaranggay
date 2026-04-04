import { useContext } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../rolecontext";
import HeaderRequests from "./headerrequests";
import Profile from "./profile";
import NotificationBell from "./notif";
import UserNotificationBell from "./userNotificationBell";
import Emergency from "./emergency.";
import AdditionalInfo from "./additionalInfo";

function Header() {
  const { user, role, setRole } = useContext(RoleContext);
  const navigate = useNavigate();
console.log("Header render - user:", user, "role:", role);
  const handleLogout = async () => {
    try {
      await fetch("http://localhost/digibaranggay/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to logout session:", err);
    }

    setRole("");
  
    navigate("/LOGIN/login");
  };
if (user === undefined) return <p>Loading...</p>;

// Not logged in
if (!user) return null;

  return (
    <header className="bg-white w-full h-16 flex items-center justify-between fixed top-0 left-0 z-50 px-8 shadow-sm border-b border-emerald-100">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg primary-color flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">DB</span>
        </div>
        <span className="text-2xl font-semibold primary-color bg-clip-text text-transparent tracking-tight">
          DigiBarangay
        </span>
      </div>

      {/* Navigation */}
      {role === "user" && (
        <nav className="flex items-center gap-6">
          <Emergency />
          <AdditionalInfo />
          <Profile />
          {/* Pass user.id so HeaderRequests filters current user */}
          <UserNotificationBell />
          <HeaderRequests filterUserId={user.id} />
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      )}

      {role === "admin" && (
        <div className="flex items-center gap-6">
          <NotificationBell />
          {/* Admin sees all requests, no filter */}
          <HeaderRequests />
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
          <div className="w-px h-6 primary-color"></div>
          <span className="primary-color bg-clip-text text-transparent text-sm font-semibold">
            Admin Panel
          </span>
        </div>
      )}
    </header>
  );
}

export default Header;