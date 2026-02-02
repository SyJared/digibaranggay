function StatCard({ label, value, maxBubbles = 10 }) {

  const bubbleCount = Math.min(value, maxBubbles);

  return (
    <div className="bg-gray-100 text-gray-800 rounded-xl p-4 shadow-md flex flex-col gap-3">
      
      <div className="flex justify-between items-center">
        <p className="text-sm opacity-80 capitalize">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      {/* bubbles */}
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: bubbleCount }).map((_, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full bg-teal-600"
          />
        ))}
      </div>

    </div>
  );
}
export default StatCard