import React, { useContext, useState } from "react";
import { RegisteredContext } from "../registeredContext";
import Spinner from "../spinner";

function ManageUsers() {
  const [selectedUserId, setSelectedUserId] = useState(null);
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

  const [messageModal, setMessageModal] = useState({ show: false, message: "", success: null });
  const [infoModal, setInfoModal] = useState({ show: false, data: null, name: "" });
  const [emergencyModal, setEmergencyModal] = useState({ show: false, data: null, name: "" });

  const statuses = ["Pending", "Accepted", "Rejected"];

  const openModal = (user, action) => {
    setModalUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUserStatuses((prev) => ({ ...prev, [id]: newStatus }));
      setShowModal(false);
      setSelectedUserId(null); // Deselect user after action
      setMessageModal({ show: true, message: "Updating status...", success: null });

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/updateStatus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!data.success) {
        // Revert status if update fails
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

  const selectedUser = registered.find((r) => r.id === selectedUserId) || null;
  const selectedStatus = selectedUser ? userStatuses[selectedUser.id] : null;
  const selectedUserInfo = selectedUser ? additionalInfo[Number(selectedUser.id)] : null;
  const selectedHasInfo = selectedUserInfo && (
    selectedUserInfo.height || selectedUserInfo.weight ||
    selectedUserInfo.tin || selectedUserInfo.position || selectedUserInfo.employer
  );
  const selectedEmergencyData = selectedUser ? emergencyInfo[Number(selectedUser.id)] : null;
  const selectedHasEmergency = selectedEmergencyData && (
    selectedEmergencyData.emergency_name || selectedEmergencyData.emergency_contact
  );

  const statusColors = {
    Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
    Accepted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
    Rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", dot: "bg-red-400", badge: "bg-red-100 text-red-700" },
  };

  const getInitials = (r) =>
    `${r.firstname?.[0] ?? ""}${r.lastname?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex h-full overflow-hidden"> {/* Parent container still prevents overall scrolling */}

      {/* ── All Modals (kept as is) ── */}
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

      {/* Emergency Modal */}
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

      {/* Message / Loading Modal */}
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

      {/* ══════════════════════════════════════════
          LEFT PANEL — list
      ══════════════════════════════════════════ */}
      <div className="w-72 min-w-[17rem] flex flex-col border-r border-slate-200 bg-white"> {/* Removed overflow-hidden from this div */}
        {/* Search */}
        <div className="p-3 border-b border-slate-200">
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status tabs with counts */}
        <div className="flex border-b border-slate-200">
          {statuses.map((s) => {
            const count = registered.filter((r) => userStatuses[r.id] === s).length;
            const colors = statusColors[s];
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setSelectedUserId(null); }}
                className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium border-b-2 transition
                  ${isActive
                    ? `${colors.text} border-current ${colors.bg}`
                    : "text-slate-500 border-transparent hover:bg-slate-50"
                  }`}
              >
                <span className={`text-base font-semibold ${isActive ? colors.text : "text-slate-700"}`}>
                  {count}
                </span>
                {s}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="mx-3 mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            {error}
          </p>
        )}

        {/* User list - THIS IS THE SCROLLABLE PART */}
        <div className="flex-1 overflow-y-auto"> {/* Keep this overflow-y-auto */}
          {filteredUsers.length === 0 ? (
            <p className="text-center text-slate-400 text-sm mt-10">No users found.</p>
          ) : (
            filteredUsers.map((r) => {
              const st = userStatuses[r.id];
              const colors = statusColors[st];
              const isSelected = selectedUserId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedUserId(r.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-slate-100 transition
                    ${isSelected
                      ? "bg-emerald-50 border-l-2 border-l-emerald-600"
                      : "hover:bg-slate-50 border-l-2 border-l-transparent"
                    }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${colors.bg} ${colors.text}`}>
                    {getInitials(r)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {r.firstname} {r.lastname}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{r.email}</div>
                  </div>
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — detail
      ══════════════════════════════════════════ */}
      {/* The main container for the right panel should NOT scroll.
          Its content area (specifically the `detail body`) should scroll instead if necessary. */}
      <div className="flex-1 flex flex-col bg-slate-50"> {/* Removed overflow-hidden from here */}
        {!selectedUser ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className="text-sm">Select a user to view details</span>
          </div>
        ) : (
          <>
            {/* Detail header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0 ${statusColors[selectedStatus].bg} ${statusColors[selectedStatus].text}`}>
                {getInitials(selectedUser)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-base">
                  {selectedUser.firstname} {selectedUser.middlename} {selectedUser.lastname}
                </div>
                <div className="text-sm text-slate-500">{selectedUser.email}</div>
                <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[selectedStatus].badge}`}>
                  {selectedStatus}
                </span>
              </div>
              {/* Additional info & Emergency badges */}
              <div className="flex gap-2 flex-shrink-0">
                {selectedHasInfo && (
                  <button
                    onClick={() => setInfoModal({
                      show: true,
                      data: selectedUserInfo,
                      name: `${selectedUser.firstname} ${selectedUser.middlename} ${selectedUser.lastname}`
                    })}
                    className="text-xs px-3 py-1.5 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition font-medium"
                  >
                    Additional info
                  </button>
                )}
                {selectedHasEmergency && (
                  <button
                    onClick={() => setEmergencyModal({
                      show: true,
                      data: selectedEmergencyData,
                      name: `${selectedUser.firstname} ${selectedUser.middlename} ${selectedUser.lastname}`
                    })}
                    className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium"
                  >
                    Emergency
                  </button>
                )}
              </div>
            </div>

            {/* Detail body - THIS IS THE SCROLLABLE PART ON THE RIGHT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5"> {/* Added overflow-y-auto here */}
              <Section title="Personal information">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Civil status" value={selectedUser.civilstatus} />
                  <InfoCard label="Role" value={selectedUser.role} />
                  <InfoCard label="Contact number" value={selectedUser.contactnumber} />
                  <InfoCard label="Household number" value={selectedUser.housenumber} />
                </div>
              </Section>

              <Section title="Address">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Sitio" value={selectedUser.sitio} />
                  <InfoCard label="Street" value={selectedUser.street} />
                </div>
                <p className="text-xs text-slate-400 mt-1">Brgy. Binan Pagsanajan, Laguna</p>
              </Section>

              <Section title="Registration">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Date registered" value={selectedUser.dateregistered} />
                  <InfoCard label="Status" value={selectedStatus} />
                </div>
              </Section>
            </div>

            {/* Action footer — only for Pending */}
            {selectedStatus === "Pending" && (
              <div className="bg-white border-t border-slate-200 px-6 py-4 flex gap-3 flex-shrink-0">
                <button
                  onClick={() => openModal(selectedUser, "Accepted")}
                  className="flex-1 font-medium text-white py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => openModal(selectedUser, "Rejected")}
                  className="flex-1 font-medium text-white py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Small helpers ── */

const Section = ({ title, children }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
    {children}
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 pb-3 border-b border-emerald-200">
    <span className="font-medium text-emerald-600 text-sm whitespace-nowrap">{label} :</span>
    <span className="text-slate-900 text-right flex-1">{value}</span>
  </div>
);

export default ManageUsers;
