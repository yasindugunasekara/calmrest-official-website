import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, User, Calendar, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'alert';
  title: string;
  time: string;
  isRead: boolean;
  icon: any;
  color: string;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

  // Time conversion helpers
  const getTimestampFromId = (id: string) => {
    try {
      if (!id || id.length < 8) return 0;
      return parseInt(id.substring(0, 8), 16) * 1000;
    } catch (e) {
      return 0;
    }
  };

  const timeAgoFromId = (id: string) => {
    try {
      if (!id || id.length < 8) return "Recently";
      const timestampHex = id.substring(0, 8);
      const timestampMs = parseInt(timestampHex, 16) * 1000;
      const seconds = Math.floor((new Date().getTime() - timestampMs) / 1000);
      
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch (e) {
      return "Recently";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Fetch bookings and messages from database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const bookingsRes = await fetch(`${API_BASE_URL}/bookings`);
        const messagesRes = await fetch(`${API_BASE_URL}/messages`);
        
        let bookingsList: any[] = [];
        let messagesList: any[] = [];

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          bookingsList = Array.isArray(bookingsData) ? bookingsData : [];
        }

        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          messagesList = Array.isArray(messagesData) ? messagesData : messagesData.data || [];
        }

        const derivedNotifications: Notification[] = [];

        // Sort arrays descending by creation time
        const sortedBookings = [...bookingsList].sort((a: any, b: any) => getTimestampFromId(b._id) - getTimestampFromId(a._id));
        const sortedMessages = [...messagesList].sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : getTimestampFromId(a._id);
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : getTimestampFromId(b._id);
          return timeB - timeA;
        });

        // Add bookings as notifications (up to 3 recent bookings)
        sortedBookings.slice(0, 3).forEach((b: any) => {
          derivedNotifications.push({
            id: `b-${b._id}`,
            type: 'booking',
            title: `New booking: ${b.firstName} ${b.lastName} (${b.roomType})`,
            time: timeAgoFromId(b._id),
            isRead: true,
            icon: CheckCircle,
            color: 'bg-emerald-50 text-emerald-600',
          });
        });

        // Add messages as notifications (up to 3 recent messages)
        sortedMessages.slice(0, 3).forEach((m: any) => {
          derivedNotifications.push({
            id: `m-${m._id}`,
            type: 'message',
            title: `${m.fullName} sent query: "${m.subject || 'No Subject'}"`,
            time: m.createdAt ? formatTimeAgo(m.createdAt) : timeAgoFromId(m._id),
            isRead: m.isRead || false,
            icon: MessageSquare,
            color: 'bg-gold-50 text-gold-600',
          });
        });

        setNotifications(derivedNotifications);
      } catch (err) {
        console.error("Failed to load notifications from database:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Tick current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside notification dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getFormattedDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Menu button on mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Date/Time & Search bar */}
        <div className="flex-1 flex items-center gap-6 max-w-xl mx-4">
          <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm font-semibold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4 text-gold" />
            <span>{getFormattedDate()}</span>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, guests, rooms..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200/80 rounded-xl focus:bg-white text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-xl transition-all"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 border border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Container */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
                >
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-gold hover:text-gold-700 font-semibold transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                            !notif.isRead ? 'bg-gold-50/20' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${notif.color}`}>
                            <notif.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs text-gray-700 leading-normal ${!notif.isRead ? 'font-semibold' : ''}`}>
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-gray-400 font-medium block mt-1">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-gray-400 italic">No new notifications from database</div>
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-gray-100 text-center bg-gray-50/50">
                    <a href="/messages" className="text-xs text-gray-500 hover:text-gray-800 font-semibold transition-colors">
                      View all messages
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Admin Avatar Menu */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-100 border border-gold-200 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-gold-700 font-bold text-sm">AU</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-gray-800 block leading-tight">Admin User</span>
              <span className="text-[10px] font-medium text-emerald-600 block leading-tight">Super Admin</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
