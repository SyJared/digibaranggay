import { useContext, useState, useRef, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/logout.php`, {
        method: "POST",
        credentials: "include",
      });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success) {
        setRole(null);
        navigate("/LOGIN/login");
      }
    } catch (err) {
      console.error("Failed to logout session:", err);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  if (user === undefined) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <header className="bg-white w-full h-14 md:h-16 flex items-center justify-between fixed top-0 left-0 z-50 px-3 md:px-8 shadow-sm border-b border-emerald-100">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg primary-color flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm md:text-lg">DB</span>
        </div>
        <span className="text-lg md:text-2xl font-semibold primary-color bg-clip-text text-transparent tracking-tight hidden sm:block">
          DigiBarangay
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-0 md:gap-3 shrink-0">

        {/* ── USER ROLE ── */}
        {role === "user" && (
          <>
            {/* Always visible: notifications + requests */}
            <UserNotificationBell />
            <HeaderRequests filterUserId={user.id} />

            {/* Burger menu (mobile only) */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {menuOpen && (
                <div className="fixed top-14 right-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Profile */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1 px-1">
                      Account
                    </p>
                    <Profile />
                  </div>

                  {/* Emergency + Additional Info */}
                  <div className="px-3 py-2 border-b border-gray-100 flex flex-col gap-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1 px-1">
                    Quick Actions
                  </p>
                  <div className="flex items-center gap-2">
                    <Emergency />
                    <span className="text-sm text-gray-700 font-medium">Emergency Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdditionalInfo />
                    <span className="text-sm text-gray-700 font-medium">Additional Information</span>
                  </div>
                </div>

                  {/* Logout */}
                  <div className="px-3 py-2">
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: show all items normally */}
            <div className="hidden md:flex items-center gap-3">
              <Emergency />
              <AdditionalInfo />
              <Profile />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium p-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </>
        )}

        {/* ── ADMIN ROLE ── */}
        {role === "admin" && (
          <>
            <NotificationBell />
            <HeaderRequests />
            <button
              className="flex items-center gap-1 p-2 md:p-3 text-gray-700 hover:text-red-600 transition font-medium shrink-0"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline text-sm md:text-base ml-1">Logout</span>
            </button>
            <span className="primary-color bg-clip-text text-transparent text-xs md:text-sm font-semibold hidden md:block whitespace-nowrap">
              Admin Panel
            </span>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;