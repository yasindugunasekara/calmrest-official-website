import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Shield, Globe, Mail, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  country: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Fetch users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`);
        const adminUsers = response.data.filter((user: any) => user.role === "admin");
        setUsers(adminUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Open delete confirmation modal
  const confirmDelete = (user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Delete user
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${selectedUser._id}`);
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Administrators Directory</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage administrative credentials, system roles, and country locations.</p>
        </div>
        <button
          className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/15 transition-all text-xs hover:scale-[1.02]"
          onClick={() => window.location.href = "/addregister"}
        >
          Add Admin User
        </button>
      </div>

      {/* Main List Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Loading administrators...
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-xs font-semibold">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No administrator accounts exist in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Privileges</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Location</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-55/20 transition-colors">
                    {/* User profile with initials avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-100/50 border border-gold-200/20 flex items-center justify-center text-gold-700 font-bold text-[11px] uppercase shadow-inner">
                          {user.firstName ? user.firstName[0] : ""}
                          {user.lastName ? user.lastName[0] : ""}
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-luxury-blue-50 text-luxury-blue-700 text-[10px] font-bold rounded-lg border border-luxury-blue-100/30 capitalize">
                        <Shield className="w-3 h-3 text-gold" />
                        {user.role}
                      </span>
                    </td>

                    {/* Country location */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-semibold flex items-center gap-1.5 mt-2.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      {user.country || "Not specified"}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition-all"
                        onClick={() => confirmDelete(user)}
                        title="Remove Administrator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-150 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="p-2 rounded-xl bg-rose-50">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Revoke Credentials</h3>
              </div>
              
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Are you sure you want to delete administrator <strong className="text-gray-800 font-semibold">{selectedUser.firstName} {selectedUser.lastName}</strong>? This user will lose system dashboard permissions immediately.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/10"
                  onClick={handleDelete}
                >
                  Revoke Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
