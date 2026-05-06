import React, { useEffect } from 'react';
import { MapPin, Plane, Car, Utensils, ShoppingBag, Camera, Clock, Phone, Mail, Waves, Bike } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const Location = () => {
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);

  const attractions = [
    {
      icon: <Camera className="w-6 h-6" />,
      name: 'Weligama Beach',
      distance: '3.4 km',
      walkTime: '5 min ',
      description: 'stunning beach with golden sand and clear waters'
    },{
      icon: <Utensils className="w-6 h-6" />,
      name: 'Kai Beach',
      distance: '5 km',
      walkTime: '6 min ',
      description: 'Stunning beach with golden sand and clear waters'

    },
    {
      icon: <Waves className="w-6 h-6" />,
      name: 'Midigama Beach',
      distance: '950 m',
      walkTime: '1 min ',
      description: 'Popular seafood restaurant with ocean views'
    },{
      icon: <Camera className="w-6 h-6" />,
      name: 'Secret Kushtarajagala',
      distance: '3.1 km',
      walkTime: '5 min ',
      description: 'attractive ancient rock '
    },{
      icon: <ShoppingBag className="w-6 h-6" />,
      name: 'Galle Dutch Fort',
      distance: '23.3 km',
      walkTime: '35 min ',
      description: 'shopping centers and attractive places'
    },{
      icon: <ShoppingBag className="w-6 h-6" />,
      name: 'Coconut Tree Hill',
      distance: '12.7 km',
      walkTime: '20 min ',
      description: 'picturesque hill with coconut trees and ocean views'
    },
  ];

  const transportOptions = [
    {
      icon: <Bike className="w-8 h-8" />,
      title: 'Bike Rentals',
      description: 'Complimentary bike rentals for exploring the area',
      schedule: 'Available daily, 8 AM - 8 PM'
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Taxi Service',
      description: '24/7 taxi service available at hotel entrance',
      schedule: 'Available on demand'
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Car Rental',
      description: 'Premium car rental services through our concierge',
      schedule: 'Available with advance booking'
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dcgfwnzzr/image/upload/v1761979536/pexels-asadphoto-3155661_axko0o.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-navy bg-opacity-70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
            Location & Directions
          </h1>
          <p className="text-xl text-white/90">
            Perfectly positioned in the heart of the city
          </p>
        </div>
      </section>

      {/* Address & Contact */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gold p-4 rounded-full">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-navy font-serif">Calm Rest Hotel</h2>
            <div className="text-lg text-gray-700 space-y-2 mb-8">
              <p> Calm Rest </p>
              <p>Midigama</p>
              <p>Ahangama</p>
              <p> Sri Lanka</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-5 h-5 text-gold" />
                <span className="text-gray-700">+94 412251712</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-gold" />
                <span className="text-gray-700">info@calmrest.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Location Info */}
      <section className="py-20 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
        {/* Map */}
        <div>
          <div className="rounded-lg overflow-hidden h-96">
            <iframe
              title="Calm Rest Hotel Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.2338415574786!2d80.39489967498828!3d5.962492394022205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae114e826db1595%3A0x7689ea709c4b1cf2!2sCalm%20Rest!5e0!3m2!1sen!2slk!4v1758386795272!5m2!1sen!2slk"
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="text-center mt-4">
            <button
              className="bg-gold text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
              onClick={() => {
                trackEvent("view_map", { map_service: "google_maps" });
                window.open(
                  "https://www.google.com/maps/place/Calm+Rest/@5.9624924,80.3948997,17z/data=!4m9!3m8!1s0x3ae114e826db1595:0x7689ea709c4b1cf2!5m2!4m1!1i2!8m2!3d5.9624924!4d80.3974746!16s%2Fg%2F11cn2zv5kz?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D",
                  "_blank"
                );
              }}
            >
              Open in Google Maps
            </button>
          </div>
        </div>

        {/* Location Info */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-navy font-serif">Prime Location</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Calm Rest Hotel is strategically located in the prestigious downtown district, offering unparalleled access to the city's finest attractions, business centers, and cultural landmarks.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-gold p-2 rounded-full mt-1">
                <Car className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Transportation Hub</h3>
                <p className="text-gray-600">Easy access to airports, train stations, and major highways</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gold p-2 rounded-full mt-1">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Shopping & Dining</h3>
                <p className="text-gray-600">Walking distance to premium shopping and world-class restaurants</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gold p-2 rounded-full mt-1">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">Cultural Attractions</h3>
                <p className="text-gray-600">Minutes away from museums, galleries, and historic landmarks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Attractions */}
      <section id="attractions" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy font-serif">Nearby Attractions</h2>
            <p className="text-lg text-gray-700">Discover the best of the city from our convenient location</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold p-3 rounded-full text-white flex-shrink-0">
                    {attraction.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy mb-1">{attraction.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{attraction.distance}</span>
                      <span>•</span>
                      <span>{attraction.walkTime}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{attraction.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transportation */}
      <section id="transport" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy font-serif">Transportation Options</h2>
            <p className="text-lg text-gray-700">Multiple convenient ways to travel around the city</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {transportOptions.map((option, index) => (
              <div key={index} className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="bg-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-gold">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-navy">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{option.schedule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directions */}
      <section id="directions" className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 font-serif">Getting Here</h2>
            <p className="text-xl text-white/90">Detailed directions to reach Calm Rest Hotel</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Plane className="w-6 h-6 text-gold" />
                <h3 className="text-xl font-semibold">From Airport</h3>
              </div>
              <ul className="space-y-2 text-white/90 text-left">
                <li>• Take Airport Express to Central Station (15 min)</li>
                <li>• Transfer to Metro Line 2 towards Downtown (8 min)</li>
                <li>• Exit at Luxury District Station</li>
                <li>• Hotel is 200m from station exit</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Car className="w-6 h-6 text-gold" />
                <h3 className="text-xl font-semibold">By Car</h3>
              </div>
              <ul className="space-y-2 text-white/90 text-left">
                <li>• Take Highway 1 to Downtown Exit 15</li>
                <li>• Follow signs to Luxury District</li>
                <li>• Turn right on Luxury Avenue</li>
                <li>• Valet parking available at hotel entrance</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gold text-white px-8 py-3 rounded hover:bg-opacity-90 transition-all duration-300 font-medium">
              Get Detailed Directions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Location;
