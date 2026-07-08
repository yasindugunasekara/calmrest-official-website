import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Bookings from "./components/Bookings";
import Messages from "./components/Messages";
import Rooms from "./components/Rooms";
import UsersPage from "./components/UsersPage";
import SettingsPage from "./components/SettingsPage";
import AdminRegister from "./components/adminRegister";

// Layout wrapper for dashboard pages
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden font-sans">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">{children}</main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/bookings"
          element={
            <DashboardLayout>
              <Bookings />
            </DashboardLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          }
        />
        <Route
          path="/rooms"
          element={
            <DashboardLayout>
              <Rooms />
            </DashboardLayout>
          }
        />
        <Route
          path="/users"
          element={
            <DashboardLayout>
              <UsersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/addregister"
          element={
            
              <AdminRegister />
            
          }
        />
        {/* 404 fallback */}
        <Route path="*" element={<div className="p-10 text-center text-2xl">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
