import { useState, useEffect, useMemo, useContext, useRef } from "react";
import { Bell } from "lucide-react";
import { RoleContext } from "../rolecontext";

export default function UserNotificationBell() {
  const { user } = useContext(RoleContext);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
  document.addEventListener("mousedown", handleOutsideClick);
} else {
  document.removeEventListener("mousedown", handleOutsideClick);
}

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  /* ================= FETCH USER NOTIFICATIONS ================= */

  async function fetchNotifications() {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/get_user_notifications.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id: user.id })
        }
      );

      const data = await res.json();

      if (data.success) {
        setNotifications(data.data || []);
        
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [user?.id]);

  /* ================= UNREAD COUNT ================= */

  const unread = useMemo(() => {
    return notifications.filter(n => n.user_read === 0);
  }, [notifications]);

  /* ================= MARK AS READ ================= */

  async function markAllAsRead() {
  if (unread.length === 0) return;

  try {
    await Promise.all(
      unread.map(n =>
        fetch(`${import.meta.env.VITE_API_URL}/api/mark_user_notification_read.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id })
        })
      )
    );

   setNotifications(prev =>
  prev.map(n =>
    unread.some(u => u.id === n.id)
      ? { ...n, user_read: 1 }
      : n
  )
);
  } catch (err) {
    console.error("Mark read error:", err);
  }
}

  /* ================= BELL CLICK ================= */

  function handleClick() {
    const isOpening = !open;
    setOpen(isOpening);

    if (!isOpening) {
      markAllAsRead();
    }
  }

  /* ================= RELATIVE TIME ================= */

  function getRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const seconds = (new Date() - new Date(date)) / 1000;

    const intervals = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
      ["second", 1]
    ];

    for (const [unit, value] of intervals) {
      const diff = seconds / value;
      if (Math.abs(diff) >= 1) return rtf.format(-Math.round(diff), unit);
    }

    return "just now";
  }

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        onClick={handleClick}
        className="relative p-3 hover:bg-gray-100 rounded-full transition"
      >
        <Bell size={24} />

        {unread.length > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {unread.length > 99 ? "99+" : unread.length}
          </span>
        )}
      </button>

      {open && (
  <div
    className="
      fixed left-1/2 -translate-x-1/2 top-16 w-[95vw] 
      md:absolute md:top-full md:right-0 md:w-96 md:mt-2
      bg-white shadow-xl rounded-xl border z-50
    "
  >
    {/* Header */}
    <div className="p-4 md:p-5 border-b">
      <h2 className="font-bold text-lg">Notifications</h2>
    </div>

    {/* Notifications List */}
    <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto divide-y">
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-400">No notifications yet</div>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 md:p-4 transition cursor-pointer flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 ${
              n.user_read === 0
                ? "bg-teal-50 hover:bg-teal-100"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {n.user_read === 0 && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                )}
                <p className="text-sm text-gray-800 truncate">{n.message}</p>
              </div>
              <p className="text-xs text-gray-500 truncate">
                Transaction: {n.transaction}
              </p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap mt-1 sm:mt-0">
              {getRelativeTime(n.created_at)}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
)}

    </div>
  );
}