import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('(UTC+05:00) Islamabad, Karachi');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Note: no backend endpoint exists yet for profile updates.
    // This currently only updates local UI state as a placeholder.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-gray-400 text-sm mb-6">Manage your account information</p>

        <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xl font-semibold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {saved && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Changes saved (local only — profile update endpoint not yet implemented)
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>PKR (₨)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option>(UTC+05:00) Islamabad, Karachi</option>
                <option>(UTC+00:00) London</option>
                <option>(UTC-05:00) New York</option>
                <option>(UTC-08:00) Los Angeles</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}