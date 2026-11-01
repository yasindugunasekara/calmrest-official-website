import { useNavigate } from "react-router-dom";
import { dailyMetrics } from "../lib/metrics";
import {
  TrendingUp,
  TrendingDown,
  Home,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../services/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [inventoryDate, setInventoryDate] = useState(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  );
  type Booking = {
    _id: string;
    pricePerNight?: number;
    totalPrice?: number;
    nights?: number;
    roomId?: string;
    guest: string;
    firstName: string;
    lastName: string;
    room: string;
    roomType?: string;
    status?: string;
    date: string;
    checkIn: string;
    checkOut: string;
    createdAt: string;
  };

  type Room = {
    _id: string;
    name: string;
    price: number;
    inventory?: number;
    category?: string;
  };

  type Message = {
    _id: string;
    fullName: string;
    subject: string;
    message: string;
    createdAt: string;
  };

  type TimelineItem = {
    id: string;
    type: "booking" | "message";
    title: string;
    desc: string;
    timestamp: number;
    timeLabel: string;
  };

  type ChartPoint = {
    label: string;
    val: number;
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [occupancyChart, setOccupancyChart] = useState<ChartPoint[]>([]);
  const [revenueChart, setRevenueChart] = useState<ChartPoint[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"occupancy" | "revenue">(
    "occupancy",
  );

  const getToday = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const timeAgo = (timestampMs: number) => {
    const diffMs = new Date().getTime() - timestampMs;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTimestampFromId = (id: string) => {
    try {
      if (!id || id.length < 8) return new Date().getTime();
      const timestampHex = id.substring(0, 8);
      return parseInt(timestampHex, 16) * 1000;
    } catch {
      return new Date().getTime();
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError("");
      try {
        const [bookingsRes, roomsRes, messagesRes] = await Promise.all([
          axios.get<Booking[]>("/bookings"),
          axios.get<Room[]>("/rooms"),
          axios.get<{ data: Message[] }>("/messages"),
        ]);

        const fetchedBookings = bookingsRes.data.map((b) => ({
          ...b,
          status: b.status || "Pending",
        }));

        const fetchedRooms = roomsRes.data || [];

        let fetchedMessages: Message[] = [];
        if (messagesRes.data) {
          fetchedMessages = Array.isArray(messagesRes.data)
            ? messagesRes.data
            : messagesRes.data.data || [];
        }

        setBookings(fetchedBookings);
        setRooms(fetchedRooms);

        // --- Calculate Timeline Updates from DB ---
        const items: TimelineItem[] = [];

        // Add direct bookings
        fetchedBookings.forEach((b) => {
          const ts = getTimestampFromId(b._id);
          items.push({
            id: `b-${b._id}`,
            type: "booking",
            title: "Reservation Received",
            desc: `${b.firstName} ${b.lastName} booked ${b.roomType || "Standard Room"} (Check In: ${b.checkIn})`,
            timestamp: ts,
            timeLabel: timeAgo(ts),
          });
        });

        // Add feedback queries
        fetchedMessages.forEach((m) => {
          const ts = m.createdAt
            ? new Date(m.createdAt).getTime()
            : getTimestampFromId(m._id);
          items.push({
            id: `m-${m._id}`,
            type: "message",
            title: "Guest Inquiry",
            desc: `Message from ${m.fullName} regarding: "${m.subject || "concierge details"}"`,
            timestamp: ts,
            timeLabel: timeAgo(ts),
          });
        });

        // Sort timeline items chronologically (latest first) and slice to top 4
        setTimeline(
          items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4),
        );

        // --- Compute Real Occupancy & Reserved value Charts (Past 7 Days) ---
        const past7Days: { dateStr: string; dayLabel: string }[] = [];
        const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          past7Days.push({
            dateStr: new Intl.DateTimeFormat("en-CA", {
              timeZone: "Asia/Colombo",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(d),
            dayLabel: weekdayNames[d.getDay()],
          });
        }

        const occupancyPoints: ChartPoint[] = [];
        const revenuePoints: ChartPoint[] = [];
        past7Days.forEach(({ dateStr, dayLabel }) => {
          const metrics = dailyMetrics(fetchedBookings, fetchedRooms, dateStr);
          occupancyPoints.push({ label: dayLabel, val: metrics.occupancy });
          revenuePoints.push({ label: dayLabel, val: metrics.value });
        });

        setOccupancyChart(occupancyPoints);
        setRevenueChart(revenuePoints);
      } catch {
        setError(
          "Dashboard data could not be loaded. Please refresh to retry.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const refresh = () => {
      if (document.visibilityState === "visible") void fetchDashboardData();
    };
    const timer = setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    window.addEventListener("hotel-data-changed", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("hotel-data-changed", refresh);
    };
  }, []);

  const today = getToday();

  const activeBookings = bookings.filter(
    (b) => !["Cancelled", "Checked Out"].includes(b.status || ""),
  );
  const arrivals = activeBookings.filter(
    (b) => b.checkIn === today && b.status !== "Cancelled",
  ).length;
  const departures = activeBookings.filter(
    (b) => b.checkOut === today && b.status !== "Cancelled",
  ).length;
  const stayovers = activeBookings.filter(
    (b) => b.checkIn < today && b.checkOut > today,
  ).length;

  const totalRoomsLimit = rooms.reduce((sum, r) => sum + (r.inventory || 1), 0);
  const freeRooms = totalRoomsLimit - (arrivals + stayovers);

  const todayStats = [
    {
      label: "Arrivals Today",
      count: arrivals,
      icon: TrendingUp,
      color: "text-emerald-500 bg-emerald-50 border border-emerald-100",
      description: "Guests arriving today",
    },
    {
      label: "Departures Today",
      count: departures,
      icon: TrendingDown,
      color: "text-blue-500 bg-blue-50 border border-blue-100",
      description: "Scheduled check-outs",
    },
    {
      label: "Current Stayovers",
      count: stayovers,
      icon: Home,
      color: "text-amber-500 bg-amber-50 border border-amber-100",
      description: "In-house occupants",
    },
    {
      label: "Available Rooms",
      count: freeRooms >= 0 ? freeRooms : 0,
      icon: CheckCircle,
      color: "text-gold bg-gold-50/50 border border-gold-200/30",
      description: "Unoccupied rooms left",
    },
  ];

  // Dynamic axis calculation for charts based on maximum database results
  const selectedChartData =
    activeTab === "occupancy" ? occupancyChart : revenueChart;
  const maxDataVal =
    selectedChartData.length > 0
      ? Math.max(...selectedChartData.map((d) => d.val))
      : 100;
  const upperYLimit =
    activeTab === "occupancy"
      ? 100
      : Math.max(Math.ceil(maxDataVal / 1000) * 1000, 1000);

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="p-4 bg-red-50 text-red-700">
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Updates automatically every 30 seconds while this page is open.
        Availability counts reservations for each night, with check-out day
        available again.
      </p>

      {/* Welcome Luxury Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-luxury-blue-900 to-luxury-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-luxury-blue-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Calm Rest Admin Dashboard
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-luxury-blue-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-gold/15 hover:shadow-gold/25 transition-all text-sm hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              Manage Bookings
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("inventory-grid")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center gap-2 bg-luxury-blue-800 border border-luxury-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-luxury-blue-700 transition-all text-sm"
            >
              <Calendar className="w-4 h-4 text-gold" />
              Room Grid
            </button>
          </div>
        </div>
      </div>
      <section
        id="inventory-grid"
        className="bg-white border rounded-2xl p-4 sm:p-6 order-last"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold">Room inventory planner</h2>
            <p className="text-sm text-slate-500">
              Available rooms per night · pending and confirmed stays reserve
              inventory
            </p>
          </div>
          <label className="text-sm">
            Week starting
            <input
              type="date"
              aria-label="Inventory week starting"
              value={inventoryDate}
              onChange={(e) => {
                if (e.target.value) setInventoryDate(e.target.value);
              }}
              className="border rounded-lg p-2 ml-2"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-3 min-w-40">Room category</th>
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(Date.parse(inventoryDate) + i * 86400000)
                    .toISOString()
                    .slice(0, 10);
                  return (
                    <th key={d} className="p-3 min-w-24">
                      {d.slice(5)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-t">
                  <th className="p-3">
                    {room.name}
                    <span className="block text-xs font-normal text-slate-500">
                      {room.inventory || 1} total
                    </span>
                  </th>
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date(Date.parse(inventoryDate) + i * 86400000)
                      .toISOString()
                      .slice(0, 10);
                    const reserved = bookings.filter(
                      (b) =>
                        !["Cancelled", "Checked Out"].includes(
                          b.status || "",
                        ) &&
                        (b.roomId === room._id ||
                          (!b.roomId && b.roomType === room.name)) &&
                        b.checkIn <= d &&
                        b.checkOut > d,
                    ).length;
                    const available = Math.max(
                      0,
                      (room.inventory || 1) - reserved,
                    );
                    return (
                      <td key={d} className="p-3">
                        <span
                          className={`block rounded-lg p-2 text-center ${available ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}
                        >
                          {available} free
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => navigate("/rooms")}
          className="mt-4 text-sm underline"
        >
          Edit room categories and inventory
        </button>
      </section>

      {/* Today’s Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-gray-800 mt-1.5">
                  {loading ? (
                    <span className="inline-block w-8 h-6 bg-gray-100 animate-pulse rounded" />
                  ) : (
                    stat.count
                  )}
                </p>
                <p className="text-gray-500 text-xs mt-1 font-medium">
                  {stat.description}
                </p>
              </div>
              <div
                className={`${stat.color} p-3.5 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Database Calculations Chart & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Database Trends Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Database Analytics Trends
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Reserved occupancy and room value derived from guest booking
                records; includes pending reservations; excludes cancellations
                and unknown historical prices
              </p>
            </div>

            {/* Custom Tab Switcher */}
            <div className="flex gap-1 bg-gray-50 border border-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("occupancy")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "occupancy"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Occupancy Rate (%)
              </button>
              <button
                onClick={() => setActiveTab("revenue")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "revenue"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Reserved value ($)
              </button>
            </div>
          </div>

          {/* Premium Custom SVG Chart View */}
          <div className="h-64 relative flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[10px] text-gray-400 font-semibold">
              <div className="border-b border-gray-50 w-full pt-1 pb-1">
                <span>
                  {activeTab === "occupancy"
                    ? `${upperYLimit}%`
                    : `$${upperYLimit}`}
                </span>
              </div>
              <div className="border-b border-gray-50 w-full pt-1 pb-1">
                <span>
                  {activeTab === "occupancy"
                    ? `${Math.round(upperYLimit * 0.75)}%`
                    : `$${Math.round(upperYLimit * 0.75)}`}
                </span>
              </div>
              <div className="border-b border-gray-50 w-full pt-1 pb-1">
                <span>
                  {activeTab === "occupancy"
                    ? `${Math.round(upperYLimit * 0.5)}%`
                    : `$${Math.round(upperYLimit * 0.5)}`}
                </span>
              </div>
              <div className="border-b border-gray-50 w-full pt-1 pb-1">
                <span>
                  {activeTab === "occupancy"
                    ? `${Math.round(upperYLimit * 0.25)}%`
                    : `$${Math.round(upperYLimit * 0.25)}`}
                </span>
              </div>
            </div>

            {/* Render bars and metrics */}
            <div className="relative z-10 w-full h-4/5 flex items-end justify-between px-2">
              {selectedChartData.map((data, idx) => {
                const heightPercentage = (data.val / upperYLimit) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group h-full justify-end px-1.5 sm:px-3"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 transition-all duration-200 bg-luxury-blue-950 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold shadow-md z-20 pointer-events-none border border-luxury-blue-800">
                      {activeTab === "occupancy"
                        ? `${data.val}%`
                        : `$${data.val}`}
                    </div>
                    {/* Glowing bar item */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: idx * 0.05,
                      }}
                      className={`w-full rounded-t-lg shadow-sm transition-all ${
                        activeTab === "occupancy"
                          ? "bg-gradient-to-t from-gold-600 to-gold-400 group-hover:shadow-gold/30"
                          : "bg-gradient-to-t from-blue-600 to-blue-400 group-hover:shadow-blue-500/30"
                      } group-hover:brightness-105`}
                    />
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-wider">
                      {data.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time database updates timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold stroke-[2]" />
              Latest Updates
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Real-time status changes and activities
            </p>
          </div>

          <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
            {timeline.length > 0 ? (
              timeline.map((item) => {
                const colorMarker =
                  item.type === "booking" ? "bg-emerald-500" : "bg-gold";
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 relative"
                  >
                    <div
                      className={`w-4 h-4 ${colorMarker} rounded-full border-4 border-white flex-shrink-0 z-10 shadow-sm mt-1`}
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-[10px] font-semibold text-gray-400 block mt-1">
                        {item.timeLabel}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-gray-400 italic">
                No operational logs found in database.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid for Arrivals & Departures Today lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arrivals Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              Arrivals Scheduled Today
            </h3>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
              {arrivals} Expected
            </span>
          </div>

          <div className="space-y-2.5">
            {activeBookings.filter(
              (b) => b.checkIn === today && b.status !== "Cancelled",
            ).length > 0 ? (
              bookings
                .filter((b) => b.checkIn === today && b.status !== "Cancelled")
                .slice(0, 4)
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {booking.firstName} {booking.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Room Type: {booking.roomType || "Standard"} • Check-out:{" "}
                        {booking.checkOut}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100/50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200/30">
                      Confirmed
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                No arrivals scheduled for today.
              </div>
            )}
          </div>
        </div>

        {/* Departures Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              Departures Scheduled Today
            </h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
              {departures} Expected
            </span>
          </div>

          <div className="space-y-2.5">
            {activeBookings.filter(
              (b) => b.checkOut === today && b.status !== "Cancelled",
            ).length > 0 ? (
              bookings
                .filter((b) => b.checkOut === today && b.status !== "Cancelled")
                .slice(0, 4)
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {booking.firstName} {booking.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Room Type: {booking.roomType || "Standard"} • Check-in:{" "}
                        {booking.checkIn}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100/50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200/30">
                      Check-out
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                No departures scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800">
              Recent Guest Reservations
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Review recent booking confirmations and statuses
            </p>
          </div>
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center gap-1 text-xs text-gold hover:text-gold-700 font-bold transition-all"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="text-left py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Guest Name
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Room Type
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Check In Date
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Booked Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length > 0 ? (
                bookings
                  .sort(
                    (a, b) =>
                      new Date(b.checkIn).getTime() -
                      new Date(a.checkIn).getTime(),
                  )
                  .slice(0, 5)
                  .map((booking) => {
                    const ts = getTimestampFromId(booking._id);
                    return (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-55/20 transition-colors"
                      >
                        <td className="py-4 px-6 text-xs font-bold text-gray-800">
                          #{booking._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-gray-700">
                          {booking.firstName} {booking.lastName}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 font-semibold">
                          {booking.roomType || "Standard Room"}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 font-semibold">
                          {booking.checkIn}
                        </td>
                        <td className="py-4 px-6 text-xs">
                          <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold border border-gray-200/50">
                            {timeAgo(ts)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 py-10 text-xs italic"
                  >
                    No reservations found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
