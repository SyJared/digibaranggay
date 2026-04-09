import React, { useContext, useState } from "react";
import { RegisteredContext } from "../registeredContext";
import Spinner from "../spinner";

function ManageUsers() {
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const { registered = [], error, additionalInfo = {}, emergencyInfo = {} } = useContext(RegisteredContext);

  const [userStatuses, setUserStatuses] = useState(
    registered.reduce((acc, u) => {
      acc[u.id] = u.status;
      return acc;
    }, {})
  );

  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalAction, setModalAction] = useState("");

  // loading modal
const [messageModal, setMessageModal] = useState({ show: false, message: "", success: null });

  // Info modal state
  const [infoModal, setInfoModal] = useState({ show: false, data: null, name: "" });

  const [emergencyModal, setEmergencyModal] = useState({ show: false, data: null, name: "" });
  

  const toggleExpand = (id) => setExpandedUserId(expandedUserId === id ? null : id);

  const statuses = ["Pending", "Rejected", "Accepted"];

  const openModal = (user, action) => {
    setModalUser(user);
    setModalAction(action);
    setShowModal(true);
  };
  

  const handleStatusChange = async (id, newStatus) => {
  try {
    setUserStatuses((prev) => ({ ...prev, [id]: newStatus }));
    setShowModal(false);
    setMessageModal({ show: true, message: "Updating status...", success: null });

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/updateStatus.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    const data = await res.json();

    if (!data.success) {
      setUserStatuses((prev) => ({ ...prev, [id]: registered.find(u => u.id === id).status }));
      setMessageModal({ show: true, message: "Failed: " + data.message, success: false });
    } else {
      setMessageModal({ show: true, message: data.message, success: true });
    }
  } catch (err) {
    console.error(err);
    setMessageModal({ show: true, message: "Error updating status. Please try again.", success: false });
  }
};

  const filteredUsers = registered
    .filter((r) => userStatuses[r.id] === filterStatus)
    .filter((r) => {
      const fullName = `${r.firstname} ${r.middlename} ${r.lastname}`.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="flex flex-col gap-4 p-6 md:p-9 bg-gradient-to-br from-slate-50 to-slate-100 max-h-max">

      {/* Additional Info Modal */}
      {infoModal.show && infoModal.data && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-80 overflow-hidden">
            <div className="bg-teal-700 p-4">
              <h2 className="text-white font-semibold text-lg">{infoModal.name}</h2>
              <p className="text-emerald-100 text-sm">Additional Information</p>
            </div>
            <div className="p-5 space-y-3">
              <InfoRow label="Height" value={infoModal.data.height ? `${infoModal.data.height} cm` : "N/A"} />
              <InfoRow label="Weight" value={infoModal.data.weight ? `${infoModal.data.weight} kg` : "N/A"} />
              <InfoRow label="TIN" value={infoModal.data.tin || "N/A"} />
              <InfoRow label="Position" value={infoModal.data.position || "N/A"} />
              <InfoRow label="Employer" value={infoModal.data.employer || "N/A"} />
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => setInfoModal({ show: false, data: null, name: "" })}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {emergencyModal.show && emergencyModal.data && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-80 overflow-hidden">
          <div className="bg-red-600 p-4">
            <h2 className="text-white font-semibold text-lg">{emergencyModal.name}</h2>
            <p className="text-red-100 text-sm">Emergency Contact</p>
          </div>
          <div className="p-5 space-y-3">
            <InfoRow label="Name" value={emergencyModal.data.emergency_name || "N/A"} />
            <InfoRow label="Address" value={emergencyModal.data.emergency_address || "N/A"} />
            <InfoRow label="Relation" value={emergencyModal.data.emergency_relation || "N/A"} />
            <InfoRow label="Contact" value={emergencyModal.data.emergency_contact || "N/A"} />
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={() => setEmergencyModal({ show: false, data: null, name: "" })}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    {messageModal.show && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-80 overflow-hidden">
      <div className={`p-4 ${messageModal.success === null ? "bg-emerald-600" : messageModal.success ? "bg-emerald-600" : "bg-red-600"}`}>
        <h2 className="text-white font-semibold text-lg">
          {messageModal.success === null ? "Please wait..." : messageModal.success ? "Success" : "Failed"}
        </h2>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        {messageModal.success === null ? (
          <Spinner />
        ) : messageModal.success ? (
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <p className="text-slate-700 text-center">{messageModal.message}</p>
        {messageModal.success !== null && (
          <button
            onClick={() => setMessageModal({ show: false, message: "", success: null })}
            className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  </div>
)}

      {error && (
        <p className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          {error}
        </p>
      )}

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
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* User List */}
      {filteredUsers.map((r) => {
        const isExpanded = expandedUserId === r.id;
        const status = userStatuses[r.id];
        const userInfo = additionalInfo[Number(r.id)];
        const hasInfo = userInfo && (userInfo.height || userInfo.weight || userInfo.tin || userInfo.position || userInfo.employer);
        const emergencyData = emergencyInfo[Number(r.id)];
        const hasEmergency = emergencyData && (emergencyData.emergency_name || emergencyData.emergency_contact);
        return (
          <div
            key={r.id}
            className={`bg-white mx-5 rounded-lg overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-emerald-600 ${
              isExpanded ? "shadow-md border-emerald-600" : ""
            }`}
            onClick={() => toggleExpand(r.id)}
          >
            <div className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg text-slate-900">
                    {r.firstname} {r.middlename} {r.lastname}
                  </span>

                  {/* Info Button — only shows if user has additional info */}
                  {hasInfo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoModal({
                          show: true,
                          data: userInfo,
                          name: `${r.firstname} ${r.middlename} ${r.lastname}`
                        });
                      }}
                      className="text-xs px-2.5 py-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition font-medium"
                    >
                      Additional info
                    </button>
                  )}
                  {hasEmergency && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmergencyModal({
                        show: true,
                        data: emergencyData,
                        name: `${r.firstname} ${r.middlename} ${r.lastname}`
                      });
                    }}
                    className="text-xs px-2.5 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium"
                  >
                    Emergency
                  </button>
                )}
                </div>
                <div className="text-sm text-slate-500 mt-1">Brgy. Binan Pagsanajan, Laguna</div>
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
                <InfoRow label="Sitio" value={r.sitio} />
                <InfoRow label="Street" value={r.street} />
                <InfoRow label="Email" value={r.email} />
                <InfoRow label="Contact Number" value={r.contactnumber} />
                <InfoRow label="Civil Status" value={r.civilstatus} />
                <InfoRow label="Role" value={r.role} />
                <InfoRow label="Household Number" value={r.housenumber} />
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
              Are you sure you want to {modalAction.toLowerCase()} this account?
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

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
    <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">{label} :</span>
    <span className="text-slate-900 text-right flex-1">{value}</span>
  </div>
);

export default ManageUsers;