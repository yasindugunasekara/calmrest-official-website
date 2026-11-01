import { useEffect} from 'react';
import { Utensils, Waves, Dumbbell, Car, Calendar, Users, Sparkles, Wine, Music, Heart } from 'lucide-react';

const Services = () => {


 // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <Utensils className="w-12 h-12" />,
      title: 'Fine Dining',
      description: 'Michelin-starred cuisine in elegant settings',
      features: ['3 Restaurants', 'International Cuisine', 'Private Dining', 'Wine Cellar'],
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Waves className="w-12 h-12" />,
      title: 'Spa & Wellness',
      description: 'Rejuvenating treatments and wellness experiences',
      features: ['Full-Service Spa', 'Therapeutic Treatments', 'Wellness Packages', 'Relaxation Areas'],
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Dumbbell className="w-12 h-12" />,
      title: 'Fitness Center',
      description: '24/7 access to state-of-the-art equipment',
      features: ['Modern Equipment', 'Personal Training', 'Group Classes', 'Yoga Studio'],
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: <Car className="w-12 h-12" />,
      title: 'Concierge Services',
      description: 'Personalized assistance for all your needs',
      features: ['24/7 Concierge', 'Transportation', 'Tour Booking', 'Reservations'],
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
  ];

  const packages = [
    {
      id: 'wedding',
      icon: <Heart className="w-8 h-8" />,
      title: 'Wedding Packages',
      subtitle: 'Your dream wedding awaits',
      description: 'Create unforgettable memories with our comprehensive wedding packages',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Bridal Suite Accommodation',
        'Reception Hall for 200+ guests',
        'Professional Wedding Planning',
        'Floral Arrangements',
        'Photography Services',
        'Honeymoon Suite Upgrade'
      ],
      pricing: [
        { name: 'Intimate', guests: '50 guests', price: '$8,999' },
        { name: 'Classic', guests: '100 guests', price: '$15,999' },
        { name: 'Grand', guests: '200+ guests', price: '$25,999' },
      ]
    },
    {
      id: 'corporate',
      icon: <Users className="w-8 h-8" />,
      title: 'Corporate Events',
      subtitle: 'Professional meetings & conferences',
      description: 'State-of-the-art facilities for successful business events',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Multiple Conference Rooms',
        'Audio/Visual Equipment',
        'Business Center Access',
        'Catering Services',
        'Team Building Activities',
        'Executive Accommodations'
      ],
      pricing: [
        { name: 'Meeting Room', guests: '20 people', price: '$499/day' },
        { name: 'Conference Hall', guests: '100 people', price: '$1,299/day' },
        { name: 'Full Event Package', guests: '200+ people', price: '$2,999/day' },
      ]
    },
    {
      id: 'spa',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Spa Retreats',
      subtitle: 'Ultimate relaxation experiences',
      description: 'Comprehensive wellness packages for mind, body, and soul',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Full Body Treatments',
        'Aromatherapy Sessions',
        'Yoga & Meditation',
        'Healthy Cuisine',
        'Wellness Consultation',
        'Take-home Spa Kit'
      ],
      pricing: [
        { name: 'Half Day', guests: 'Individual', price: '$299' },
        { name: 'Full Day', guests: 'Individual', price: '$499' },
        { name: 'Weekend Retreat', guests: 'Individual', price: '$899' },
      ]
    },
    {
      id: 'dining',
      icon: <Wine className="w-8 h-8" />,
      title: 'Culinary Experiences',
      subtitle: 'Gourmet dining adventures',
      description: 'Exclusive culinary journeys with world-class chefs',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Chef\'s Table Experience',
        'Wine Tasting Sessions',
        'Cooking Classes',
        'Private Dining Events',
        'Seasonal Menu Tastings',
        'Sommelier Recommendations'
      ],
      pricing: [
        { name: 'Wine Tasting', guests: '2 people', price: '$199' },
        { name: 'Chef\'s Table', guests: '6 people', price: '$599' },
        { name: 'Culinary Weekend', guests: '2 people', price: '$1,299' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        />
        <div className="absolute inset-0 bg-navy bg-opacity-70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
            Services & Packages
          </h1>
          <p className="text-xl text-white/90">
            Exceptional experiences tailored to your every need
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy font-serif">Our Services</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              World-class amenities and services designed for your comfort and enjoyment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy bg-opacity-60 flex items-center justify-center">
                    <div className="text-gold">{service.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-navy">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy font-serif">Special Packages</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Carefully crafted packages for memorable occasions and experiences
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-gold mb-4">{pkg.icon}</div>
                      <h3 className="text-2xl font-bold font-serif">{pkg.title}</h3>
                      <p className="text-white/90">{pkg.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-700 mb-6">{pkg.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-navy mb-3">Package Includes:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-navy mb-4">Pricing Options:</h4>
                    <div className="space-y-3">
                      {pkg.pricing.map((option, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                          <div>
                            <div className="font-medium text-navy">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.guests}</div>
                          </div>
                          <div className="text-xl font-bold text-gold">{option.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gold text-white py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium mt-6">
                    Book This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-navy font-serif">Additional Services</h2>
            <p className="text-lg text-gray-700">Enhance your stay with our premium add-on services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <Calendar className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-navy">Event Planning</h3>
              <p className="text-gray-600 mb-4">Professional event coordination for any occasion</p>
              <p className="text-gold font-bold">Starting at $299</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <Car className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-navy">Airport Transfer</h3>
              <p className="text-gray-600 mb-4">Luxury transportation to and from the airport</p>
              <p className="text-gold font-bold">Starting at $89</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <Music className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-navy">Entertainment</h3>
              <p className="text-gray-600 mb-4">Live music and entertainment arrangements</p>
              <p className="text-gold font-bold">Starting at $199</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 font-serif">Ready to Book Your Experience?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contact our team to customize the perfect package for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gold text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 font-medium">
              Contact Us
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-navy transition-all duration-300 font-medium">
              View Packages
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
