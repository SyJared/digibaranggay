import { useContext, useEffect, useState } from "react";
import { RequestContext } from "../requestList";
import { useMemo } from "react";


function Records() {
  const { users, setUsers, listingMessage } = useContext(RequestContext);
  const [downloading, setDownloading] = useState(false);
  const [selecteds, setSelecteds] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["All", "Approved", "Pending", "Rejected", "Expired", "Successful"];

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };
  
  useEffect(() => {
  setSelecteds(null);
}, [filterStatus, searchQuery]);

  const downloadableTransactions = [
  "Brgy. clearance",
  "Barangay ID",
  "First job seeker",
  "Working clearance"
];

  const statusColors = {
    Approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500" },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", dot: "bg-amber-400" },
    Rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", dot: "bg-red-400" },
    Expired: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-300", dot: "bg-slate-400" },
    Successful: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500" },
  };

  const formatDate = (time) =>
    new Date(time).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const normalized = useMemo(() => {
  return users.map((u) => ({
    ...u,
    id: String(u.id),
    status: (u.status || "").trim(),
    name: (u.name || "").trim(),
    email: (u.email || "").trim(),
    transaction: (u.transaction || "").trim(),
  }));
}, [users]);

  const filteredUsers = useMemo(() => {
  const q = searchQuery.toLowerCase().trim();

  return normalized.filter((u) => {
    const matchesStatus =
      filterStatus === "All" || u.status === filterStatus;

    const matchesSearch =
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.transaction || "").toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });
}, [normalized, filterStatus, searchQuery]);

  

  const selectedColor = selecteds ? statusColors[selecteds.status] : null;

  const handleMarkSuccessful = async (id, transaction) => {
  if (!window.confirm("Mark this request as successful?")) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/mark_successful.php`,
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
      showToast(data.message || "Marked as successful", "success");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id &&
u.transaction.trim().toLowerCase() === transaction.trim().toLowerCase()
            ? {
                ...u,
                status: "Successful"
              }
            : u
        )
      );
    } else {
      showToast(data.message || "Failed to update", "error");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

const handleDownload = async (userId, transaction, purpose) => {
  try {
    setDownloading(true);
    showToast("Generating document...", "success");

    const formData = new FormData();
    formData.append("id", userId);
    formData.append("transaction", transaction);
    formData.append("purpose", purpose);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate_doc.php`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) throw new Error("Server error");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${transaction}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    showToast("Download completed", "success");

  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  } finally {
    setDownloading(false);
  }
};

  return (
    <div className="flex h-full overflow-hidden">
      {toast.show && (
        <div className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white text-sm z-50
          ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}
        `}>
          {toast.message}
        </div>
      )}

      {/* ───────── LEFT PANEL ───────── */}
      <div className="w-72 min-w-[17rem] flex flex-col border-r border-slate-200 bg-white h-full">

        {/* Search */}
        <div className="p-3 border-b">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 border-slate-300"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-300">
          {statuses.map((s) => {
            const count = normalized.filter((u) =>
              s === "All" ? true : u.status === s
            ).length;

            const active = filterStatus === s;

            return (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setSelecteds(null); }}
                className={`flex-1 py-2 text-xs font-medium border-b-2 ${
                  active
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50"
                    : "border-transparent text-slate-500"
                }`}
              >
                <div className="text-sm font-bold">{count}</div>
                {s}
              </button>
            );
          })}
        </div>

        {/* List (ONLY SCROLLING AREA) */}
       <div className="flex-1 min-h-0 overflow-y-auto">
          {filteredUsers.map((u) => {
            const color = statusColors[u.status] || statusColors.Pending;
            const active =
            selecteds?.id === u.id &&
            selecteds?.transaction === u.transaction;

            return (
              <button
                key={`${u.id}-${u.transaction}`}
                onClick={() => setSelecteds(u)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-slate-300 ${
                  active ? "bg-emerald-50 border-l-2 border-l-emerald-600" : ""
                }`}
              >
                {/* CHANGED: now uses NAME initial */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}>
                  {u.name?.trim()?.[0]?.toUpperCase() || "R"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {u.transaction}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {u.name}
                  </div>
                </div>

                <div className={`w-2 h-2 rounded-full ${color.dot}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full min-h-0 overflow-hidden">

        {!selecteds ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a record
          </div>
        ) : (
          <>
            {/* Header (fixed, no scroll) */}
            <div className="bg-white border-b border-slate-300 px-6 py-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${selectedColor.bg} ${selectedColor.text}`}>
                {/* CHANGED: uses NAME initial */}
                {selecteds.name?.trim()?.[0]?.toUpperCase() || "R"}
              </div>

              <div>
                <div className="font-semibold">{selecteds.transaction}</div>
                <div className="text-sm text-slate-500">{selecteds.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedColor.bg} ${selectedColor.text}`}>
                  {selecteds.status}
                </span>
              </div>
            </div>

            {/* Body (NO SCROLL) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">

              <Section title="Request Info">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Date Requested" value={formatDate(selecteds.date)} />
                  <InfoCard label="Date Updated" value={formatDate(selecteds.dateupdated)} />
                  <InfoCard label="Payment" value={`₱${selecteds.pay}`} />
                  <InfoCard label="Pickup" value={selecteds.pickup} />
                </div>
              </Section>

              <Section title="Purpose">
                <InfoCard label="Reason" value={selecteds.purpose} />
              </Section>

            </div>

            {/* Actions */}
            {selecteds.status === "Approved" && (
  <div className="bg-white border-t p-4 flex gap-3">

    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleMarkSuccessful(selecteds.id, selecteds.transaction);
      }}
      className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
    >
      Mark Successful
    </button>

    {downloadableTransactions.includes(selecteds.transaction) && (
      <button disabled={downloading}
        onClick={(e) => {
          e.stopPropagation();
          handleDownload(selecteds.id, selecteds.transaction, selecteds.purpose);
        }}
        className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        Download
      </button>
    )}

  </div>
)}
          </>
        )}
      </div>
    </div>
  );
}

/* helpers */
const Section = ({ title, children }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{title}</p>
    {children}
  </div>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-white border rounded-lg p-3 border-slate-300">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
  </div>
);

export default Records;