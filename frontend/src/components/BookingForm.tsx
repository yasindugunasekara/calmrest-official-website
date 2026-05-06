import React, { useState, useEffect } from "react";
import { trackEcommerceEvent } from "../utils/analytics";

interface Room {
  _id: string;
  name: string;
  price: number;
}

const BookingForm: React.FC = () => {
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
  const [totalPrice, setTotalPrice] = useState(0);

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

  // Update pricePerNight when roomType changes
  useEffect(() => {
    const selectedRoom = rooms.find((room) => room.name === roomType);
    setPricePerNight(selectedRoom ? selectedRoom.price : 0);
  }, [roomType, rooms]);

  // Calculate total price when dates or pricePerNight change
  useEffect(() => {
    if (checkIn && checkOut && pricePerNight > 0) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const nights = diffTime / (1000 * 60 * 60 * 24);

      setTotalPrice(nights > 0 ? nights * pricePerNight : 0);
    } else {
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
      } else {
        alert("Failed to submit booking: " + data.error);
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleBookingSubmit}
      className="bg-white p-8 rounded shadow-xl w-full max-w-screen-lg mx-auto"
    >
      <h3 className="text-2xl font-semibold mb-8 text-center">Book Your Stay</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

            <div>
            <label className="block mb-2">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
              min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
            />
            </div>

            <div>
            <label className="block mb-2">Check-out</label>
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
              className="w-full border px-4 py-2 rounded"
              min={checkIn || ""}
            />
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
              className="w-full border px-4 py-2 rounded"
            >
              {rooms.map((room) => (
                <option key={room._id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border px-4 py-2 rounded"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Special Requests</label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              rows={5}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Late check-in, extra bed..."
            />
          </div>

          {/* Price Display */}
          
        </div>
      </div>

      <div className="mt-8">
        <div className="p-4 bg-gray-100 rounded border">

            <h4 className="text-lg font-semibold mb-4">Booking Summary</h4>
            
            <div className="bg-blue-50 p-4 rounded shadow-md">
            <p className="text-gray-800 text-lg">
              <strong>Room Type:</strong> <span className="text-blue-600">{roomType}</span>
            </p>
            <p className="text-gray-800 text-lg mt-2">
              <strong>Check-in:</strong> <span className="text-blue-600">{checkIn}</span>
              <br />
              <strong>Check-out:</strong> <span className="text-blue-600">{checkOut}</span>
            </p>
            <p className="text-gray-800 text-lg mt-2">
              <strong>Price per night:</strong> <span className="text-green-600">${pricePerNight || 0}</span>
            </p>
            <p className="text-gray-800 text-lg mt-2">
              <strong>Total Price:</strong>{" "}
              <span className={`font-bold ${totalPrice > 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPrice > 0 ? `$${totalPrice}` : "Not available"}
              </span>
            </p>
            </div>
          </div>
          <br />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
        >
          Book Now
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
