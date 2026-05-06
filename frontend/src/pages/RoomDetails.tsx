import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bath, Wifi, Car, Lock, ConciergeBell, Luggage } from "lucide-react";
import { trackEcommerceEvent, trackEvent } from "../utils/analytics";

type Feature = {
  name: string;
  icon: string;
};

type Room = {
  _id: string;
  name: string;
  size: string;
  description: string;
  image: string;
  bed: string;
  price: number;
  discountPrice?: number;
  amenities: string[];
  features: Feature[];
  images?: string[];
};

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);


  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/${id}`);
        const data = await res.json();
        setRoom(data);

        // Track GA4 Ecommerce View Item
        trackEcommerceEvent("view_item", [data], {
          currency: "USD",
          value: data.price,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!room) return <div className="text-center mt-10 text-red-500">Room not found</div>;

  const images =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images
      : [room.image ?? "https://via.placeholder.com/800x600?text=No+Image"];

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white overflow-hidden flex flex-col md:flex-row pt-3 pb-10 mt-6">
      {/* Left - Image Carousel */}
      <div className="relative w-full md:w-1/2 h-auto">
      {/* Image Carousel */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              className="block w-full h-full object-cover rounded-lg cursor-pointer"
              alt={`Room ${index + 1}`}
              onClick={() => setIsFullscreen(true)}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white rtl:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </span>
      </button>

      <button
        onClick={nextSlide}
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </span>
      </button>

      {/* Fullscreen Popup */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <img
            src={images[activeIndex]}
            alt="Fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full"
          >
            ✕ Close
          </button>

          {/* Optional: Navigation inside fullscreen */}
          <button
            onClick={prevSlide}
            className="absolute left-5 text-white text-3xl font-bold"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 text-white text-3xl font-bold"
          >
            ›
          </button>
        </div>
      )}
    </div>
      {/* Right - Details Section */}
      <div className="p-6 md:p-8 flex flex-col justify-between w-full">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{room.name}</h2>
          <p className="text-gray-500 mb-2">{room.size} m²</p>
          <p className="text-gray-700 mb-4">{room.description}</p>

          {/* Room Amenities */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Room Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-600">
              {room.amenities.map((amenity, index) => {
                let icon;
                switch (amenity.toLowerCase()) {
                  case "wifi":
                    icon = <Wifi size={18} className="mr-1" />;
                    break;
                  case "bathroom":
                    icon = <Bath size={18} className="mr-1" />;
                    break;
                  case "parking":
                    icon = <Car size={18} className="mr-1" />;
                    break;
                  case "security":
                    icon = <Lock size={18} className="mr-1" />;
                    break;
                  case "service":
                    icon = <ConciergeBell size={18} className="mr-1" />;
                    break;
                  case "luggage":
                    icon = <Luggage size={18} className="mr-1" />;
                    break;
                  default:
                    icon = null;
                }
                return (
                  <div key={index} className="flex items-center py-1">
                    {icon}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bed Type */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{room.bed}</h3>
          </div>

          {/* Cancellation Rules */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Cancellation Rules</h3>
            <p className="text-gray-600 text-sm">
              Free cancellation until{" "}
              <span className="text-green-600 font-medium">
                {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" })}
              </span>
              . After{" "}
              <span className="text-red-600 font-medium">
                {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
              , no refund.
            </p>
          </div>
        </div>

        {/* Pricing + Button */}
        <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-lg">
            {room.discountPrice ? (
              <>
                <span className="line-through text-gray-500 mr-2">${room.price}</span>
                <span className="text-yellow-500 font-bold text-xl md:text-2xl">
                  ${room.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-yellow-500 font-bold text-xl md:text-2xl">
                ${room.price}
              </span>
            )}
            <span className="text-gray-500 text-sm"> / 1 nights</span>
          </div>
          {/* Back button */}
        <button
          className="bg-black text-white px-5 md:px-6 py-2 md:py-3 rounded-lg hover:bg-black/80 transition-all w-full sm:w-auto text-center "
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
          <button
            className="bg-gold text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-gold/80 transition-all w-full sm:w-auto text-center"
            onClick={() => {
              trackEvent("cta_click", { button_name: "Room Details Book", room_name: room.name });
              navigate("/login");
            }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
