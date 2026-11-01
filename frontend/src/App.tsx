import { lazy, Suspense } from "react";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Services=lazy(()=>import("./pages/Services"));
const PasswordRecovery = lazy(()=>import("./pages/auth/PasswordRecovery"));

const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const About = lazy(() => import("./pages/About"));
const Location = lazy(() => import("./pages/Location"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const WriteReview = lazy(() => import("./pages/WriteReview"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RoomDetails = lazy(() => import("./pages/RoomDetails"));
const NotFound = lazy(() => import("./pages/NotFound")); // 404 Page
import { LanguageProvider } from "./contexts/LanguageContext";
import ReactGA from "react-ga4";

ReactGA.initialize("G-W6VFYS47F8");

// ✅ Layout wrapper: shows/hides Navbar and Footer depending on route
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location.pathname]);

  // Hide Navbar/Footer on specific routes (case-insensitive)
  const path = location.pathname.toLowerCase();
  const hideLayout =
    path === "/login" || path === "/forgot-password" || path === "/reset-password" ||
    path === "/register" ||
    path === "/404" ||
    path === "/book" ||
    path.startsWith("/rooms/");

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
          <Suspense fallback={<div className="p-12 text-center" role="status"><div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-stone-200 border-t-amber-600 animate-spin"/>Preparing your stay…</div>}><Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/location" element={<Location />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/book" element={<BookingPage />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<PasswordRecovery />} />
            <Route path="/register" element={<Register />} />

            {/* Room Details Page (no header/footer) */}
            <Route path="/rooms/:id" element={<RoomDetails />} />

            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes></Suspense>
        </LayoutWrapper>
      </Router>
    </LanguageProvider>
  );
}

export default App;
