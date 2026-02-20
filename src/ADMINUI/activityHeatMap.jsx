import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ActivityHeatmap({ users }) {
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

  const requestCountsByDate = users.reduce((acc, u) => {
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

      {/* Max request */}
      <div className="mt-2 text-[11px] text-gray-600 dark:text-gray-300 font-medium">
        Max requests this month: {maxCount}
      </div>
    </div>
  );
}

export default ActivityHeatmap;
