import React, { useState, useRef, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const STATUSES = ["Accepted", "Pending", "Rejected", "Successful"];

const STATUS_COLORS = {
  Accepted:   "#378ADD",
  Pending:    "#EF9F27",
  Rejected:   "#E24B4A",
  Successful: "#1D9E75",
};

const STATUS_TEXT_COLORS = {
  Accepted:   { color: "#0C447C" },
  Pending:    { color: "#854F0B" },
  Rejected:   { color: "#791F1F" },
  Successful: { color: "#085041" },
};

const TABS = ["By Status", "Distribution", "Over Time", "Resolution Time"];

function getYM(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short", year: "numeric" });
}

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)));
}

function formatMonthDisplay(ym) {
  const [y, m] = ym.split("-");
  return new Date(+y, +m - 1, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

function changeMonth(ym, delta) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ─── Chart content (reused inside modal) ────────────────────────────────────

function ChartContent({ users }) {
  const [activeTab, setActiveTab] = useState("By Status");

  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  users.forEach((u) => {
    if (counts[u.status] !== undefined) counts[u.status]++;
  });
  const total = users.length || 1;

  const monthMap = {};
  users.forEach((u) => {
    const effectiveDate =
      u.status !== "Pending" && u.dateUpdated ? u.dateUpdated : u.date;
    const label = getMonthLabel(effectiveDate);
    if (!monthMap[label])
      monthMap[label] = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    monthMap[label][u.status]++;
  });
  const sortedMonths = Object.keys(monthMap).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const resolutionData = {};
  const resolutionCount = {};
  users.forEach((u) => {
    if (u.status !== "Pending" && u.dateUpdated && u.date) {
      const days = daysBetween(u.date, u.dateUpdated);
      resolutionData[u.status] = (resolutionData[u.status] || 0) + days;
      resolutionCount[u.status] = (resolutionCount[u.status] || 0) + 1;
    }
  });
  const avgResolution = STATUSES.filter((s) => s !== "Pending").map((s) =>
    resolutionCount[s]
      ? Math.round(resolutionData[s] / resolutionCount[s])
      : 0
  );

  const barData = {
    labels: STATUSES,
    datasets: [
      {
        label: "Requests",
        data: STATUSES.map((s) => counts[s]),
        backgroundColor: STATUSES.map((s) => STATUS_COLORS[s] + "CC"),
        borderColor: STATUSES.map((s) => STATUS_COLORS[s]),
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: STATUSES,
    datasets: [
      {
        data: STATUSES.map((s) => counts[s]),
        backgroundColor: STATUSES.map((s) => STATUS_COLORS[s] + "CC"),
        borderColor: STATUSES.map((s) => STATUS_COLORS[s]),
        borderWidth: 1.5,
        hoverOffset: 6,
      },
    ],
  };

  const lineData = {
    labels: sortedMonths,
    datasets: STATUSES.map((s) => ({
      label: s,
      data: sortedMonths.map((m) => monthMap[m]?.[s] || 0),
      borderColor: STATUS_COLORS[s],
      backgroundColor: STATUS_COLORS[s] + "33",
      borderWidth: 2,
      borderDash:
        s === "Pending" ? [6, 3] : s === "Rejected" ? [2, 2] : [],
      pointRadius: 4,
      tension: 0.3,
      fill: false,
    })),
  };

  const resolvedStatuses = STATUSES.filter((s) => s !== "Pending");
  const resolutionBarData = {
    labels: resolvedStatuses,
    datasets: [
      {
        label: "Avg days to resolution",
        data: avgResolution,
        backgroundColor: resolvedStatuses.map((s) => STATUS_COLORS[s] + "CC"),
        borderColor: resolvedStatuses.map((s) => STATUS_COLORS[s]),
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const scaleOptions = {
    x: { grid: { display: false }, ticks: { font: { size: 12 } } },
    y: {
      grid: { color: "rgba(128,128,128,0.12)" },
      beginAtZero: true,
      ticks: { font: { size: 12 } },
    },
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
          marginBottom: "1rem",
        }}
      >
        {STATUSES.map((s) => (
          <div
            key={s}
            style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "0.6rem 0.85rem",
            }}
          >
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "0 0 3px" }}>
              {s}
            </p>
            <p style={{ fontSize: 20, fontWeight: 500, margin: 0, ...STATUS_TEXT_COLORS[s] }}>
              {counts[s]}
            </p>
            <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>
              {Math.round((counts[s] / total) * 100)}%
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: "0.75rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background:
                activeTab === tab
                  ? "var(--color-background-secondary)"
                  : "transparent",
              color:
                activeTab === tab
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
              fontWeight: activeTab === tab ? 500 : 400,
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 10,
          fontSize: 12,
          color: "var(--color-text-secondary)",
        }}
      >
        {STATUSES.map((s) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: STATUS_COLORS[s],
                flexShrink: 0,
              }}
            />
            {s}
          </span>
        ))}
      </div>

      {/* Chart Panels */}
      <div style={{ position: "relative", width: "100%", height: 260 }}>
        {activeTab === "By Status" && (
          <Bar data={barData} options={{ ...commonOptions, scales: scaleOptions }} />
        )}

        {activeTab === "Distribution" && (
          <Doughnut
            data={doughnutData}
            options={{
              ...commonOptions,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) =>
                      ` ${ctx.label}: ${ctx.parsed} (${Math.round(
                        (ctx.parsed / total) * 100
                      )}%)`,
                  },
                },
              },
            }}
          />
        )}

        {activeTab === "Over Time" && (
          <Line data={lineData} options={{ ...commonOptions, scales: scaleOptions }} />
        )}

        {activeTab === "Resolution Time" && (
          <Bar
            data={resolutionBarData}
            options={{
              ...commonOptions,
              scales: {
                ...scaleOptions,
                y: {
                  ...scaleOptions.y,
                  title: { display: true, text: "Days", font: { size: 11 } },
                },
              },
            }}
          />
        )}
      </div>

      {activeTab === "Over Time" && (
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6 }}>
          Non-pending plotted by <strong>dateUpdated</strong>; pending by <strong>date</strong>.
        </p>
      )}
      {activeTab === "Resolution Time" && (
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6 }}>
          Average days from <strong>date</strong> to <strong>dateUpdated</strong> (excludes Pending).
        </p>
      )}
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

function ChartWithMonthModal({ users: allUsers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);

  const now = new Date();
  const [currentYM, setCurrentYM] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );

  const filteredUsers = allUsers.filter((u) => u.date?.startsWith(currentYM));

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handlePrev = () => setCurrentYM((ym) => changeMonth(ym, -1));
  const handleNext = () => setCurrentYM((ym) => changeMonth(ym, 1));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "8px 18px",
          fontSize: 14,
          fontWeight: 500,
          borderRadius: "var(--border-radius-md)",
          border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-secondary)",
          color: "var(--color-text-primary)",
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
              background: "var(--color-background-primary)",
              borderRadius: "var(--border-radius-lg)",
              border: "0.5px solid var(--color-border-tertiary)",
              width: "100%",
              maxWidth: 660,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.25rem 1.5rem",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
                Request analytics
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 18,
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "2px 6px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Month navigator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: "1rem",
              }}
            >
              <button
                onClick={handlePrev}
                style={{
                  padding: "5px 10px",
                  fontSize: 16,
                  borderRadius: "var(--border-radius-md)",
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "transparent",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ‹
              </button>

              <input
                type="month"
                value={currentYM}
                onChange={(e) => setCurrentYM(e.target.value)}
                style={{
                  padding: "5px 10px",
                  fontSize: 13,
                  borderRadius: "var(--border-radius-md)",
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "var(--color-background-secondary)",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                }}
              />

              <button
                onClick={handleNext}
                style={{
                  padding: "5px 10px",
                  fontSize: 16,
                  borderRadius: "var(--border-radius-md)",
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "transparent",
                  color: "var(--color-text-primary)",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ›
              </button>

              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: 4 }}>
                {formatMonthDisplay(currentYM)}
              </span>
            </div>

            {/* Chart content filtered to selected month */}
            <ChartContent users={filteredUsers} />
          </div>
        </div>
      )}
    </>
  );
}

export default ChartWithMonthModal;