import React from "react";
import BookingForm from "../components/BookingForm"; // adjust path if needed



const BookingPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-cream flex flex-col justify-center items-center p-4 lg:p-6 overflow-y-auto lg:overflow-hidden">
      <BookingForm />
    </div>
  );
};

export default BookingPage;
