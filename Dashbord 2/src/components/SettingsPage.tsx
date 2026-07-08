import React, { useState } from "react";
import { Info, Calendar, ShieldCheck, Mail, Save, ToggleLeft, ToggleRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">System Configuration</h1>
          <p className="text-gray-400 text-xs mt-0.5">Customize hotel policies, general information, and notification behaviors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Section 1: Hotel Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-3">
            <Info className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-bold text-gray-800">General Hotel Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Hotel Brand Name" defaultValue="Calm Rest Luxury Suites" />
            <InputField label="Operational Contact Number" type="tel" defaultValue="+1 (234) 567-8900" />
            <div className="md:col-span-2">
              <InputField label="Physical Address" defaultValue="777 Luxury Heights, Coastal Marina, FL 33101" />
            </div>
            <InputField label="Primary Email Contact" type="email" defaultValue="concierge@calmrest.com" />
            <InputField label="Hotel Website Portal" type="url" defaultValue="https://calmrest.com" />
          </div>
        </div>

        {/* Section 2: Booking Behavior Toggles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-3">
            <Calendar className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-bold text-gray-800">Reservation Policies</h3>
          </div>

          <div className="space-y-4">
            
            {/* Toggle Item 1 */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all">
              <div className="pr-4">
                <p className="text-xs font-bold text-gray-800">Enable Online Bookings</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Allow public guest reservations via web portal application.</p>
              </div>
              <button
                type="button"
                onClick={() => setOnlineBooking(!onlineBooking)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  onlineBooking ? "bg-gold" : "bg-gray-200"
                }`}
              >
                <motion.span
                  layout
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    onlineBooking ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle Item 2 */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all">
              <div className="pr-4">
                <p className="text-xs font-bold text-gray-800">Auto-Confirm Direct Bookings</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Bypass manual administrator verification for online check-in slots.</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoConfirm(!autoConfirm)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoConfirm ? "bg-gold" : "bg-gray-200"
                }`}
              >
                <motion.span
                  layout
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoConfirm ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle Item 3 */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all">
              <div className="pr-4">
                <p className="text-xs font-bold text-gray-800">Email Alerts & Confirmations</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Generate and transmit auto confirmation invoices directly to guest emails.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotif ? "bg-gold" : "bg-gray-200"
                }`}
              >
                <motion.span
                  layout
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotif ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Section 3: Time Rules */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-3">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-bold text-gray-800">Check-in / Check-out Standards</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Default Check-in Threshold Time</label>
              <input
                type="time"
                defaultValue="14:00"
                className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Default Check-out Limit Time</label>
              <input
                type="time"
                defaultValue="11:00"
                className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Action panel footer */}
      <div className="flex items-center justify-end gap-3 mt-8">
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 animate-fade-in-out">
            ✓ Configuration saved successfully!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:shadow-lg hover:shadow-gold/15 transition-all w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

// Custom Input Field utility
const InputField: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
    />
  </div>
);
