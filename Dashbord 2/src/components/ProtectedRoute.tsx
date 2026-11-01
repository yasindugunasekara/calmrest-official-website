import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/api";
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );
  useEffect(() => {
    let active = true;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (active) setState(data.user.role === "admin" ? "allowed" : "denied");
      })
      .catch(() => {
        if (active) setState("denied");
      });
    return () => {
      active = false;
    };
  }, []);
  if (state === "loading")
    return (
      <div
        className="min-h-screen bg-stone-50 flex items-center justify-center p-6"
        role="status"
      >
        <div className="text-center hotel-success">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full border-4 border-stone-200 border-t-amber-600 animate-spin" />
          <p className="text-2xl font-semibold text-slate-900">Calm Rest</p>
          <p className="mt-2 text-slate-500">
            Preparing your secure workspace…
          </p>
        </div>
      </div>
    );
  return state === "allowed" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}
