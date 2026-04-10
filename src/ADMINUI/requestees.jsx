import { useContext, useState } from "react";
import { RequestContext } from "../requestList";
import "./adhome.css";

function Requestees() {
  const { users, setUsers, listingError } = useContext(RequestContext);

  /* ───────── STATES ───────── */
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("");
  const [statusView, setStatusView] = useState("Pending");
  const [update, setUpdate] = useState({ pay: "", pickup: "", response: "" });

  const [actionError, setActionError] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");

  /* ───────── CONFIG ───────── */
  const statusColors = {
    Pending: "bg-yellow-100 border-yellow-400 text-yellow-700",
    Approved: "bg-green-100 border-green-400 text-green-700",
    Rejected: "bg-rose-100 border-rose-400 text-rose-700",
    Successful: "bg-blue-100 border-blue-400 text-blue-700",
    AllowAgain: "bg-purple-100 border-purple-400 text-purple-700",
  };

  const transactionTypes = [
    "KKID Card",
    "Barangay ID",
    "Brgy. clearance",
    "Certificate of indigency",
    "OSCA",
    "First job seeker",
    "Working clearance",
    "Barangay inhabitants",
  ];

  /* ───────── HELPERS ───────── */
  const toggleActive = (id, transaction) => {
    setActionError("");
    setActionFeedback("");

    if (active?.id === id && active?.transaction === transaction) {
      setActive(null);
    } else {
      setActive({ id, transaction });
    }
  };

  const selectedUser = users.find(
    (u) => u.id === active?.id && u.transaction === active?.transaction
  );

  /* ───────── API ───────── */
  const pushUserNotification = async (userId, transaction, status) => {
    if (status !== "Approved" && status !== "Rejected") return;

    const message =
      status === "Approved"
        ? `Your request for ${transaction} has been Approved.`
        : `Your request for ${transaction} has been Rejected. Please contact the barangay for more details.`;

    await fetch(`${import.meta.env.VITE_API_URL}/api/push_user_notification.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        transaction,
        message,
        type: "user",
      }),
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
      action: status === "AllowAgain" ? "allow_again" : "update_status",
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/handlestatus.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.Success) {
        setActionFeedback(data.message);
        setActive(null);

        await pushUserNotification(selectedUser.id, transaction, status);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === id && u.transaction === transaction
              ? status === "AllowAgain"
                ? { ...u, allow_request: 1 }
                : { ...u, status }
              : u
          )
        );
      } else {
        setActionError(data.message);
      }
    } catch (err) {
      setActionError("Failed: " + err.message);
    }
  };

  /* ───────── FILTER LOGIC (UNCHANGED) ───────── */
  const filteredUsers = users.filter((user) => {
    const transactionMatch = !filter || user.transaction === filter;

    if (statusView === "Pending") {
      return transactionMatch && user.status === "Pending";
    }

    if (statusView === "Successful") {
      return (
        transactionMatch &&
        (user.status === "Successful" || user.status === "Rejected") &&
        user.request_again === "0"
      );
    }

    return false;
  });

  /* ───────── UI SECTIONS ───────── */
  const StatusViewButtons = () => (
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
  );

  const TransactionFilters = () => (
    <div className="filters">
      {transactionTypes.map((item) => (
        <button
          key={item}
          className={`px-4 py-2 rounded-full text-[12px] font-medium transition ${
            filter === item
              ? "bg-teal-600 text-white"
              : "bg-teal-100 text-teal-800"
          }`}
          onClick={() => setFilter(item)}
        >
          {item}
        </button>
      ))}

      {filter && (
        <button
          onClick={() => setFilter("")}
          className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-[12px]"
        >
          Show All
        </button>
      )}
    </div>
  );

  const RequestList = () => (
    <div className="requestees no-scrollbar">
      {listingError && <p className="text-rose-600">{listingError}</p>}

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center">No requests found</p>
      ) : (
        filteredUsers.map((user) => {
          const isActive =
            active?.id === user.id &&
            active?.transaction === user.transaction;

          return (
            <div
              key={user.id + user.transaction}
              onClick={() => toggleActive(user.id, user.transaction)}
              className={`users flex justify-between p-4 rounded-xl border cursor-pointer ${
                isActive
                  ? "bg-green-50 shadow-md"
                  : "bg-white hover:bg-green-50"
              }`}
            >
              <div>
                <div className="font-semibold">{user.transaction}</div>
                <div className="text-gray-600">{user.name}</div>
              </div>
              <div className="text-gray-500">{user.date}</div>
            </div>
          );
        })
      )}
    </div>
  );

  const RequestDetails = () => (
    <div className="approvereject p-6 rounded-xl bg-white shadow-md">
      {!selectedUser ? (
        <div className="text-gray-400 text-center">Select a user</div>
      ) : (
        <div className="flex flex-col gap-4">

          <h2 className="text-xl font-semibold border-b pb-2 flex justify-between">
            {selectedUser.transaction}

            <span
              className={`px-4 py-1 rounded-full text-sm border ${
                statusColors[selectedUser.status]
              }`}
            >
              {selectedUser.status}
            </span>
          </h2>

          {statusView === "Pending" && (
            <>
              <p className="bg-teal-50 p-3 rounded-md">
                {selectedUser.purpose}
              </p>

              <textarea
                value={update.response}
                onChange={(e) =>
                  setUpdate((u) => ({ ...u, response: e.target.value }))
                }
                className="border p-2 rounded-lg"
                placeholder="Response..."
              />

              <button
                onClick={() =>
                  handleClick(selectedUser.id, selectedUser.transaction, "Approved")
                }
                className="bg-teal-700 text-white py-2 rounded-lg"
              >
                Approve
              </button>
            </>
          )}

          {statusView === "Successful" && (
            <button
              onClick={() =>
                handleClick(selectedUser.id, selectedUser.transaction, "AllowAgain")
              }
              className="bg-amber-500 text-white py-2 rounded-lg"
            >
              Allow Again
            </button>
          )}

          {actionError && <p className="text-rose-600">{actionError}</p>}
          {actionFeedback && <p className="text-teal-700">{actionFeedback}</p>}
        </div>
      )}
    </div>
  );

  /* ───────── MAIN UI ───────── */
  return (
    <>
      <StatusViewButtons />
      <TransactionFilters />

      <div className="requestees-container gap-4">
        <RequestList />
        <RequestDetails />
      </div>
    </>
  );
}

export default Requestees;