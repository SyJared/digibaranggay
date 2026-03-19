import { useContext, useEffect, useState } from "react";
import { RequestContext } from "../requestList";
import "./adhome.css";

function Requestees() {
  const { users, setUsers, listingError } = useContext(RequestContext);

  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("");
  const [statusView, setStatusView] = useState("Pending"); // ✅ NEW
  const [update, setUpdate] = useState({ pay: "", pickup: "", response: ""});

  const [actionError, setActionError] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");

  /* ================= PUSH USER NOTIFICATION ================= */

  const pushUserNotification = async (userId, transaction, status) => {
    if (status !== "Approved" && status !== "Rejected") return;

    const message =
      status === "Approved"
        ? `Your request for ${transaction} has been Approved.`
        : `Your request for ${transaction} has been Rejected. Please contact the barangay for more details.`;

    await fetch("http://localhost/digibaranggay/push_user_notification.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        transaction,
        message,
        type: "user"
      })
    });
  };

  const handleClick = async (id, transaction, status) => {
    setActionError("");
    setActionFeedback("");

    const payload = {
      id,
      transaction,
      status,
      pickup: update.pickup,
      pay: update.pay,
      response: update.response,
      action: status === "AllowAgain" ? "allow_again" : "update_status", // ✅ NEW
    };

    try {
      const res = await fetch(
        "http://localhost/digibaranggay/handlestatus.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Server error: " + res.status);
        return;
      }

      const data = await res.json();

      if (data.Success) {
        setActionFeedback(data.message);
        setActive(null);
        await pushUserNotification(selectedUser.id, transaction, status);

        // Update UI instantly
        if (status === "AllowAgain") {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === id && u.transaction === transaction
                ? { ...u, allow_request: 1 }
                : u
            )
          );
        } else {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === id && u.transaction === transaction
                ? { ...u, status }
                : u
            )
          );
        }
      } else {
        setActionError(data.message);
      }
    } catch (error) {
      setActionError("Failed to fetch: " + error.message);
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

  const statusColors = {
  Pending: "bg-yellow-100 border-yellow-400 text-yellow-700",
  Approved: "bg-green-100 border-green-400 text-green-700",
  Rejected: "bg-rose-100 border-rose-400 text-rose-700",
  Successful: "bg-blue-100 border-blue-400 text-blue-700",
  AllowAgain: "bg-purple-100 border-purple-400 text-purple-700",
};

  // ✅ UPDATED FILTER LOGIC
  const filteredUsers = users.filter((user) => {
    const transactionMatch = !filter || user.transaction === filter;

    if (statusView === "Pending") {
      return transactionMatch && user.status === "Pending";
    }

    if (statusView === "Successful") {
      return (
        transactionMatch &&
        (user.status === "Successful" || user.status === "Rejected") &&
        user.request_again === '0'
      );
    }

    return false;
  });

  const selectedUser = users.find(
    (u) =>
      u.id === active?.id && u.transaction === active?.transaction
  );

  return (
    <>
      {/* ✅ STATUS VIEW FILTER */}
      <div className="flex mb-2 gap-2 justify-center">
        {["Pending", "Successful"].map((view) => (
          <button
            key={view}
            onClick={() => {
              setStatusView(view);
              setActive(null);
            }}
            className={`px-7 py-2 text-sm font-medium transition ${
              statusView === view
                ? "bg-teal-600 text-white shadow translate-y-3"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
          >
            {view === "Successful" ? "Processed" : view}
          </button>
        ))}
      </div>

      {/* Transaction Filters */}
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

      <div className="requestees-container gap-4">
        {/* LEFT SIDE */}
        <div className="requestees no-scrollbar">
          {listingError && (
            <p className="text-rose-600">{listingError}</p>
          )}

          {filteredUsers.length === 0 ? (
            <p className="flex mx-auto my-auto text-gray-500 text-center">
              No requests found
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isActive =
                active?.id === user.id &&
                active?.transaction === user.transaction;

              return (
                <div
                  key={user.id + user.transaction}
                  className={`users flex justify-between items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-green-50 shadow-md translate-x-2"
                      : "bg-white hover:bg-green-50"
                  }`}
                  onClick={() =>
                    toggleActive(user.id, user.transaction)
                  }
                >
                  <div>
                    <div className="font-semibold text-black">
                      {user.transaction}
                    </div>
                    <div className="text-gray-600">
                      {user.name}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {user.date}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="approvereject p-6 rounded-xl bg-white shadow-md w-full max-w-lg">
          {selectedUser ? (
            <div className="flex flex-col gap-4">

              <h2 className="text-xl md:text-xl font-semibold border-b pb-2 flex justify-between">
                {selectedUser.transaction}
                <div
                className={`inline-block px-4 py-1 rounded-full text-sm font-medium border w-fit ${
                  statusColors[selectedUser.status] || "bg-gray-100 border-gray-400 text-gray-700"
                }`}
              >
                {selectedUser.status}
              </div>
              </h2>

              {/* ================= PENDING VIEW ================= */}
              {statusView === "Pending" && (
                <>
                  {/* USER DETAILS */}
                  <div className="flex flex-col text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date Requested:</span>
                      <span>{selectedUser.date}</span>
                    </div>
                  </div>

                  {/* PURPOSE */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Purpose of Request
                    </label>
                    <p className="bg-teal-50 p-3 rounded-md border text-teal-800">
                      {selectedUser.purpose}
                    </p>
                  </div>

                  {/* RESPONSE */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Admin Response
                    </label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows="3"
                      placeholder="Write response to user..."
                      value={update.response}
                      onChange={(e) =>
                        setUpdate((u) => ({ ...u, response: e.target.value }))
                      }
                    />
                  </div>

                  {/* PAYMENT & PICKUP */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">
                        Payment Amount
                      </label>
                      <p className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
                        ₱{selectedUser.pay ?? 0}
                      </p>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-1">
                        Pick-up Date
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) =>
                          setUpdate((u) => ({ ...u, pickup: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* APPROVE / REJECT */}
                  <div className="flex gap-3 pt-2">
                    <button
                      className="flex-1 bg-teal-700 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition active:scale-95"
                      onClick={() =>
                        handleClick(
                          selectedUser.id,
                          selectedUser.transaction,
                          "Approved"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2 rounded-lg transition active:scale-95"
                      onClick={() =>
                        handleClick(
                          selectedUser.id,
                          selectedUser.transaction,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}

              {/* ================= PROCESSED VIEW ================= */}
              {statusView === "Successful" && (
                <>
                  <p>{selectedUser.name}</p>
                  <button
                    className="w-full mt-3 primary-color hover:bg-amber-500 text-white font-semibold py-2 rounded-lg transition active:scale-95"
                    onClick={() =>
                      handleClick(
                        selectedUser.id,
                        selectedUser.transaction,
                        "AllowAgain"
                      )
                    }
                  >
                    Allow User To Request Again
                  </button>
                </>
              )}

              {actionError && (
                <p className="text-rose-600 text-sm font-medium">
                  {actionError}
                </p>
              )}
              {actionFeedback && (
                <p className="text-teal-700 text-sm font-medium">
                  {actionFeedback}
                </p>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-xl md:text-2xl text-center">
              Select a user
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Requestees;