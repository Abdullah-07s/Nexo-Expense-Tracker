import { Search, Bell, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-[#2a2a38] flex items-center justify-between px-6 bg-[#0a0a0f]">
      <div className="relative w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#13131a] border border-[#2a2a38] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-200 transition">
          <Moon size={18} />
        </button>
        <button className="relative text-gray-400 hover:text-gray-200 transition">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[10px] flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-medium">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
}