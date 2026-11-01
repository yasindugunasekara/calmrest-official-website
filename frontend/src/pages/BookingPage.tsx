import React from "react";
import BookingForm from "../components/BookingForm"; // adjust path if needed



const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-cream flex flex-col items-center p-4 lg:p-6">
      <BookingForm />
    </div>
  );
};

export default BookingPage;
