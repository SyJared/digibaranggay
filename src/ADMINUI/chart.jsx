import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const STATUSES = ["Approved", "Pending", "Rejected", "Successful"];
const STATUS_COLORS = {
  Approved:   "#378ADD",
  Pending:    "#EF9F27",
  Rejected:   "#E24B4A",
  Successful: "#1D9E75",
};
const STATUS_TEXT_COLORS = {
  Approved:   { color: "#0C447C" },
  Pending:    { color: "#854F0B" },
  Rejected:   { color: "#791F1F" },
  Successful: { color: "#085041" },
};

const TRANSACTIONS = [
  "KKID Card",
  "Working Clearance",
  "OSCA",
  "First Job Seeker",
  "Barangay ID",
  "Barangay Clearance",
  "Certificate of Indigency",
  "Barangay Inhabitants",
];

const TRANSACTION_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TABS = ["By Status", "By Transaction", "Busiest Days", "Payment Summary"];

function daysBetween(dateA, dateB) {
  if (!dateA || !dateB) return null;
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: "rgba(128,128,128,0.1)" }, beginAtZero: true, ticks: { font: { size: 11 } } },
  },
};

function StatCard({ label, value, sub, valueStyle = {} }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "0.6rem 0.85rem", border: "1px solid #e5e7eb" }}>
      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 3px" }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#111827", ...valueStyle }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0" }}>{sub}</p>}
    </div>
  );
}

function ChartContent({ users }) {
  const [activeTab, setActiveTab] = useState("By Status");
  const total = users.length || 1;

  // By Status
  const statusCounts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  users.forEach((u) => { if (statusCounts[u.status] !== undefined) statusCounts[u.status]++; });

  const byStatusData = {
    labels: STATUSES,
    datasets: [{
      label: "Requests",
      data: STATUSES.map((s) => statusCounts[s]),
      backgroundColor: STATUSES.map((s) => STATUS_COLORS[s] + "CC"),
      borderColor: STATUSES.map((s) => STATUS_COLORS[s]),
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  // By Transaction
  const txCounts = Object.fromEntries(TRANSACTIONS.map((t) => [t, 0]));
  users.forEach((u) => { if (u.transaction && txCounts[u.transaction] !== undefined) txCounts[u.transaction]++; });
  const sortedTx = [...TRANSACTIONS].sort((a, b) => txCounts[b] - txCounts[a]);

  const byTxData = {
    labels: sortedTx.map((t) => t.length > 14 ? t.slice(0, 13) + "…" : t),
    datasets: [{
      label: "Requests",
      data: sortedTx.map((t) => txCounts[t]),
      backgroundColor: sortedTx.map((_, i) => TRANSACTION_COLORS[i % TRANSACTION_COLORS.length] + "CC"),
      borderColor: sortedTx.map((_, i) => TRANSACTION_COLORS[i % TRANSACTION_COLORS.length]),
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  // Busiest Days
  const dayCounts = Array(7).fill(0);
  users.forEach((u) => { if (u.date) dayCounts[new Date(u.date).getDay()]++; });

  const byDayData = {
    labels: DAYS,
    datasets: [{
      label: "Requests",
      data: dayCounts,
      backgroundColor: "#6366f1CC",
      borderColor: "#6366f1",
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  // Payment Summary
  let freeCount = 0;
let paidCount = 0;
let totalRevenue = 0;

users.forEach((u) => {
  if (u.status !== "Successful") return; // 👈 only successful requests

  const amount = parseFloat(u.pay);

  if (!amount || amount === 0) {
    freeCount++;
  } else {
    paidCount++;
    totalRevenue += amount;
  }
});

  const payData = {
    labels: ["Free", "Paid"],
    datasets: [{
      label: "Requests",
      data: [freeCount, paidCount],
      backgroundColor: ["#10b981CC", "#6366f1CC"],
      borderColor: ["#10b981", "#6366f1"],
      borderWidth: 1.5,
      borderRadius: 4,
    }],
  };

  // Avg Resolution by Transaction
  

  const mostRequested = sortedTx[0] || "—";
  const busiestDay = DAYS[dayCounts.indexOf(Math.max(...dayCounts))];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* Top summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8, marginBottom: 8 }}>
        <StatCard label="Total Requests" value={users.length} />
        <StatCard label="Pending" value={statusCounts["Pending"]} valueStyle={STATUS_TEXT_COLORS["Pending"]} />
        <StatCard label="Total payment" value={`₱${totalRevenue.toFixed(2)}`} valueStyle={{ color: "#059669" }} />
        <StatCard label="Free Requests" value={freeCount} sub={`${Math.round((freeCount / total) * 100)}% of total`} />
      </div>

      {/* Second row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8, marginBottom: "1rem" }}>
        <StatCard label="Most Requested" value={mostRequested} />
        <StatCard label="Busiest Day" value={busiestDay} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: activeTab === tab ? "#111827" : "#f9fafb",
              color: activeTab === tab ? "#ffffff" : "#6b7280",
              fontWeight: activeTab === tab ? 500 : 400,
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: "relative", width: "100%", height: 260 }}>
        {activeTab === "By Status" && <Bar data={byStatusData} options={commonOptions} />}
        {activeTab === "By Transaction" && <Bar data={byTxData} options={commonOptions} />}
        {activeTab === "Busiest Days" && <Bar data={byDayData} options={commonOptions} />}
        {activeTab === "Payment Summary" && (
          <Bar
            data={payData}
            options={{
              ...commonOptions,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    afterLabel: (ctx) => ctx.label === "Paid" ? `Total: ₱${totalRevenue.toFixed(2)}` : "",
                  },
                },
              },
            }}
          />
        )}
        {activeTab === "Avg Resolution" && (
          <Bar
            data={resData}
            options={{
              ...commonOptions,
              scales: {
                ...commonOptions.scales,
                y: { ...commonOptions.scales.y, title: { display: true, text: "Days", font: { size: 11 } } },
              },
            }}
          />
        )}
      </div>

      {activeTab === "Avg Resolution" && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
          Average days from <strong>date</strong> to <strong>completed_date</strong>. Only completed requests counted.
        </p>
      )}
      {activeTab === "Payment Summary" && (
        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
          <strong>Free</strong> = ₱0.00 requests. Hover the Paid bar to see total revenue.
        </p>
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function ChartWithMonthModal({ users: allUsers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const filteredUsers = allUsers.filter((u) => {
    if (!u.date) return true;
    if (fromDate && u.date < fromDate) return false;
    if (toDate && u.date > toDate) return false;
    return true;
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 500,
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          background: "#f9fafb",
          color: "#111827",
          cursor: "pointer",
        }}
      >
        View Analytics
      </button>

      {isOpen && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) setIsOpen(false); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              width: "100%",
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.25rem 1.5rem",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Request Analytics</span>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: 18, color: "#6b7280", cursor: "pointer", padding: "2px 6px" }}
              >
                ✕
              </button>
            </div>

            {/* Date range filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>From</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
              />
              <span style={{ fontSize: 12, color: "#6b7280" }}>To</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ padding: "4px 8px", fontSize: 12, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#111827" }}
              />
              {(fromDate || toDate) && (
                <button
                  onClick={() => { setFromDate(""); setToDate(""); }}
                  style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}
                >
                  Clear
                </button>
              )}
              <span style={{ fontSize: 11, color: "#6b7280" }}>
                {filteredUsers.length} of {allUsers.length} requests
              </span>
            </div>

            <ChartContent users={filteredUsers} />
          </div>
        </div>
      )}
    </>
  );
}

export default ChartWithMonthModal;