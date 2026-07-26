export default function ProgressBar({ percent, exceeded }) {
  const clamped = Math.min(percent, 100);
  return (
    <div className="w-full h-2 rounded-full bg-[#2a2a38] overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          exceeded ? 'bg-red-500' : 'bg-purple-500'
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}