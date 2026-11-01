import { lazy, Suspense } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const Dashboard = lazy(() => import("./components/Dashboard"));
const Bookings = lazy(() => import("./components/Bookings"));
const Messages = lazy(() => import("./components/Messages"));
const Rooms = lazy(() => import("./components/Rooms"));
const UsersPage = lazy(() => import("./components/UsersPage"));
const SettingsPage = lazy(() => import("./components/SettingsPage"));

const AdminRegister = lazy(() => import("./components/adminRegister"));
const Login = lazy(() => import("./components/Login"));
import ProtectedRoute from "./components/ProtectedRoute";

// ===============================
// Dashboard Layout
// ===============================

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// ===============================
// App
// ===============================

function App() {
  return (
    <Router>
      <Suspense fallback={<p className="p-8 text-center" role="status">Loading…</p>}><Routes>
        {/* Default Route */}

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login Page */}

        <Route path="/login" element={<Login />} />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Bookings */}

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Bookings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Messages */}

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Rooms */}

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Rooms />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Users */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Register */}

        <Route
          path="/addregister"
          element={
            <ProtectedRoute>
              <AdminRegister />
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <div className="p-10 text-center text-2xl">404 Not Found</div>
          }
        />
      </Routes></Suspense>
    </Router>
  );
}

export default App;
