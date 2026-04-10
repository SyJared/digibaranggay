import { useContext, useState } from "react";
import { RequestContext } from "../requestList";

function Records() {
  const { users, listingMessage } = useContext(RequestContext);

  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["All", "Approved", "Pending", "Rejected", "Expired", "Successful"];

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

  const normalized = users.map((u) => ({
    ...u,
    status: (u.status || "").trim(),
    name: (u.name || "").trim(),
    email: (u.email || "").trim(),
  }));

  const filteredUsers = normalized
    .filter((u) => filterStatus === "All" || u.status === filterStatus)
    .filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selected = normalized.find(
  (u) =>
    u.id === selectedId?.id &&
    u.transaction === selectedId?.transaction
);
  const selectedColor = selected ? statusColors[selected.status] : null;

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

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate_doc.php`, {
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

  return (
    <div className="flex h-full overflow-hidden">

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
                onClick={() => { setFilterStatus(s); setSelectedId(null); }}
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
            selectedId?.id === u.id &&
            selectedId?.transaction === u.transaction;

            return (
              <button
                key={u.id}
                onClick={() => setSelectedId({ id: u.id, transaction: u.transaction })}
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

        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a record
          </div>
        ) : (
          <>
            {/* Header (fixed, no scroll) */}
            <div className="bg-white border-b border-slate-300 px-6 py-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${selectedColor.bg} ${selectedColor.text}`}>
                {/* CHANGED: uses NAME initial */}
                {selected.name?.trim()?.[0]?.toUpperCase() || "R"}
              </div>

              <div>
                <div className="font-semibold">{selected.transaction}</div>
                <div className="text-sm text-slate-500">{selected.name}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedColor.bg} ${selectedColor.text}`}>
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Body (NO SCROLL) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">

              <Section title="Request Info">
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Date Requested" value={formatDate(selected.date)} />
                  <InfoCard label="Date Updated" value={formatDate(selected.dateupdated)} />
                  <InfoCard label="Payment" value={`₱${selected.pay}`} />
                  <InfoCard label="Pickup" value={selected.pickup} />
                </div>
              </Section>

              <Section title="Purpose">
                <InfoCard label="Reason" value={selected.purpose} />
              </Section>

            </div>

            {/* Actions */}
            {selected.status === "Approved" && (
              <div className="bg-white border-t p-4 flex gap-3">
                <button 
                onClick={(e) => {
                          e.stopPropagation();
                          handleMarkSuccessful(u.id, u.transaction);
                        }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                  Mark Successful
                </button>
                <button 
                onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(selected.id, selected.transaction, selected.purpose);
                        }}
                 className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                  Download
                </button>
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