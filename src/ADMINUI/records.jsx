import { useContext, useState } from "react";
import { RequestContext } from "../requestList";

function Records() {
  const { users, listingMessage, setListingMessage } = useContext(RequestContext);
  const [active, setActive] = useState({ id: null, transaction: null });
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["All", "Approved", "Pending", "Rejected", "Expired", "Successful"];

  const statusBorder = {
    Approved: "border-emerald-600",
    Pending: "border-orange-400",
    Rejected: "border-rose-600",
    Expired: "border-gray-500",
    Successful: "border-emerald-600",
  };

  const statusText = {
    Approved: "text-emerald-700 bg-emerald-100",
    Pending: "text-orange-700 bg-orange-100",
    Rejected: "text-rose-700 bg-rose-100",
    Expired: "text-gray-700 bg-gray-200",
    Successful: "text-emerald-700 bg-emerald-100",
  };

  const toggleActive = (id, transaction) => {
    if (active?.id === id && active?.transaction === transaction) {
      setActive({ id: null, transaction: null });
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

  // ✅ Handler placeholder (connect this to backend later)
  const handleMarkSuccessful = async (id, transaction) => {
  if (!window.confirm("Mark this request as successful?")) return;

  try {
    const res = await fetch(
      "http://localhost/digibaranggay/mark_successful.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          transaction
        })
      }
    );

    const data = await res.json();

    if (data.success) {
      alert(data.message);

      // Update UI context state instead of reload (better practice)
      window.location.reload(); // temporary but acceptable
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

const handleDownload = async (userId, transaction, purpose) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("transaction", transaction);
    formData.append("purpose", purpose);

    const res = await fetch("http://localhost/digibaranggay/generate_doc.php", {
      method: "POST",
      body: formData, // send as form-data
      credentials: "include", // if you need cookies/session
    });

    if (!res.ok) throw new Error("Server error");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transaction}.docx`; // optional: dynamic file name
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  const normalizedUsers = users.map((u) => ({
    ...u,
    status: (u.status || "").trim(),
    name: (u.name || "").trim(),
    email: (u.email || "").trim(),
  }));

  const filteredUsers = normalizedUsers.filter((u) => {
    const statusMatch =
      filterStatus === "All" || u.status.toLowerCase() === filterStatus.toLowerCase();

    const searchMatch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="records-div flex flex-col gap-3">
      {listingMessage && <p className="text-center text-red-600">{listingMessage}</p>}

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

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((u) => {
          const isActive = active?.id === u.id && active?.transaction === u.transaction;

          return (
            <div
              key={`${u.id}-${u.transaction}`}
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
                  isActive ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
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

                  {/* ✅ Mark Successful + Download Buttons */}
                  {u.status === "Approved" && (
                    <div className="col-span-2 flex justify-end gap-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkSuccessful(u.id, u.transaction);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Mark as Successful
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(u.id, u.transaction, u.purpose);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 mt-6">No records found.</p>
      )}
    </div>
  );
}

export default Records;