import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Bed,
  Users,
  Bath,
  Maximize,
  Shield,
  Wine,
  Tv,
  Wind,
  Coffee,
  Utensils,
  Waves,
  Car,
  Sparkles,
  Phone,
  ParkingCircle,
  Wifi,
  Dumbbell
} from "lucide-react";
import { useSectionTracking } from "../hooks/useSectionTracking";
import { trackEvent, trackEcommerceEvent } from "../utils/analytics";

const iconMap: Record<string, React.ReactNode> = {
  Wifi: <Wifi size={16} />,
  Car: <Car size={16} />,
  Coffee: <Coffee size={16} />,
  Dumbbell: <Dumbbell size={16} />,
  Utensils: <Utensils size={16} />,
  Waves: <Waves size={16} />,
  ParkingCircle: <ParkingCircle size={16} />,
  Parking: <Car size={16} />,
  Star: <Star size={16} />,
  Bed: <Bed size={16} />,
  Users: <Users size={16} />,
  Bath: <Bath size={16} />,
  Tv: <Tv size={16} />,
  Wind: <Wind size={16} />,
  AirConditioning: <Wind size={16} />,
  Shield: <Shield size={16} />,
  Wine: <Wine size={16} />,
  Phone: <Phone size={16} />,
  Sparkles: <Sparkles size={16} />,
  ConciergeBell: <Sparkles size={16} />,
  Luggage: <Sparkles size={16} />,
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Section Tracking
  const filterRef = useSectionTracking('Room Categories Filter');
  const roomGridRef = useSectionTracking('Rooms Grid');

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("roomsScrollPosition");
    if (savedScroll) {
      window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "instant" as any });
      sessionStorage.removeItem("roomsScrollPosition");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ✅ Fetch rooms from backend API
    fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);

        // Track GA4 Ecommerce View Item List
        trackEcommerceEvent('view_item_list', data, {
          item_list_name: 'Main Rooms Page'
        });

        // Generate categories dynamically from DB
        const uniqueCategories = [
          { id: "all", name: "All" },
          ...Array.from(new Set(data.map((room) => room.category))).map((cat) => ({
            id: cat,
            name: cat,
          })),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  const handleCardClick = (roomId: string) => {
    sessionStorage.setItem("roomsScrollPosition", window.scrollY.toString());
    navigate(`/rooms/${roomId}`);
  };

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    trackEvent('filter_rooms', { category_name: categoryName });
  };

  const filteredRooms =
    selectedCategory === "all"
      ? rooms
      : rooms.filter((room) => room.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-96 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dcgfwnzzr/image/upload/v1767077294/DSC02258_yg85iy.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-navy bg-opacity-70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
            Rooms & Suites
          </h1>
          <p className="text-xl text-white/90">
            Discover luxury accommodations tailored to your needs
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section ref={filterRef as any} className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id, category.name)}
              className={`px-6 py-3 rounded font-medium transition-all duration-300 relative ${
                selectedCategory === category.id
                  ? "text-gold"
                  : "bg-white text-navy hover:text-gold"
              }`}
            >
              {category.name}
              {selectedCategory === category.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Rooms Grid */}
      <section ref={roomGridRef as any} className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleCardClick(room._id)}
              className="snap-start scroll-mt-24 bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl hover:border-gold/30 border border-transparent cursor-pointer transition-all duration-500 flex flex-col justify-between"
            >
              {/* Room Card Image */}
              <div className="relative overflow-hidden">
                {((room.images && room.images.length > 0 && !room.images[0].includes("placehold") && !room.images[0].includes("placeholder")) || (room.image && !room.image.includes("placehold") && !room.image.includes("placeholder"))) ? (
                  <img
                    src={room.images && room.images.length > 0 ? room.images[0] : room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-b from-[#efe6dc] via-[#dcd0c0] to-[#bcaea0] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
                    <span className="text-3xl font-serif font-bold text-[#45392e] tracking-wide select-none text-center px-4 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                      Calm Rest Suite
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-gold text-white px-3.5 py-1.5 rounded-full font-semibold shadow-md text-sm">
                  ${room.price}/night
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                  {room.category || "Standard"}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <h3 className="text-xl font-bold text-navy font-serif group-hover:text-gold transition-colors duration-300 line-clamp-1">
                      {room.name}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0 text-gray-700 bg-gray-50 px-2.5 py-1 rounded border border-gray-100 shadow-sm">
                      <Star fill="#d4af37" className="text-gold w-3.5 h-3.5" />
                      <span className="font-bold text-sm text-navy">{room.rating || 5.0}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-4 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Details Bar */}
                  <div className="flex items-center justify-between border-t border-b border-gray-100 py-3 mb-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1.5">
                      <Bed size={15} className="text-gold" />
                      <span>{room.bed}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center space-x-1.5">
                      <Users size={15} className="text-gold" />
                      <span>{room.guests} Guests</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center space-x-1.5">
                      <Maximize size={15} className="text-gold" />
                      <span>{room.size}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 text-xs bg-cream/70 text-navy px-2.5 py-1 rounded-md border border-gold/10 hover:border-gold/30 transition-all duration-300"
                      >
                        <span className="text-gold">{iconMap[feature.icon] || <Sparkles size={14} />}</span>
                        <span className="font-semibold text-gray-700">{feature.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-1.5">
                      {room.amenities?.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-[11px] font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities?.length > 3 && (
                        <span className="text-[11px] font-medium text-gold bg-gold/5 px-2 py-0.5 rounded">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mt-auto">
                  <button
                    className="flex-1 bg-navy text-white py-2.5 px-4 rounded hover:bg-gold hover:text-navy transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent('cta_click', { button_name: 'Room Card Book Now', room_name: room.name });
                      navigate("/login");
                    }}
                  >
                    Book Now
                  </button>
                  <button 
                    className="px-5 py-2.5 border border-gold text-gold rounded hover:bg-gold hover:text-white transition-all duration-300 text-xs font-semibold uppercase tracking-wider"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent('cta_click', { button_name: 'Room Card Details', room_name: room.name });
                      handleCardClick(room._id);
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rooms;

