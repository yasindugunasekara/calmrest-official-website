import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Bed, Users, Bath } from "lucide-react";
import { useSectionTracking } from "../hooks/useSectionTracking";
import { trackEvent, trackEcommerceEvent } from "../utils/analytics";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // Section Tracking
  const filterRef = useSectionTracking('Room Categories Filter');
  const roomGridRef = useSectionTracking('Rooms Grid');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

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
              className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              {/* Room Card */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    Array.isArray(room.images) && room.images.length > 0
                      ? room.images[0]
                      : room.image ?? "https://via.placeholder.com/800x600?text=No+Image"
                  }
                  alt={room.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded-full font-semibold">
                  ${room.price}/night
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star fill="currentColor" className="text-gold w-4 h-4" />
                  <span className="font-semibold text-sm">{room.rating}</span>
                </div>
              </div>

              <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-navy font-serif">
            {room.name}
          </h3>
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {room.description}
          </p>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Bed size={14} />
              <span>{room.bed}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{room.guests} Guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath size={14} />
              <span>{room.size}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            {room.features.map((feature, index) => (
              <div key={index} className="text-gold flex items-center space-x-1">
                <span>{feature.icon}</span>
                <span>{feature.name}</span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span
            key={index}
            className="text-xs bg-cream px-2 py-1 rounded-full text-gray-600"
                >
            {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="text-xs text-gold">
            +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              className="flex-1 bg-gold text-white py-2 px-4 rounded hover:bg-opacity-90 transition-all duration-300 font-medium text-sm"
              onClick={() => {
                trackEvent('cta_click', { button_name: 'Room Card Book Now', room_name: room.name });
                navigate("/login");
              }}
            >
              Book Now
            </button>
            <button 
              className="px-4 py-2 border border-gold text-gold rounded hover:bg-gold hover:text-white transition-all duration-300 text-sm"
              onClick={() => {
                trackEvent('cta_click', { button_name: 'Room Card Details', room_name: room.name });
                navigate(`/rooms/${room._id}`);
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

