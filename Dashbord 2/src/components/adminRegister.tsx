import React, { useState } from "react";
import { User, ShieldAlert, Globe, Mail, Lock, UserCheck, ArrowLeft, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

      const res = await api.post("/users", {
        firstName: form.firstName,
        lastName: form.lastName,
        country: form.country,
        email: form.email,
        password: form.password,
        role: "admin", // Force role to admin
      });

      if (res.status === 201 || res.status === 200) {
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
        setError("Registration failed. Check inputs.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to connect to service. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-luxury-blue-950 p-4 relative overflow-hidden font-sans">
      {/* Background Image with Dark Glass Overlay */}
      <div className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-105 opacity-40" style={{ backgroundImage: "url('/assets/hotel_bg.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-luxury-blue-950 via-luxury-blue-950/90 to-luxury-blue-900/60" />

      {/* Decorative ambient background glows */}
      <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-[-10%] bottom-[-10%] w-[50%] h-[50%] bg-luxury-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card box container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-luxury-blue-900/40 border border-luxury-blue-800/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 text-left"
      >
        {/* Top Logo / brand heading */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-gold-600 to-gold-400 rounded-2xl text-luxury-blue-950 mb-4 shadow-lg shadow-gold/20">
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Admin Profile</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Deploy new security and management accounts to Calm Rest</p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">First Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full text-sm pl-10 pr-3.5 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">Last Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full text-sm pl-10 pr-3.5 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Country selector with auto suggestion */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">Country Location</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Globe className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
              </div>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Select Country"
                className="w-full text-sm pl-10 pr-3.5 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                required
              />
            </div>
            
            <AnimatePresence>
              {showSuggestions && form.country && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-luxury-blue-900 border border-luxury-blue-800 rounded-xl shadow-xl max-h-40 overflow-y-auto z-20 divide-y divide-luxury-blue-800/40 backdrop-blur-md"
                >
                  {countries
                    .filter((c) => c.toLowerCase().includes(form.country.toLowerCase()))
                    .slice(0, 5)
                    .map((c, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCountrySelect(c)}
                        className="p-3.5 text-xs text-slate-300 hover:bg-gold-500 hover:text-luxury-blue-950 cursor-pointer font-bold transition-colors"
                      >
                        {c}
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">Official Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@calmrest.com"
                className="w-full text-sm pl-10 pr-3.5 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                required
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gold-400 uppercase">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-500 group-focus-within:text-gold-400 transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-sm pl-10 pr-10 py-3 bg-luxury-blue-950/40 border border-luxury-blue-800 focus:border-gold-500 text-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500/30 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-xl font-semibold leading-relaxed"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider ${
              success
                ? "bg-emerald-500 text-white shadow-emerald-500/10"
                : "bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-600 hover:to-gold-500 text-luxury-blue-950 shadow-gold/15 hover:shadow-gold-500/25 hover:scale-[1.01]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Deploying Account Credentials...</span>
              </>
            ) : success ? (
              <>
                <UserCheck className="w-4.5 h-4.5" />
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
