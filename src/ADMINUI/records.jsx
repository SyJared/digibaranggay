import { useContext, useState } from "react";
import { RequestContext } from "../requestList";

function Records() {
  const { users, listingMessage, setListingMessage } = useContext(RequestContext);
  const [active, setActive] = useState({ id: null, transaction: null });
  const [filterStatus, setFilterStatus] = useState("Approved");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["Approved", "Pending", "Rejected", "Expired"];

  const statusBorder = {
    Approved: "border-emerald-600",
    Pending: "border-orange-400",
    Rejected: "border-rose-600",
    Expired: "border-gray-500",
  };
  const statusText = {
    Approved: "text-emerald-700 bg-emerald-100",
    Pending: "text-orange-700 bg-orange-100",
    Rejected: "text-rose-700 bg-rose-100",
    Expired: "text-gray-700 bg-gray-200",
  };

  const toggleActive = (id, transaction) => {
    if (active?.id === id && active?.transaction === transaction) {
      setActive(null);
    } else {
      setActive({ id, transaction });
    }
  };

  const formatDate = (time) => {
    const date = new Date(time);
    return date.toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Filter + search
  const filteredUsers = users
    .filter((u) => u.status === filterStatus)
    .filter((u) => {
      const name = u.name.toLowerCase();
      const email = u.email?.toLowerCase() || "";
      return (
        name.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="records-div flex flex-col gap-3">

      {/* Listing Message */}
      {listingMessage && <p>{listingMessage}</p>}

      {/* Sticky Filters + Search */}
      <div className="sticky top-0 z-20 bg-slate-50 p-4 flex flex-col md:flex-row gap-4 border-b border-slate-200">
        <div className="flex gap-3 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition
                ${filterStatus === status
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* User Records */}
      {filteredUsers.map((u) => {
        const isActive = active?.id === u.id && active?.transaction === u.transaction;
        return (
          <div
            key={u.id}
            className={`record-info ${statusBorder[u.status]} overflow-hidden transition-all duration-300 cursor-pointer`}
            onClick={() => toggleActive(u.id, u.transaction)}
          >
            <div className="grid grid-cols-2 w-full p-3">
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">{u.transaction}</h2>
                <span className="text-slate-500 text-sm">{u.name}</span>
              </div>

              <div className="justify-self-end content-center">
                <span className={`px-3 py-1 rounded-2xl text-sm font-semibold ${statusText[u.status]}`}>
                  {u.status}
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isActive ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 p-3">
                <div>
                  <span className="font-semibold text-slate-700">Date Requested</span>
                  <p>{formatDate(u.date)}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Date Updated</span>
                  <p>{formatDate(u.dateupdated)}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Payment</span>
                  <p>₱{u.pay}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Pickup</span>
                  <p>{u.pickup}</p>
                </div>

                <div className="col-span-2">
                  <span className="font-semibold text-slate-700">Purpose</span>
                  <p className="text-slate-600">{u.purpose}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No records found.</p>
      )}
    </div>
  );
}

export default Records;
