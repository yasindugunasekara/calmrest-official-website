import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Trash2, Calendar, Mail, User, Layers, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequest?: string;
  status?: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<Booking | null>(null);

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>(`${API_BASE_URL}/bookings`);
        const dataWithStatus = response.data.map((b) => ({
          ...b,
          status: b.status || "Confirmed", // Default to Confirmed if none provided
        }));
        setBookings(dataWithStatus);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const confirmDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/bookings/${selectedBooking._id}`);
      if (response.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      } else {
        alert(response.data.error || "Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setSelectedBooking(null);
    }
  };

  // Compute unique room types for filters
  const roomTypes = ["All", ...Array.from(new Set(bookings.map((b) => b.roomType || "Standard")))];

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const fullName = `${b.firstName} ${b.lastName}`.toLowerCase();
    const searchMatch = fullName.includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase()) || b._id.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = roomTypeFilter === "All" || (b.roomType || "Standard") === roomTypeFilter;
    return searchMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Guest Reservations</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage Calm Rest hotel bookings, arrivals, and departures.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white text-xs focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600">
            <Layers className="w-3.5 h-3.5 text-gold" />
            <span className="font-semibold">Room Type:</span>
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="bg-transparent font-bold outline-none border-none cursor-pointer text-gray-800"
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Guest</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Room Type</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Dates</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-xs font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      Loading booking records...
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  // Determine beautiful status colors
                  const statusColors = {
                    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
                    Pending: "bg-amber-50 text-amber-700 border-amber-100",
                    Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
                  };
                  const colorClass = statusColors[b.status as keyof typeof statusColors] || "bg-gray-50 text-gray-700 border-gray-100";

                  return (
                    <tr
                      key={b._id}
                      onClick={() => setSelectedDetailsBooking(b)}
                      className="hover:bg-gray-50/30 transition-colors cursor-pointer"
                    >
                      {/* ID */}
                      <td className="py-4 px-6 text-xs font-bold text-gray-800">
                        #{b._id.slice(-6).toUpperCase()}
                      </td>

                      {/* Guest Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-700 font-bold text-[11px]">
                            {b.firstName[0]}
                            {b.lastName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">
                              {b.firstName} {b.lastName}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {b.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Room Type */}
                      <td className="py-4 px-6 text-xs text-gray-600 font-semibold">
                        {b.roomType}
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-6">
                        <div className="text-[11px] font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gold-500" />
                          <span>
                            {b.checkIn} <span className="text-gray-400 font-normal">to</span> {b.checkOut}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td
                        className="py-4 px-6"
                        onClick={async (e) => {
                          if (b.status !== "Confirmed") {
                            e.stopPropagation(); // Prevent opening modal
                            try {
                              const res = await axios.put(`${API_BASE_URL}/bookings/${b._id}`, {
                                status: "Confirmed"
                              });
                              if (res.data.success) {
                                const updated = res.data.booking;
                                setBookings(prev => prev.map(item => item._id === updated._id ? updated : item));
                              }
                            } catch (err) {
                              console.error("Failed to confirm booking:", err);
                              alert("Could not update reservation status. Please try again.");
                            }
                          }
                        }}
                      >
                        <span
                          className={`inline-flex px-2 py-0.5 border text-[10px] font-bold rounded-lg transition-colors ${
                            b.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100 cursor-pointer"
                          }`}
                          title={b.status !== "Confirmed" ? "Click to confirm booking directly" : "Confirmed"}
                        >
                          {b.status === "Confirmed" ? "Confirmed" : "Not Confirmed"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => confirmDelete(b)}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition-all"
                          title="Remove Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-xs italic">
                    No bookings found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal with AnimatePresence */}
      <AnimatePresence>
        {showDeleteModal && selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-2">Cancel Reservation?</h2>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Are you sure you want to delete the reservation of <strong className="text-gray-800 font-semibold">{selectedBooking.firstName} {selectedBooking.lastName}</strong>? This action cannot be reversed.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/10"
                  onClick={handleDelete}
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedDetailsBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gray-100 shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 text-left">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-gray-800">Reservation Details</h3>
                    <span className={`inline-flex px-2 py-0.5 border text-[9px] font-bold rounded-lg ${
                      selectedDetailsBooking.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}>
                      {selectedDetailsBooking.status === "Confirmed" ? "Confirmed" : "Not Confirmed"}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">ID: #{selectedDetailsBooking._id.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => setSelectedDetailsBooking(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-850 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guest Name</span>
                  <p className="text-xs font-bold text-gray-800 mt-1">
                    {selectedDetailsBooking.firstName} {selectedDetailsBooking.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                  <p className="text-xs font-semibold text-gray-700 mt-1 break-all">
                    {selectedDetailsBooking.email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Check-in Date</span>
                  <p className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {selectedDetailsBooking.checkIn}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Check-out Date</span>
                  <p className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {selectedDetailsBooking.checkOut}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Room Category</span>
                  <p className="text-xs font-bold text-gray-800 mt-1">
                    {selectedDetailsBooking.roomType}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guests Count</span>
                  <p className="text-xs font-bold text-gray-850 mt-1">
                    {selectedDetailsBooking.guests} {selectedDetailsBooking.guests > 1 ? 'Guests' : 'Guest'}
                  </p>
                </div>
                
                {/* Special Request */}
                <div className="col-span-2 mt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-semibold">Special Requests / Notes</span>
                  <div className="bg-gray-50 border border-gray-200/50 p-3.5 rounded-xl text-xs text-gray-600 font-medium leading-relaxed italic min-h-[4rem]">
                    {selectedDetailsBooking.specialRequest || "No special requests or specifications provided."}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-250 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedDetailsBooking(null)}
                >
                  Close
                </button>
                
                {selectedDetailsBooking.status !== "Confirmed" && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await axios.put(`${API_BASE_URL}/bookings/${selectedDetailsBooking._id}`, {
                          status: "Confirmed"
                        });
                        if (res.data.success) {
                          const updated = res.data.booking;
                          // Update active local details state
                          setSelectedDetailsBooking(updated);
                          // Update list state
                          setBookings(prev => prev.map(b => b._id === updated._id ? updated : b));
                        }
                      } catch (err) {
                        console.error("Failed to confirm booking:", err);
                        alert("Could not update reservation status. Please try again.");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                  >
                    Confirm Booking
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const mailtoSubject = encodeURIComponent(`Reservation Details - Calm Rest Hotel [#${selectedDetailsBooking._id.slice(-6).toUpperCase()}]`);
                    const mailtoBody = encodeURIComponent(`Dear ${selectedDetailsBooking.firstName} ${selectedDetailsBooking.lastName},\n\nWe are writing to confirm your reservation details for your upcoming stay from ${selectedDetailsBooking.checkIn} to ${selectedDetailsBooking.checkOut}.\n\nReservation ID: #${selectedDetailsBooking._id.toUpperCase()}\nRoom Category: ${selectedDetailsBooking.roomType}\nNumber of Guests: ${selectedDetailsBooking.guests}\nSpecial Request: ${selectedDetailsBooking.specialRequest || "None"}\n\nPlease let us know if you need any additional concierge bookings.\n\nWarm regards,\nCalm Rest Concierge`);
                    window.location.href = `mailto:${selectedDetailsBooking.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gold hover:bg-gold-600 rounded-xl transition-all shadow-lg shadow-gold/15"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Mail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
