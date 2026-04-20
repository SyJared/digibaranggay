import React, { useContext, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RegisteredContext } from "../registeredContext";
import ChartWithMonthModal from "./chart";

function ActivityHeatmap({ users }) {
  const { registered } = useContext(RegisteredContext);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const prevMonth = () => {
    setCurrentMonth(prev => ({
      month: prev.month === 0 ? 11 : prev.month - 1,
      year: prev.month === 0 ? prev.year - 1 : prev.year,
    }));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => ({
      month: prev.month === 11 ? 0 : prev.month + 1,
      year: prev.month === 11 ? prev.year + 1 : prev.year,
    }));
  };

  const usersInMonth = users.filter(u => {
    const d = new Date(u.date);
    return d.getFullYear() === currentMonth.year && d.getMonth() === currentMonth.month;
  });

  const requestCountsByDate = usersInMonth.reduce((acc, u) => {
    const dateStr = new Date(u.date).toISOString().split("T")[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = new Date(currentMonth.year, currentMonth.month, i + 1);
    const dateStr = day.toISOString().split("T")[0];
    const count = requestCountsByDate[dateStr] || 0;

    const bgColor =
      count === 0
        ? "bg-gray-200"
        : count === 1
        ? "bg-green-300"
        : count === 2
        ? "bg-green-500"
        : "bg-green-700";

    return { dateStr, count, bgColor };
  });

  const maxCount = Math.max(...monthDays.map(d => d.count));
  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString("default", { month: "long" });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Request Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Month: ${monthName} ${currentMonth.year}`, 14, 30);

    const tableData = usersInMonth.map((u, index) => [
      index + 1,
      u.name,
      u.address,
      u.purpose,
      u.pay,
      u.date,
      u.status,
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Address", "Purpose", "Pay", "Date", "Status"]],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`Requests for ${monthName}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 max-w-[400px] mx-auto">
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {monthName} {currentMonth.year}
        </p>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Horizontal heatmap row */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {monthDays.map(({ dateStr, count, bgColor }) => (
          <div
            key={dateStr}
            title={`${count} request${count !== 1 ? "s" : ""} on ${dateStr}`}
            className={`w-6 h-6 rounded-md cursor-pointer ${bgColor} flex-shrink-0 transition-all duration-150`}
          />
        ))}
      </div>

      {/* Bottom row: max count + analytics + download */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300 font-medium">
        <div>Max: {maxCount} requests</div>
        <div className="flex items-center gap-2">
          <ChartWithMonthModal users={users} />
          <button
            onClick={generatePDF}
            className="bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 transition text-[11px] font-medium"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;