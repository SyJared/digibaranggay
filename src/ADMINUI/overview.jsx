function StatCard({ label, value, tone = "teal" }) {
  // Harmonized colors
  const tones = {
    teal: "bg-teal-600",       // primary accent
    emerald: "bg-emerald-500", // secondary accent
    slate: "bg-slate-600",     // neutral / total
    amber: "bg-amber-500",     // pending / warning
    red: "bg-red-600",         // rejected / error
    purple: "bg-purple-600",   // expired / less important
    pink: "bg-pink-500"        // female / gender
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 hover:shadow-lg transition-transform transform hover:-translate-y-1">
      
      {/* Label */}
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      
      {/* Value */}
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>

      {/* Accent bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full mt-3">
        <div
          className={`${tones[tone]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(value * 10, 100)}%` }}
        />
      </div>
    </div>
  );
}
export default StatCard