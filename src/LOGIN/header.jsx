import { useContext } from "react";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";
import { RoleContext } from "../rolecontext";
import HeaderRequests from "./headerrequests";
import Profile from "./profile";
import { RequestContext } from "../requestList";
import NotificationBell from "./notif";

function Header() {
  const {user} =useContext(RequestContext);
  const {role, setRole} = useContext(RoleContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setRole('');
    localStorage.removeItem('user');
    navigate('/LOGIN/login');
  };
console.log(role);
  return (
    <header className="bg-white l w-full h-16 flex items-center justify-between fixed top-0 left-0 z-50 px-8 shadow-sm border-b border-emerald-100">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg primary-color flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">DB</span>
        </div>
        <span className="text-2xl font-semibold primary-color bg-clip-text text-transparent tracking-tight">
          DigiBaranggay
        </span>
      </div>

      {role === 'user' && (
        <nav className="flex items-center gap-6">
          <Profile />
          <HeaderRequests />
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-medium"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      )}

      {role === 'admin' && (
        <div className="flex items-center gap-6">
          <NotificationBell />
          <button
            className="text-gray-700 hover:text-red-600 transition font-medium flex items-center gap-2"
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