import { MessageSquare, ChevronDown, Search, X } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { RequestContext } from "../requestList";

function HeaderRequests({ filterUserId }) {
  const { users, listingError } = useContext(RequestContext);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const dropdownRef = useRef(null);

  const filters = ["All", "Pending", "Rejected", "Approved", "Expired", 'Successful'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers =
    users
      ?.filter(u => !filterUserId || String(u.id) === String(filterUserId)) // ✅ filter current user if provided
      .filter(u =>
        (activeFilter === "All" || u.status === activeFilter) &&
        (
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.transaction.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-100 text-emerald-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 hover:text-emerald-600 transition font-medium
          ${isOpen ? "text-emerald-600 font-semibold" : " text-gray-700"}`}
      >
        <MessageSquare className="w-5 h-5" />
        Requests
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-2 rounded-full font-medium text-xs transition ${
                  activeFilter === filter
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Requests List */}
          {listingError ? (
            <div className="p-6 text-red-600 text-sm text-center">{listingError}</div>
          ) : filteredUsers.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto">
              {filteredUsers.map((u, index) => (
                <div
                  key={index}
                  className="border-b last:border-b-0 p-5 hover:bg-gray-50 transition cursor-pointer flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 text-lg">{u.name}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(u.status)}`}>
                      {u.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <p>{u.transaction}</p>
                    <p>{u.dateupdated}</p>
                  </div>
                  {u.pay && <p className="text-gray-800 font-medium">₱ {u.pay}</p>}
                  {/* ✅ ADMIN RESPONSE */}
{u.response && (
  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
    <p className="font-medium mb-1">Admin Response:</p>
    <p className="leading-relaxed">{u.response}</p>
  </div>
)}
                  <p className="text-gray-500 text-xs">{u.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-gray-500 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No requests found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderRequests;