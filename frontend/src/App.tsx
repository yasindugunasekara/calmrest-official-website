import React, { useEffect } from "react"; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import About from "./pages/About";
import Location from "./pages/Location";
import Testimonials from "./pages/Testimonials";
import WriteReview from "./pages/WriteReview";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import BookingPage from "./pages/BookingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoomDetails from "./pages/RoomDetails";
import NotFound from "./pages/NotFound"; // 404 Page
import { LanguageProvider } from "./contexts/LanguageContext";
import ReactGA from "react-ga4";

ReactGA.initialize("G-W6VFYS47F8");

// ✅ Layout wrapper: shows/hides Navbar and Footer depending on route
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location.pathname]); 

  // Hide Navbar/Footer on specific routes
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/404" ||
    location.pathname.startsWith("/rooms/"); 

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/about" element={<About />} />
            <Route path="/location" element={<Location />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/book" element={<BookingPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Room Details Page (no header/footer) */}
            <Route path="/rooms/:id" element={<RoomDetails />} />

            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </LanguageProvider>
  );
}

export default App;