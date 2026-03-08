import { useState, useEffect, useMemo, useRef } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  const dropdownRef = useRef(null);

  

  /* ================= FETCH NOTIFICATIONS ================= */

  async function fetchNotifications() {
    try {
      const res = await fetch(
        "http://localhost/digibaranggay/get_notifications.php",
        { credentials: "include" }
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
  }, []);

  /* ================= FILTERS (unread only) ================= */

  const newUnread = useMemo(() => {
    return notifications.filter(n => n.type === "new" && n.is_read === 0);
  }, [notifications]);

  const requestAgainUnread = useMemo(() => {
    return notifications.filter(n => n.type === "request_again" && n.is_read === 0);
  }, [notifications]);

  const totalBadge = newUnread.length + requestAgainUnread.length;

  const currentList = activeTab === "new" ? newUnread : requestAgainUnread;

  /* ================= MARK AS READ ================= */

  async function markAllAsRead(list) {
    if (list.length === 0) return;

    await Promise.all(
      list.map(n =>
        fetch("http://localhost/digibaranggay/mark_notification_read.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id })
        })
      )
    );

    setNotifications(prev =>
      prev.map(n =>
        list.find(u => u.id === n.id) ? { ...n, is_read: 1 } : n
      )
    );
  }

  /* ================= BELL CLICK ================= */

  function handleClick() {
    const isOpening = !open;
    setOpen(isOpening);

    if (!isOpening) {
      const allUnread = notifications.filter(n => n.is_read === 0);
      markAllAsRead(allUnread);
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
      if (Math.abs(diff) >= 1) {
        return rtf.format(-Math.round(diff), unit);
      }
    }

    return "just now";
  }

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

  return (
    <div className="relative" ref={dropdownRef}>

      <button
        onClick={handleClick}
        className="relative p-3 hover:bg-gray-100 rounded-full transition"
      >
        <Bell size={24} />

        {totalBadge > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalBadge > 99 ? "99+" : totalBadge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-xl border z-50" >

          <div className="p-5 border-b">
            <h2 className="font-bold text-lg">Notifications</h2>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-sm font-medium">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex-1 py-3 ${
                activeTab === "new"
                  ? "border-b-2 border-teal-600 text-teal-600"
                  : "text-gray-500"
              }`}
            >
              New Requests ({newUnread.length})
            </button>

            <button
              onClick={() => setActiveTab("again")}
              className={`flex-1 py-3 ${
                activeTab === "again"
                  ? "border-b-2 border-amber-500 text-amber-600"
                  : "text-gray-500"
              }`}
            >
              Request Again ({requestAgainUnread.length})
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y">

            {currentList.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                No new notifications
              </div>
            )}

            {currentList.map((n) => (
              <div
                key={n.id}
                className="p-4 bg-teal-50 hover:bg-teal-100 transition cursor-pointer"
              >
                <div className="flex justify-between gap-3">
                  <div className="flex-1 space-y-1">

                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      <span>
                        {n.firstname} {n.lastname}
                      </span>
                    </div>

                    <p className="text-sm text-gray-800">{n.message}</p>

                    <p className="text-xs text-gray-500">
                      Transaction: {n.transaction}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {getRelativeTime(n.created_at)}
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}