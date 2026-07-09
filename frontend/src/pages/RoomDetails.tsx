import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bath,
  Wifi,
  Car,
  Lock,
  ConciergeBell,
  Luggage,
  Bed,
  Users,
  Maximize,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Check,
  Wind,
  Coffee,
  Utensils,
  Waves,
  Star,
  Tv,
  Sparkles,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
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
  category?: string;
  rating?: number;
};

const getAmenityIcon = (amenity: string) => {
  const name = amenity.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (name.includes("wifi") || name.includes("internet")) {
    return <Wifi size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("bath") || name.includes("hotwater") || name.includes("water") || name.includes("shower") || name.includes("restroom")) {
    return <Bath size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("parking") || name.includes("car")) {
    return <Car size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("security") || name.includes("lock") || name.includes("safe")) {
    return <Lock size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("service") || name.includes("bell") || name.includes("concierge") || name.includes("roomservice")) {
    return <ConciergeBell size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("luggage") || name.includes("bag")) {
    return <Luggage size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("aircon") || name.includes("ac") || name.includes("cooling") || name.includes("fan") || name.includes("vent")) {
    return <Wind size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("tv") || name.includes("television") || name.includes("cable")) {
    return <Tv size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("coffee") || name.includes("tea") || name.includes("kettle") || name.includes("drink")) {
    return <Coffee size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("breakfast") || name.includes("kitchen") || name.includes("utensil") || name.includes("dining") || name.includes("food")) {
    return <Utensils size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("pool") || name.includes("swim") || name.includes("wave") || name.includes("spa")) {
    return <Waves size={18} className="text-gold flex-shrink-0" />;
  }
  if (name.includes("gym") || name.includes("fitness") || name.includes("workout")) {
    return <Dumbbell size={18} className="text-gold flex-shrink-0" />;
  }
  return <Check size={18} className="text-gold flex-shrink-0" />;
};

const featureIconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={18} className="text-gold flex-shrink-0" />,
  Car: <Car size={18} className="text-gold flex-shrink-0" />,
  Coffee: <Coffee size={18} className="text-gold flex-shrink-0" />,
  Dumbbell: <Dumbbell size={18} className="text-gold flex-shrink-0" />,
  Utensils: <Utensils size={18} className="text-gold flex-shrink-0" />,
  Waves: <Waves size={18} className="text-gold flex-shrink-0" />,
  Star: <Star size={18} className="text-gold flex-shrink-0" />,
  Bed: <Bed size={18} className="text-gold flex-shrink-0" />,
  Users: <Users size={18} className="text-gold flex-shrink-0" />,
  Bath: <Bath size={18} className="text-gold flex-shrink-0" />,
  Tv: <Tv size={18} className="text-gold flex-shrink-0" />,
  Wind: <Wind size={18} className="text-gold flex-shrink-0" />,
  AirConditioning: <Wind size={18} className="text-gold flex-shrink-0" />,
  Shield: <Lock size={18} className="text-gold flex-shrink-0" />,
  Wine: <Sparkles size={18} className="text-gold flex-shrink-0" />,
  Phone: <Sparkles size={18} className="text-gold flex-shrink-0" />,
  Sparkles: <Sparkles size={18} className="text-gold flex-shrink-0" />,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy font-semibold text-sm">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-md p-8 max-w-sm">
          <p className="text-red-500 font-semibold mb-4">Room details could not be found.</p>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-navy text-white px-6 py-2.5 rounded-lg hover:bg-gold transition-colors font-medium text-sm"
          >
            Go back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const images =
    Array.isArray(room.images) && room.images.length > 0
      ? room.images
      : [room.image ?? "https://via.placeholder.com/800x600?text=No+Image"];

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28 lg:pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-navy hover:text-gold transition-colors duration-300 font-medium mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Rooms</span>
        </button>

        {/* Desktop Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Media & Room details (Span 2) */}
          <div className="lg:col-span-2 space-y-8 bg-white rounded-2xl border-0 md:border border-gray-100 p-6 md:p-8 shadow-sm">
            
            {/* Gallery Section */}
            <div>
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-md group/gallery bg-gray-900">
                {images[activeIndex] && !images[activeIndex].includes("placehold") && !images[activeIndex].includes("placeholder") ? (
                  <>
                    <img
                      src={images[activeIndex]}
                      className="w-full h-full object-cover transition-all duration-700 select-none cursor-pointer"
                      alt={`${room.name} view`}
                      onClick={() => setIsFullscreen(true)}
                    />
                    {/* Fullscreen icon button */}
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute bottom-4 right-4 z-10 p-2.5 rounded-lg bg-navy/60 backdrop-blur-sm hover:bg-navy/85 text-white shadow-sm flex items-center justify-center transition-all"
                      title="Fullscreen preview"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-[#efe6dc] via-[#dcd0c0] to-[#bcaea0] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-[#45392e] tracking-wide select-none text-center px-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                      Calm Rest Suite
                    </span>
                  </div>
                )}
                
                {/* Arrow Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails list */}
              {images.length > 1 && (
                <div className="flex space-x-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        index === activeIndex
                          ? "border-gold scale-95 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs uppercase bg-cream text-gold px-3.5 py-1 rounded-full font-bold tracking-wider">
                  {room.category || "Luxury Accommodation"}
                </span>
                <div className="flex items-center space-x-1 text-gold">
                  <Star fill="currentColor" size={14} />
                  <span className="text-sm font-bold text-navy">{room.rating || 5.0}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-navy font-serif tracking-wide mb-4">
                {room.name}
              </h1>

              {/* Quick specifications bar */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-5 my-6 text-gray-600">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left">
                  <Bed className="text-gold w-5 h-5 mb-1 sm:mb-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bed Type</span>
                    <span className="text-sm font-semibold text-navy">{room.bed}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left border-l border-r border-gray-100 px-2">
                  <Users className="text-gold w-5 h-5 mb-1 sm:mb-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capacity</span>
                    <span className="text-sm font-semibold text-navy">{room.guests} Guests</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left">
                  <Maximize className="text-gold w-5 h-5 mb-1 sm:mb-0" />
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Room Size</span>
                    <span className="text-sm font-semibold text-navy">{room.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-navy font-serif tracking-wider uppercase">
                Room Description
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Features (if present) */}
            {Array.isArray(room.features) && room.features.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <h3 className="text-lg font-bold text-navy font-serif tracking-wider uppercase">
                  Premium Features
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {room.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-sm bg-cream/50 text-navy px-3 py-1.5 rounded-lg border border-gold/10 hover:border-gold/30 transition-all duration-300"
                    >
                      {featureIconMap[feature.icon] || <Sparkles size={18} className="text-gold" />}
                      <span className="font-semibold text-gray-700 text-xs sm:text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Amenities Grid */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-lg font-bold text-navy font-serif tracking-wider uppercase">
                Included Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-all text-sm"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="font-medium text-gray-700 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation rules trust box */}
            <div className="bg-green-50/50 border border-green-200/60 rounded-2xl p-5 mt-6 flex items-start space-x-3.5 shadow-inner">
              <ShieldCheck className="text-green-600 w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 text-sm sm:text-base">Free Cancellation Policies</h4>
                <p className="text-green-800 text-xs sm:text-sm mt-1 leading-relaxed">
                  Enjoy complete flexibility. Cancel for free until{" "}
                  <span className="font-semibold">
                    {new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" })}
                  </span>
                  . After{" "}
                  <span className="font-semibold">
                    {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  , cancellation will be non-refundable.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Pricing/Booking widget */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-2xl border-0 md:border border-gray-100 shadow-lg p-6 md:p-8 space-y-6">
              
              {/* Card Header Title */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-serif font-bold text-navy">Reserve Accommodation</h3>
                <p className="text-gray-400 text-xs mt-0.5">Quick secure reservation</p>
              </div>

              {/* Pricing Section */}
              <div>
                <span className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider font-bold">Price Details</span>
                <div className="flex items-baseline">
                  {room.discountPrice ? (
                    <>
                      <span className="text-3xl sm:text-4.5xl font-serif font-bold text-gold mr-2.5">
                        ${room.discountPrice}
                      </span>
                      <span className="line-through text-gray-400 text-lg">
                        ${room.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl sm:text-4.5xl font-serif font-bold text-gold">
                      ${room.price}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm ml-1.5 font-medium">/ night</span>
                </div>
              </div>

              {/* Core CTA Button */}
              <button
                className="w-full bg-gold hover:bg-opacity-95 text-white py-4 rounded-xl transition-all duration-300 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md shadow-gold/25 hover:-translate-y-0.5 focus:outline-none"
                onClick={() => {
                  trackEvent("cta_click", { button_name: "Room Details Book", room_name: room.name });
                  navigate("/login");
                }}
              >
                Book Your Stay
              </button>

              {/* Benefits checklist */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-center space-x-2.5 text-gray-600">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>Free high-speed WiFi included</span>
                </div>
                <div className="flex items-center space-x-2.5 text-gray-600">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>Best price guaranteed</span>
                </div>
                <div className="flex items-center space-x-2.5 text-gray-600">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>Zero booking or credit card fees</span>
                </div>
              </div>

              {/* Schedule time check details */}
              <div className="pt-5 border-t border-gray-100 flex items-center justify-center space-x-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                <Clock size={14} className="text-gold flex-shrink-0" />
                <span>Check-in: 2PM | Check-out: 12PM</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center justify-between z-40 lg:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
        <div>
          <span className="text-gray-400 text-[10px] block uppercase tracking-wider font-bold">Nightly Rate</span>
          <div className="flex items-baseline">
            <span className="text-2xl font-serif font-bold text-gold">
              ${room.discountPrice ?? room.price}
            </span>
            <span className="text-gray-500 text-xs ml-1">/ night</span>
          </div>
        </div>
        
        <button
          className="bg-gold text-white px-8 py-3 rounded-xl hover:bg-opacity-95 font-bold text-sm shadow-md active:scale-95 transition-transform"
          onClick={() => {
            trackEvent("cta_click", { button_name: "Room Details Book Mobile", room_name: room.name });
            navigate("/login");
          }}
        >
          Book Now
        </button>
      </div>

      {/* Fullscreen Gallery Modal popup */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4 animate-fade-in">
          <img
            src={images[activeIndex]}
            alt="Fullscreen Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/25 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl font-light font-serif p-4 transition-all duration-300"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl font-light font-serif p-4 transition-all duration-300"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default RoomDetails;
