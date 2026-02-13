import React from "react";


function ActivityHeatmap({ users, days = 30 }) {

  const requestCountsByDate = users.reduce((acc, u) => {
    const dateStr = new Date(u.date).toISOString().split("T")[0];
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  
  const lastDays = Array.from({ length: days }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (days - 1 - i));
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

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-1">Requests Activity</p>
      <div className="flex flex-wrap gap-1">
        {lastDays.map(({ dateStr, count, bgColor }) => (
          <div
            key={dateStr}
            title={`${count} request${count !== 1 ? "s" : ""} on ${dateStr}`}
            className={`w-3 h-3 rounded-sm ${bgColor}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ActivityHeatmap;
