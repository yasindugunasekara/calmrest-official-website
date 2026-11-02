import { lazy, Suspense } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  DoorOpen,
} from "lucide-react";
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

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-24 lg:pb-6 bg-gray-50/50">
          {children}
        </main>
      </div>

      <nav
        aria-label="Mobile admin navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t grid grid-cols-4 lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        {[
          { path: "/dashboard", label: "Overview", Icon: LayoutDashboard },
          { path: "/bookings", label: "Bookings", Icon: CalendarDays },
          { path: "/messages", label: "Messages", Icon: MessageSquare },
          { path: "/rooms", label: "Rooms", Icon: DoorOpen },
        ].map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-3 text-[11px] min-h-16 ${isActive ? "text-amber-700 bg-amber-50 font-bold" : "text-slate-500"}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
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
      <Suspense
        fallback={
          <div className="p-12 text-center" role="status">
            <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-stone-200 border-t-amber-600 animate-spin" />
            Opening your workspace…
          </div>
        }
      >
        <Routes>
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
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
