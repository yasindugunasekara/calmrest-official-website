import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Home, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      
      // Redirect with minor delay for smooth transition
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-luxury-blue-950 flex font-sans text-slate-100 overflow-hidden relative">
      {/* Dynamic Background Light Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-luxury-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex w-full min-h-screen">
        {/* Left Side: Brand Showcase (Visible only on lg screens) */}
        <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden items-center justify-center p-12">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/hotel_bg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-blue-950/95 via-luxury-blue-950/80 to-luxury-blue-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-blue-950 via-transparent to-transparent opacity-80" />

          {/* Branding Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-lg mt-auto mb-12 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                <Home className="w-6 h-6 text-luxury-blue-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block">Calm Rest</span>
                <span className="text-xs font-semibold text-gold tracking-widest uppercase block -mt-0.5">Luxury Hotel</span>
              </div>
            </div>

            <div className="h-[2px] w-20 bg-gradient-to-r from-gold-400 to-transparent" />

            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight font-serif">
              A Sanctuary of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-gold-400">
                Serenity and Elegance
              </span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed tracking-wide">
              Manage your bookings, rooms, users, and guest interactions with our bespoke, clean, and intuitive administrative suite. Experience luxury in management.
            </p>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-white">5 Star</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Rating</span>
              </div>
              <div className="w-[1px] h-8 bg-luxury-blue-800" />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-white">100%</span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Secure</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-5/12 flex items-center justify-center p-6 md:p-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Logo for mobile only */}
            <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
              <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
                <Home className="w-5 h-5 text-luxury-blue-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">Calm Rest</span>
                <span className="text-xs font-semibold text-gold tracking-widest uppercase block -mt-0.5">Luxury Hotel</span>
              </div>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
              <p className="text-slate-400 mt-2 text-sm">Please sign in to access the administrator panel.</p>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gold-400 uppercase">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@calmrest.com"
                    className="w-full bg-luxury-blue-900/30 border border-luxury-blue-800 focus:border-gold-500 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold tracking-wider text-gold-400 uppercase">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-luxury-blue-900/30 border border-luxury-blue-800 focus:border-gold-500 text-white pl-12 pr-12 py-3.5 rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-600 hover:to-gold-500 text-luxury-blue-950 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 tracking-wide">
                Calm Rest Luxury Hotel &copy; {new Date().getFullYear()}. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
