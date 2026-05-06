import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  country?: string;
  rating: number;
  reviewTitle?: string;
  review: string;
  roomType?: string;
  stayDuration?: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  // Initialize testimonials as an empty array to avoid undefined errors.
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/testimonials/`);
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        console.log('Fetched testimonials data:', data);
        // Defensive: ensure data is always an array
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('⚠️ Could not load reviews. Please try again later.');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-gold fill-current' : 'text-gray-300'
        }`}
      />
    ));

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dcgfwnzzr/image/upload/v1761978975/DSC07870_ubapwv.png)",
          }}
        />
        <div className="absolute inset-0 bg-navy bg-opacity-70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif">
            Guest Testimonials
          </h1>
          <p className="text-xl text-white/90">
            Hear from our valued guests about their exceptional experiences
          </p>
        </div>
      </section>

      {/* Loader */}
      {loading && (
        <p className="text-center text-gray-500 py-10">⏳ Loading reviews...</p>
      )}

      {/* Reviews Grid */}
      {!loading && testimonials.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-navy font-serif">
                All Guest Reviews
              </h2>
              <p className="text-lg text-gray-700">
                Browse through all the wonderful feedback from our guests
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-navy">{t.name}</h3>
                    <div className="flex">{renderStars(t.rating)}</div>
                  </div>

                  {t.reviewTitle && (
                    <h4 className="font-semibold text-navy mb-1 text-sm">
                      {t.reviewTitle}
                    </h4>
                  )}

                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {t.review && t.review.length > 120
                      ? `${t.review.slice(0, 120)}...`
                      : t.review}
                  </p>

                  <div className="flex text-xs text-gray-500 space-x-4">
                    {t.country && <p>🌍 {t.country}</p>}
                    {t.roomType && <p>🏨 Room: {t.roomType}</p>}
                    {t.stayDuration && (
                      <p>
                        ⏳ Stay: {t.stayDuration}{' '}
                        {t.stayDuration === '1' ? 'Night' : 'Nights'}
                      </p>
                    )}
                    <p>📅 {new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Reviews */}
      {!loading && testimonials.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No reviews yet. Be the first!
        </p>
      )}

      {/* CTA */}
      <section className="py-16 bg-navy/50 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 font-serif">
            Share Your Experience
          </h2>
          <p className="text-xl text-white/90 mb-8">
            We'd love to hear about your stay at Calm Rest Hotel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gold text-white px-8 py-3 rounded hover:bg-opacity-90 transition-all duration-300 font-medium"
              onClick={() => navigate('/write-review')}
            >
              Write a Review
            </button>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-navy transition-all duration-300 font-medium"
              onClick={() => navigate('/login')}
            >
              Book Your Stay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
