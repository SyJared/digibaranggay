import React, { useContext, useState } from "react";
import { RegisteredContext } from "../registeredContext";

function ManageUsers() {
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const { registered, error } = useContext(RegisteredContext);

  const [userStatuses, setUserStatuses] = useState(
    registered.reduce((acc, u) => {
      acc[u.id] = u.status;
      return acc;
    }, {})
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalAction, setModalAction] = useState("");

  const toggleExpand = (id) => setExpandedUserId(expandedUserId === id ? null : id);

  const statuses = ["Pending", "Rejected", "Accepted"];

  const filteredUsers = registered.filter((r) => userStatuses[r.id] === filterStatus);

  const openModal = (user, action) => {
    setModalUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUserStatuses((prev) => ({ ...prev, [id]: newStatus }));
      setShowModal(false);

      const res = await fetch("http://localhost/digibaranggay/updateStatus.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Failed to update status: " + data.message);
        setUserStatuses((prev) => ({ ...prev, [id]: registered.find(u => u.id === id).status }));
      }
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 md:p-9 bg-gradient-to-br from-slate-50 to-slate-100 max-h-max">
      
      {error && (
        <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          {error}
        </p>
      )}

      {/* Status Filter */}
      <div className="flex gap-3 mb-4">
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

      {/* User List */}
      {filteredUsers.map((r) => {
        const isExpanded = expandedUserId === r.id;
        const status = userStatuses[r.id];

        return (
          <div
            key={r.id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-emerald-600 ${
              isExpanded ? "shadow-md border-emerald-600" : ""
            }`}
            onClick={() => toggleExpand(r.id)}
          >
            <div className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-semibold text-lg text-slate-900">
                  {r.firstname} {r.middlename} {r.lastname}
                </div>
                <div className="text-sm text-slate-500 mt-1">{r.address}</div>
              </div>
              <div className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? "text-emerald-600 rotate-180" : ""}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 10 13 14 9"></polyline>
                </svg>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-t border-emerald-200 p-5 space-y-3">

                <InfoRow label="Name" value={`${r.firstname} ${r.middlename} ${r.lastname}`} />
                <InfoRow label="Address" value={r.address} />
                <InfoRow label="Email" value={r.email} />
                <InfoRow label="Contact Number" value={r.contactnumber} />
                <InfoRow label="Civil Status" value={r.civilstatus} />
                <InfoRow label="Role" value={r.role} />
                <InfoRow label="Date Registered" value={r.dateregistered} />
                <InfoRow label="Status" value={status} />

                {status === "Pending" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal(r, "Accepted"); }}
                      className="flex-1 font-medium text-white py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal(r, "Rejected"); }}
                      className="flex-1 font-medium text-white py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })}

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No users in this category.</p>
      )}

      {/* Confirmation Modal */}
      {showModal && modalUser && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to accept this account?
            </h2>
            <p className="text-gray-700 mb-6">
              {modalUser.firstname} {modalUser.middlename} {modalUser.lastname}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleStatusChange(modalUser.id, modalAction)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Component to display a label and value
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
    <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">{label} :</span>
    <span className="text-slate-900 text-right flex-1">{value}</span>
  </div>
);

export default ManageUsers;
