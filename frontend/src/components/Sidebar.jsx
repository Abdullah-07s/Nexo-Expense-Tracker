import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, FolderOpen, Wallet,
  BarChart3, Calculator, Settings, LogOut, Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/budgets', icon: Wallet, label: 'Budgets' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/calculator', icon: Calculator, label: 'Calculator' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#0d0d13] border-r border-[#2a2a38] flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-bold text-sm">
          N
        </div>
        <span className="text-lg font-bold tracking-tight">NEXO</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-purple-500/15 text-purple-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 space-y-2">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 rounded-xl p-3 flex items-center gap-2">
          <Crown size={16} className="text-purple-400" />
          <div className="text-xs">
            <p className="font-medium text-gray-200">Upgrade to Pro</p>
            <p className="text-gray-500">Unlock premium features</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}