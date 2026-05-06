import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/roomsData";
import { trackEvent } from "../utils/analytics";

const WriteReview = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [roomType, setRoomType] = useState("");
  const [stayDuration, setStayDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReview = {
      name,
      country,
      rating,
      reviewTitle,
      review,
      roomType,
      stayDuration,
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/testimonials/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      trackEvent("submit_review", { room_type: roomType, rating: rating });
      const data = await res.json();
      console.log("Review saved:", data);

      alert("✅ Review submitted successfully!");

      // Clear form
      setName("");
      setCountry("");
      setReview("");
      setRating(5);
      setReviewTitle("");
      setRoomType("");
      setStayDuration("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "India",
    "Germany", "France", "Japan", "China", "Brazil",
    "Mexico", "Italy", "South Korea", "Russia", "South Africa",
    "Spain", "Netherlands", "Sweden", "Switzerland", "New Zealand",
    "Norway", "Denmark", "Finland", "Ireland", "Singapore", "Malaysia",
    "Thailand", "Indonesia", "Philippines", "Vietnam", "Argentina",
    "Chile", "Colombia", "Peru", "Venezuela", "Saudi Arabia",
    "United Arab Emirates", "Turkey", "Egypt", "Nigeria", "Kenya",
    "Ethiopia", "Pakistan", "Bangladesh", "Sri Lanka",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col md:flex-row md:space-x-8 -translate-y-7"
      >
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Write Your Review</h2>

          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-4 w-full"
            placeholder="Your Name"
            required
          />

          <label className="block mb-2">Country</label>
          <div className="relative" ref={wrapperRef}>
            <input
              type="text"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setShowSuggestions(true);
              }}
              className="border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Your Country"
              required
            />

            {showSuggestions && country && (
              <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                {countries
                  .filter((c) =>
                    c.toLowerCase().includes(country.toLowerCase())
                  )
                  .slice(0, 50)
                  .map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gold hover:text-white cursor-pointer"
                      onClick={() => {
                        setCountry(suggestion);
                        setShowSuggestions(false); // ✅ hide dropdown
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <label className="block mb-2">Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 mb-4 w-full"
            required
          />

          <label className="block mb-2">Review Title</label>
          <input
            type="text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            className="border p-2 mb-4 w-full"
            placeholder="Review Title"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block mb-2">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="border p-2 mb-4 w-full"
            rows={5}
            placeholder="Write your review here..."
            required
          />

          <label className="block mb-2">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          >
            <option value="" disabled>
              Select Room Type
            </option>
            {categories
              .filter((category) => category.id !== "all")
              .map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>

          <label className="block mb-2">Stay Duration (in days)</label>
          <input
            type="number"
            min={1}
            value={stayDuration}
            onChange={(e) => setStayDuration(e.target.value)}
            className="border p-2 mb-4 w-full"
            placeholder="Number of days"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gold text-white px-4 py-2 rounded hover:bg-opacity-90 w-full"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      <button
        onClick={() => (window.location.href = "/testimonials")}
        className="mt-4 text-navy px-4 py-2 rounded hover:text-opacity-80 flex items-center justify-center"
      >
        <span className="mr-2">←</span>
        Back to Reviews
      </button>
    </div>
  );
};

export default WriteReview;
