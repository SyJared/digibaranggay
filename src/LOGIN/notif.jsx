import { useContext, useState, useMemo } from "react";
import { Bell } from "lucide-react";
import { RequestContext } from "../requestList";

export default function NotificationBell() {
  const { users } = useContext(RequestContext);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(() => {
    return Number(localStorage.getItem("lastSeenNotif")) || 0;
  });

  // new requests for badge
  const newUsers = useMemo(() => {
    return users.filter(r => new Date(r.created_at).getTime() > lastSeen);
  }, [users, lastSeen]);

  // capture dropdown content separately
  const [currentDropdown, setCurrentDropdown] = useState([]);

  function handleClick() {
    setOpen(prev => !prev);

    if (!open) {
      // capture current new requests
      setCurrentDropdown(newUsers);

      // mark as seen
      const now = Date.now();
      setLastSeen(now);
      localStorage.setItem("lastSeenNotif", now);
    }
  }

  // helper: calculate relative time
  function getRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const seconds = (new Date(date) - new Date()) / 1000;

    const intervals = [
      { unit: "year", value: 31536000 },
      { unit: "month", value: 2592000 },
      { unit: "week", value: 604800 },
      { unit: "day", value: 86400 },
      { unit: "hour", value: 3600 },
      { unit: "minute", value: 60 },
      { unit: "second", value: 1 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const diff = seconds / intervals[i].value;
      if (Math.abs(diff) >= 1) {
        return rtf.format(Math.round(diff), intervals[i].unit);
      }
    }

    return "just now";
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleClick}
        className="relative p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-700" strokeWidth={1.5} />
        {newUsers.length > 0 && (
          <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {newUsers.length > 99 ? "99+" : newUsers.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentDropdown.length} new {currentDropdown.length === 1 ? "request" : "requests"}
            </p>
          </div>

          {/* Empty State */}
          {currentDropdown.length === 0 && (
            <div className="p-12 text-center">
              <Bell size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No new notifications</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {currentDropdown.map((req, i) => (
              <div
                key={i}
                className="p-5 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {req.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 break-words">
                      {req.transaction}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap ml-2 font-medium">
                    {getRelativeTime(req.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}