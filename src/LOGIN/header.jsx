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

  const handleLogout = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logout.php`, {
      method: "POST",
      credentials: "include",
    });

    const text = await res.text();
    console.log("Raw logout response:", text);

    const data = JSON.parse(text);
    if (data.success) {

      setRole(null);
      navigate("/LOGIN/login");
    }
  } catch (err) {
    console.error("Failed to logout session:", err);
  }
};
if (user === undefined) return <p>Loading...</p>;

// Not logged in
if (!user) return null;

  return (
  <header className="bg-white w-full h-16 flex items-center justify-between fixed top-0 left-0 z-50 px-4 md:px-8 shadow-sm border-b border-emerald-100">
    {/* Logo */}
    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg primary-color flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-sm md:text-lg">DB</span>
      </div>
      <span className="text-lg md:text-2xl font-semibold primary-color bg-clip-text text-transparent tracking-tight hidden sm:block">
        DigiBarangay
      </span>
    </div>

    {/* Navigation — User */}
    {role === "user" && (
      <nav className="flex items-center gap-2 md:gap-6 overflow-visible">
        <Emergency />
        <AdditionalInfo />
        <Profile />
        <UserNotificationBell />
        <HeaderRequests filterUserId={user.id} />
        <button
          className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-red-600 transition font-medium shrink-0"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline text-sm md:text-base">Logout</span>
        </button>
      </nav>
    )}

    {/* Navigation — Admin */}
    {role === "admin" && (
      <div className="flex items-center gap-2 md:gap-6 overflow-visible">
        <NotificationBell />
        <HeaderRequests />
        <button
          className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-red-600 transition font-medium shrink-0"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline text-sm md:text-base">Logout</span>
        </button>
        <div className="w-px h-6 primary-color hidden md:block"></div>
        <span className="primary-color bg-clip-text text-transparent text-xs md:text-sm font-semibold hidden md:block whitespace-nowrap">
          Admin Panel
        </span>
      </div>
    )}
  </header>
);
}

export default Header;