import { useContext, useState } from "react";
import { RequestContext } from "../requestList";
import "./adhome.css";

function Requestees() {
  const { users, setUsers, listingError, setListingError } = useContext(RequestContext);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("");
  const [update, setUpdate] = useState({ pay: "", pickup: "" });

  const [actionError, setActionError] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");

  const handleClick = async (id, transaction, status) => {
    setActionError("");
    setActionFeedback("");
    try {
      const res = await fetch("http://localhost/digibaranggay/handlestatus.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, transaction, status, pickup: update.pickup, pay: update.pay }),
      });
      const data = await res.json();
      if (data.Success === true) {
        setActionFeedback(data.message);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === id && u.transaction === transaction ? { ...u, status } : u
          )
        );
      } else {
        setActionError(data.message);
      }
    } catch (error) {
      setActionError("Failed to fetch");
    }
  };

  const toggleActive = (id, transaction) => {
    setActionError("");
    setActionFeedback("");
    if (active?.id === id && active?.transaction === transaction) {
      setActive(null);
    } else {
      setActive({ id, transaction });
    }
  };

  const filteredPending = users.filter(
    (user) => (!filter || user.transaction === filter) && user.status === "Pending"
  );
  const selectedUser = users.find((u) => u.id === active?.id && u.transaction === active?.transaction);

  return (
    <>
    
      {/* Filters */}
      <div className="filters">
        {[
          "KKID Card",
          "Barangay ID",
          "Brgy. clearance",
          "Certificate of indigency",
          "OSCA",
          "First job seeker",
          "Working clearance",
          "Barangay inhabitants",
        ].map((item) => (
          <button
            key={item}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all duration-200 ${
              filter === item
                ? "bg-teal-600 text-white shadow-md"
                : "bg-teal-100 text-teal-800 hover:bg-teal-200"
            }`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
        {filter && (
          <button
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 text-[12px] font-medium transition"
            onClick={() => setFilter("")}
          >
            Show All
          </button>
        )}
      </div>

      {/* Container */}
      <div className="requestees-container gap-4">
        {/* Left: Requests List */}
        <div className="requestees no-scrollbar">
          {listingError && <p className="text-rose-600">{listingError}</p>}
          {filteredPending.length === 0 ? (
            <p className="flex mx-auto my-auto text-gray-500 text-center">
              {filter
                ? `There are no pending ${filter} requests`
                : "There are no pending requests"}
            </p>
          ) : (
            filteredPending.map((user) => {
              const isActive = active?.id === user.id && active?.transaction === user.transaction;
              return (
                <div
                  key={user.id + user.transaction}
                  className={`users flex justify-between items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive ? "bg-green-50 shadow-md translate-x-2" : "bg-white hover:bg-green-50"
                  }`}
                  onClick={() => toggleActive(user.id, user.transaction)}
                >
                  <div>
                    {/* Transaction text always black */}
                    <div className="font-semibold text-black">{user.transaction}</div>
                    <div className="text-gray-600">{user.name}</div>
                  </div>
                  <div className="text-gray-500">{user.date}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Approve/Reject */}
        <div className="approvereject p-6 rounded-xl bg-white shadow-md w-full max-w-lg">
          {selectedUser ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold border-b pb-2">{selectedUser.transaction}</h2>

              <div className="inline-block px-4 py-1 rounded-full text-sm font-medium border-2 border-orange-400 bg-orange-100 text-orange-700 w-fit">
                {selectedUser.status}
              </div>

              <div className="flex flex-col text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Birthdate:</span>
                  <span>{selectedUser.birthdate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date Requested:</span>
                  <span>{selectedUser.date}</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Purpose of Request</label>
                <p className="bg-teal-50 p-3 rounded-md border text-teal-800">{selectedUser.purpose}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Payment Amount</label>
                  <input
                    type="number"
                    placeholder="₱0.00"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setUpdate((u) => ({ ...u, pay: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Pick-up Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setUpdate((u) => ({ ...u, pickup: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 bg-teal-700 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition active:scale-95"
                  onClick={() =>
                    handleClick(selectedUser.id, selectedUser.transaction, "Approved")
                  }
                >
                  Approve
                </button>

                <button
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 rounded-lg transition active:scale-95"
                  onClick={() =>
                    handleClick(selectedUser.id, selectedUser.transaction, "Rejected")
                  }
                >
                  Reject
                </button>
              </div>

              {actionError && <p className="text-rose-600 text-sm font-medium">{actionError}</p>}
              {actionFeedback && <p className="text-teal-700 text-sm font-medium">{actionFeedback}</p>}
            </div>
          ) : (
            <div className="text-gray-400 text-xl md:text-2xl text-center">Select a user</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Requestees;
