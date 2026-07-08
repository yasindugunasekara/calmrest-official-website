import { LayoutDashboard, Calendar, MessageSquare, DoorOpen, Users, Settings, X, Home, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Bookings', icon: Calendar, path: '/bookings' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Rooms', icon: DoorOpen, path: '/rooms' },
    { name: 'Users', icon: Users, path: '/users' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-luxury-blue-950 border-r border-luxury-blue-900 text-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col justify-between overflow-hidden">
        {/* Scrollable container for branding & nav links */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          {/* Top Branding Section */}
          <div className="p-6 border-b border-luxury-blue-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                  <Home className="w-5 h-5 text-luxury-blue-950 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-white block">Calm Rest</span>
                  <span className="text-xs font-semibold text-gold tracking-widest uppercase block -mt-0.5">Luxury Hotel</span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-luxury-blue-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 relative group overflow-hidden ${
                    isActive
                      ? 'text-luxury-blue-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-luxury-blue-900/50'
                  }`}
                >
                  {/* Dynamic background animation for active link */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-500 rounded-xl z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <item.icon
                    className={`w-5 h-5 z-10 transition-colors duration-200 ${
                      isActive ? 'text-luxury-blue-950' : 'text-slate-400 group-hover:text-gold-300'
                    }`}
                  />
                  <span className="z-10 font-medium tracking-wide text-sm">{item.name}</span>

                  {isActive && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-luxury-blue-950 rounded-full z-10 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section at bottom */}
        <div className="p-4 border-t border-luxury-blue-900 bg-luxury-blue-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl">
            <div className="w-10 h-10 bg-luxury-blue-800 rounded-xl flex items-center justify-center border border-luxury-blue-700 shadow-md">
              <User className="w-5 h-5 text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-white truncate">Admin User</p>
                <span className="w-2 h-2 rounded-full bg-emerald-500 block" title="Active" />
              </div>
              <p className="text-xs text-slate-400 truncate">admin@calmrest.com</p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-luxury-blue-900 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
