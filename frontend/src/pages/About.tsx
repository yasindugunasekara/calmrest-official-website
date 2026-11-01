import { useEffect } from 'react';
import { useSectionTracking } from '../hooks/useSectionTracking';

const About = () => {
  // Section Tracking
  const storyRef = useSectionTracking('Our Story');

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);




  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dcgfwnzzr/image/upload/f_auto,q_auto,c_limit,w_1600/v1767077422/DSC00479_aifbwb.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-navy bg-opacity-70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
            About Calm Rest
          </h1>
          <p className="text-xl text-white/90">
            A legacy of luxury hospitality since 1999
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-navy font-serif">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 1999 with a vision to redefine luxury hospitality, Calm Rest began as a boutique
                hotel with just 50 rooms. Our founders believed that true luxury lies not just in opulent
                surroundings, but in the personal connections and unforgettable experiences we create for
                every guest.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Over the years, we have grown from a small luxury hotel to a renowned destination,
                consistently recognized for excellence in service, sustainability, and innovation.
                Every expansion and renovation has been guided by our commitment to maintaining the
                intimate, personalized experience that defines Calm Rest.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-cream rounded-lg">
                  <div className="text-3xl font-bold text-gold mb-2">25+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center p-4 bg-cream rounded-lg">
                  <div className="text-3xl font-bold text-gold mb-2">50K+</div>
                  <div className="text-gray-600">Happy Guests</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dcgfwnzzr/image/upload/f_auto,q_auto,c_limit,w_1600/v1767077354/529911268_mdmgvu.jpg"
                alt="Hotel History"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {/* Values */}
      {/* Timeline */}
      {/* Team */}
      {/* Stats */}
      {/* Keep your existing JSX for these sections */}
    </div>
  );
};

export default About;
