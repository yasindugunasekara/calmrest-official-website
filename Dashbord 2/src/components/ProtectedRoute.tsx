import React from "react";
import { Navigate } from "react-router-dom";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    const payload = parts[1];
    // Decode base64 URL-safe
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    const decoded: DecodedToken = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;

    // Check expiration
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("Token expired. Redirecting to login...");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    // Role verification (Admin only)
    if (decoded.role !== "admin") {
      console.warn("Unauthorized access attempt. Admin role required.");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

  } catch (err) {
    console.error("JWT validation error in middleware:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
