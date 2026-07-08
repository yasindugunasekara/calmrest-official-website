import React, { useState } from "react";
import { User, ShieldAlert, Globe, Mail, Lock, UserCheck, ArrowLeft, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "India", "Germany",
  "France", "Japan", "China", "Brazil", "Mexico", "Italy", "South Korea",
  "Russia", "South Africa", "Spain", "Netherlands", "Sweden", "Switzerland",
  "New Zealand", "Norway", "Denmark", "Finland", "Ireland", "Singapore",
  "Malaysia", "Thailand", "Indonesia", "Philippines", "Vietnam", "Argentina",
  "Chile", "Colombia", "Peru", "Venezuela", "Saudi Arabia", "UAE", "Turkey",
  "Egypt", "Nigeria", "Kenya", "Ethiopia", "Pakistan", "Bangladesh", "Sri Lanka", "England"
];

const AdminRegister: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setError("");
    }
  };

  const handleCountrySelect = (country: string) => {
    setForm({ ...form, country });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          country: form.country,
          email: form.email,
          password: form.password,
          role: "admin", // Force role to admin
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({
          firstName: "",
          lastName: "",
          country: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect back
        setTimeout(() => {
          window.history.back();
        }, 2000);
      } else {
        setError(data.error || "Registration failed. Check inputs.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to connect to service. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-luxury-blue-950 p-4 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background glows */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none transform translate-x-24 -translate-y-24" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none transform -translate-x-24 translate-y-24" />

      {/* Main card box container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-luxury-blue-900 border border-luxury-blue-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-left"
      >
        
        {/* Top Logo / brand heading */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gold/10 border border-gold-500/20 rounded-2xl text-gold-300 mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Create Admin Profile</h2>
          <p className="text-slate-400 text-xs mt-1">Deploy new security and management accounts to Calm Rest</p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          {/* Country selector with auto suggestion */}
          <div className="relative">
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Country Location"
              className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
              required
            />
            
            <AnimatePresence>
              {showSuggestions && form.country && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 w-full mt-1.5 bg-luxury-blue-900 border border-luxury-blue-800 rounded-xl shadow-xl max-h-40 overflow-y-auto z-20 divide-y divide-luxury-blue-800/40"
                >
                  {countries
                    .filter((c) => c.toLowerCase().includes(form.country.toLowerCase()))
                    .slice(0, 5)
                    .map((c, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCountrySelect(c)}
                        className="p-3 text-xs text-slate-300 hover:bg-gold hover:text-luxury-blue-950 cursor-pointer font-semibold transition-colors"
                      >
                        {c}
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email address */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Official Email Address"
            className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
            required
          />

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Secure Password"
              className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full text-xs px-3.5 py-3 bg-luxury-blue-950 border border-luxury-blue-800 text-white rounded-xl focus:border-gold outline-none transition-all placeholder:text-slate-500"
              required
            />
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium"
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
              success
                ? "bg-emerald-500 text-white shadow-emerald-500/10"
                : "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold/15 hover:shadow-gold/25 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span>Deploying Account Credentials...</span>
            ) : success ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Admin User Saved!</span>
              </>
            ) : (
              <span>Deploy Administrator</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-300 font-bold transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to operations dashboard
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminRegister;
