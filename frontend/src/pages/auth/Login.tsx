import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { signInWithGoogle } from "../../firebase"; // ✅ import Firebase helper
import { trackEvent } from "../../utils/analytics";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 🔐 Normal Login (existing)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        trackEvent("login", { method: "email" });
        setSuccess(true);
        document.body.classList.add("fade-out");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          window.location.href = "/book";
        }, 1200);
      } else {
        setSuccess(false);
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setGoogleLoading(true);
  try {
    const user = await signInWithGoogle();

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Google login failed");
    }

    const data = await res.json();
    console.log("Google login success:", data);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "/book";
  } catch (err: any) {
    console.error("Google login failed:", err);
    alert("Google login failed: " + err.message);
  } finally {
    setGoogleLoading(false);
  }
};


  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 text-white max-w-sm">
          <h2 className="text-3xl font-bold mb-2">Find your sweet home</h2>
          <p className="text-lg">Schedule visits in just a few clicks.</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome Back to Calm Rest
          </h2>
          <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

          
          {/* Normal Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" /> Remember Me
              </label>
              <a href="#" className="text-gold hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-2 rounded text-white transition-all duration-300 flex items-center justify-center space-x-2 font-medium
                ${success ? "bg-green-600" : "bg-black hover:bg-gray-800"}
                ${loading ? "opacity-90 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Logging in...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Login Successful!</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
            {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border flex items-center justify-center gap-3 py-2 rounded-lg mb-5 hover:bg-gray-100"
          >
            {googleLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-gold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
