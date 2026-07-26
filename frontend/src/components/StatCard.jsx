export default function StatCard({ label, value, sublabel, sublabelColor = 'text-gray-500' }) {
  return (
    <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {sublabel && <p className={`text-xs ${sublabelColor}`}>{sublabel}</p>}
    </div>
  );
}