import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Users,
  Home,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Clock,
  Lock,
  ChevronDown
} from "lucide-react";
import { trackEcommerceEvent } from "../utils/analytics";

interface Room {
  _id: string;
  name: string;
  price: number;
  guests: number;
}

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pricePerNight, setPricePerNight] = useState(0);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);

  useEffect(() => {
    const handleCloseDropdowns = () => {
      setIsGuestsOpen(false);
      setIsRoomTypeOpen(false);
    };
    window.addEventListener("click", handleCloseDropdowns);
    return () => window.removeEventListener("click", handleCloseDropdowns);
  }, []);

  const toggleGuestsDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRoomTypeOpen(false);
    setIsGuestsOpen(!isGuestsOpen);
  };

  const toggleRoomTypeDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGuestsOpen(false);
    setIsRoomTypeOpen(!isRoomTypeOpen);
  };

  const selectGuestOption = (num: number) => {
    setGuests(num);
    setIsGuestsOpen(false);
  };

  const selectRoomTypeOption = (name: string) => {
    setRoomType(name);
    setIsRoomTypeOpen(false);
  };

  // Fetch room categories + prices
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`);
        const data: Room[] = await res.json();
        setRooms(data);

        if (data.length > 0) {
          setRoomType(data[0].name);
          setPricePerNight(data[0].price);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // Update pricePerNight and clamp guests when roomType changes
  useEffect(() => {
    const selectedRoom = rooms.find((room) => room.name === roomType);
    if (selectedRoom) {
      setPricePerNight(selectedRoom.price);
      if (guests > selectedRoom.guests) {
        setGuests(selectedRoom.guests);
      }
    } else {
      setPricePerNight(0);
    }
  }, [roomType, rooms, guests]);

  // Calculate total price & nights when dates or pricePerNight change
  useEffect(() => {
    if (checkIn && checkOut && pricePerNight > 0) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const n = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNights(n > 0 ? n : 0);
      setTotalPrice(n > 0 ? n * pricePerNight : 0);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, pricePerNight]);

  // Submit booking form
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRoom = rooms.find((r) => r.name === roomType);
    trackEcommerceEvent("begin_checkout", selectedRoom ? [selectedRoom] : [], {
      value: totalPrice,
      currency: "USD",
    });

    const bookingData = {
      firstName,
      lastName,
      email,
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequest,
      totalPrice, // store calculated price
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (data.success) {
        trackEcommerceEvent("purchase", selectedRoom ? [selectedRoom] : [], {
          transaction_id: data.bookingId || "temp_id_" + Date.now(),
          value: totalPrice,
          currency: "USD",
        });
        alert("Booking submitted successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setCheckIn("");
        setCheckOut("");
        setGuests(2);
        setRoomType(rooms[0]?.name || "");
        setSpecialRequest("");
        setTotalPrice(0);
        navigate(-1);
      } else {
        alert("Failed to submit booking: " + data.error);
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const selectedRoom = rooms.find((room) => room.name === roomType);
  const maxGuests = selectedRoom ? selectedRoom.guests : 8;
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  return (
    <form
      onSubmit={handleBookingSubmit}
      className="w-full max-w-6xl mx-auto py-4 px-2"
    >
      {/* Form Header */}
      <div className="text-center mb-5">
        <h3 className="text-2xl sm:text-3xl font-bold text-navy font-serif tracking-wide">Book Your Luxury Stay</h3>
        <p className="text-gray-500 mt-1 text-sm">Experience tranquility and five-star luxury at Calm Rest</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Inputs Grid (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3">
              <span className="text-gold"><User size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3">
              <span className="text-gold"><User size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Guests selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3">
              <span className="text-gold"><Mail size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                  className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>

            <div 
              onClick={toggleGuestsDropdown}
              className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3 pr-9 cursor-pointer select-none"
            >
              <span className="text-gold"><Users size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Guests</label>
                <div className="text-navy font-semibold text-sm sm:text-base">
                  {guests} Guest{guests > 1 ? "s" : ""}
                </div>
              </div>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold transition-transform duration-300">
                <ChevronDown size={16} className={`transition-transform duration-300 ${isGuestsOpen ? "rotate-180" : ""}`} />
              </span>

              {/* Dropdown Options Popup */}
              {isGuestsOpen && (
                <div 
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gold/15 shadow-xl rounded-xl py-1 z-50 max-h-48 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {guestOptions.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => selectGuestOption(num)}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-cream hover:text-gold transition-colors duration-200 ${
                        guests === num ? "bg-cream/40 text-gold font-bold" : "text-navy font-medium"
                      }`}
                    >
                      {num} Guest{num > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Check-in & Check-out dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3">
              <span className="text-gold"><Calendar size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-sm sm:text-base cursor-pointer"
                />
              </div>
            </div>

            <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3">
              <span className="text-gold"><Calendar size={18} /></span>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    if (checkIn && new Date(selectedDate) <= new Date(checkIn)) {
                      alert("Check-out date must be after the check-in date.");
                    } else {
                      setCheckOut(selectedDate);
                    }
                  }}
                  required
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-sm sm:text-base cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Room Type selection */}
          <div 
            onClick={toggleRoomTypeDropdown}
            className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-center space-x-3 pr-9 cursor-pointer select-none"
          >
            <span className="text-gold"><Home size={18} /></span>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Select Room Category</label>
              <div className="text-navy font-semibold text-sm sm:text-base truncate">
                {roomType || "Select a category"}
              </div>
            </div>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold transition-transform duration-300">
              <ChevronDown size={16} className={`transition-transform duration-300 ${isRoomTypeOpen ? "rotate-180" : ""}`} />
            </span>

            {/* Dropdown Options Popup */}
            {isRoomTypeOpen && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-gold/15 shadow-xl rounded-xl py-1 z-50 max-h-48 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {rooms.map((room) => (
                  <button
                    key={room._id}
                    type="button"
                    onClick={() => selectRoomTypeOption(room.name)}
                    className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-cream hover:text-gold transition-colors duration-200 ${
                      roomType === room.name ? "bg-cream/40 text-gold font-bold" : "text-navy font-medium"
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: Special Requests */}
          <div className="relative rounded-xl border border-gray-200 transition-all duration-300 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 bg-white px-4 py-1.5 flex items-start space-x-3">
            <span className="text-gold mt-1"><MessageSquare size={18} /></span>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Special Requests</label>
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                rows={2}
                placeholder="e.g., Late check-in, extra pillows, airport shuttle..."
                className="w-full text-navy font-semibold bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder-gray-300 text-sm sm:text-base resize-none h-14"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Booking Summary Sidebar (Span 1) */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 self-start">
          <div className="bg-cream/40 border border-gold/15 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Summary Header */}
              <div className="border-b border-gray-200/60 pb-3">
                <h4 className="text-lg font-serif font-bold text-navy">Reservation Summary</h4>
                <p className="text-gray-400 text-xs mt-0.5">Summary of your package</p>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                {/* Room Info */}
                <div className="flex items-start space-x-3">
                  <Home size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Accommodation</span>
                    <span className="text-sm font-semibold text-navy">{roomType || "No room selected"}</span>
                  </div>
                </div>

                {/* Date Grid */}
                <div className="flex items-center justify-between text-sm text-navy bg-white border border-gray-100 p-3.5 rounded-xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Check-in</span>
                    <span className="font-semibold text-xs sm:text-sm">{checkIn || "Select date"}</span>
                  </div>
                  <ArrowRight size={16} className="text-gold mx-2" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Check-out</span>
                    <span className="font-semibold text-xs sm:text-sm">{checkOut || "Select date"}</span>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 border-t border-gray-200/60 pt-3.5 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Nightly Rate</span>
                  <span className="font-semibold text-navy">${pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights Duration</span>
                  <span className="font-semibold text-navy">{nights} night{nights !== 1 ? "s" : ""}</span>
                </div>

                {/* Grand Total */}
                <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between items-baseline">
                  <span className="text-navy font-bold text-sm sm:text-base">Grand Total</span>
                  <span className={`text-xl sm:text-2xl font-bold font-serif ${totalPrice > 0 ? "text-gold" : "text-red-500"}`}>
                    {totalPrice > 0 ? `$${totalPrice}` : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Form CTA Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gold hover:bg-opacity-95 text-white py-3 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md shadow-gold/25 mt-4 hover:-translate-y-0.5 focus:outline-none flex items-center justify-center space-x-2"
              >
                <span>Confirm Booking</span>
              </button>

              {/* Secure Booking Notice */}
              <div className="mt-3 flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                <Lock size={12} className="text-gold" />
                <span>Secure reservation with Calm Rest</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
};

export default BookingForm;
