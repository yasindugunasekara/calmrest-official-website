import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  X,
  BedDouble,
  Wind,
  Tv,
  UtensilsCrossed,
  Wifi,
  Bath,
  Star,
  Maximize2,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Extend global window interface for Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

// Amenity Icon map
const iconMap = {
  wifi: <Wifi size={16} className="text-gold" />,
  airConditioning: <Wind size={16} className="text-gold" />,
  tv: <Tv size={16} className="text-gold" />,
  roomService: <UtensilsCrossed size={16} className="text-gold" />,
  balcony: <BedDouble size={16} className="text-gold" />,
  hotWater: <Bath size={16} className="text-gold" />,
};

const AmenityIcon = ({ amenity }: { amenity: keyof typeof iconMap }) => {
  return iconMap[amenity] || <HelpCircle size={16} className="text-gold" />;
};

interface Room {
  _id: string;
  name: string;
  category: string;
  description: string;
  guests: number;
  price: number;
  images: string[];
  rating?: number;
  size?: number;
  bed?: string;
  amenities?: string[];
  features?: string[];
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/${roomToDelete._id}`, {
        method: "DELETE",
      });
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room:", err);
    } finally {
      setIsDeleteConfirmOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleSaveRoom = async (roomData: Omit<Room, "_id">) => {
    try {
      const url = editingRoom
        ? `${API_BASE_URL}/rooms/${editingRoom._id}`
        : `${API_BASE_URL}/rooms`;

      const method = editingRoom ? "PUT" : "POST";

      const payload = {
        ...roomData,
        features: (roomData.features || []).map((f: any) => ({
          name: typeof f === 'string' ? f : (f.name || ""),
          icon: "Check"
        }))
      };

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save room details");
      
      const savedRoom = await res.json();
      
      if (editingRoom) {
        // Update only the edited item in the state
        setRooms((prev) => prev.map((r) => r._id === editingRoom._id ? savedRoom : r));
      } else {
        // Append new item to the list
        setRooms((prev) => [...prev, savedRoom]);
      }
    } catch (err) {
      console.error("Failed to save room:", err);
    } finally {
      setIsModalOpen(false);
      setEditingRoom(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Luxury Room Portfolio</h1>
          <p className="text-gray-400 text-xs mt-0.5">Manage details, amenities, pricing, and configurations of rooms.</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/15 transition-all text-xs hover:scale-[1.02]"
        >
          <Plus size={16} />
          Create Room
        </button>
      </div>

      {/* Grid of rooms */}
      {loading ? (
        <div className="py-24 text-center text-gray-400 text-xs">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
            <span>Fetching hotel rooms records...</span>
          </div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={handleEditRoom}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-sm">No Rooms Configured</h3>
          <p className="text-gray-400 text-xs mt-1">Get started by creating a new deluxe suite or room category.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <RoomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveRoom}
            room={editingRoom}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <DeleteConfirmationModal
            onConfirm={confirmDelete}
            onCancel={() => setIsDeleteConfirmOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const RoomCard = ({
  room,
  onEdit,
  onDelete,
}: {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}) => {
  return (
    <div
      onClick={() => onEdit(room)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Photo Container */}
        <div className="relative h-48 overflow-hidden bg-gray-50 border-b border-gray-50">
          <img
            src={
              room.images && room.images.length > 0
                ? room.images[0]
                : "https://placehold.co/600x400/F5EBDF/3A3022?text=Calm+Rest+Suite"
            }
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 bg-luxury-blue-950/80 backdrop-blur-md text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gold-500/20">
            {room.category}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-gray-800 tracking-tight leading-tight line-clamp-1">{room.name}</h3>
            {/* Stars Rating */}
            <div className="flex items-center gap-0.5 text-gold-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-bold text-gray-700">{room.rating || 5.0}</span>
            </div>
          </div>

          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]">
            {room.description || "No description provided. Luxury suite built to perfection."}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b border-gray-50 text-[11px] font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-gold" />
              <span>{room.guests} Max Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-gold" />
              <span>{room.size || 35} sqm Space</span>
            </div>
          </div>

          {/* Amenities pills */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {room.amenities.slice(0, 4).map((amen) => (
                <div
                  key={amen}
                  className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200/40 rounded-lg px-2 py-0.5 text-[9px] font-semibold text-gray-600 capitalize"
                >
                  <AmenityIcon amenity={amen as keyof typeof iconMap} />
                  <span>{amen.replace(/([A-Z])/g, " $1")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer pricing and actions */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Rate per night</span>
          <p className="text-lg font-black text-gray-800 leading-none mt-0.5">
            ${room.price}
            <span className="text-[10px] text-gray-400 font-semibold">/night</span>
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(room);
            }}
            className="p-2 hover:bg-gold-50 border border-transparent hover:border-gold-100 rounded-lg text-gray-500 hover:text-gold-700 transition-all"
            title="Edit Room"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(room);
            }}
            className="p-2 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-gray-500 hover:text-rose-600 transition-all"
            title="Delete Room"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ADD / EDIT MODAL COMPONENT ---
interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => void;
  room: Room | null;
}

const RoomModal = ({ isOpen, onClose, onSave, room }: RoomModalProps) => {
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [activeTab, setActiveTab] = useState<"general" | "amenities" | "media">("general");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    rating: 5,
    size: 30,
    guests: 2,
    bed: "King Bed",
    images: [] as string[],
    description: "",
    amenities: [] as string[],
    features: [] as string[],
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || "",
        category: room.category || "",
        price: room.price || 0,
        rating: room.rating || 5,
        size: room.size || 30,
        guests: room.guests || 2,
        bed: room.bed || "King Bed",
        images: room.images || [],
        description: room.description || "",
        amenities: room.amenities || [],
        features: (room.features || []).map((f: any) => typeof f === 'object' && f !== null ? (f.name || "") : String(f)),
      });
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Safety check for Checkbox input casting (amenities is handled in custom checkbox handler)
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.amenities || [];
      const updated = checked
        ? [...current, amenity]
        : current.filter((a) => a !== amenity);
      return { ...prev, amenities: updated };
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleUpload = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "camera", "url"],
          multiple: true,
          folder: "Rooms",
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const webpUrl = result.info.secure_url.replace(/\.[^/.]+$/, ".webp");
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, webpUrl],
            }));
          }
        }
      );
      widget.open();
    } else {
      alert("Cloudinary script not loaded yet. Make sure internet connection is active.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const allAmenities = [
    "wifi",
    "airConditioning",
    "tv",
    "roomService",
    "balcony",
    "hotWater",
  ];

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              {room ? "Edit Room Details" : "Create New Room Class"}
            </h2>
            <p className="text-gray-400 text-[10px]">Populate fields and update room catalog.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-100 px-6 py-2 bg-gray-50/50 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "general" ? "bg-gold text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            General Config
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("amenities")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "amenities" ? "bg-gold text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Amenities & Tags
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "media" ? "bg-gold text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Media Uploads ({formData.images.length})
          </button>
        </div>

        {/* Form Body Scroll container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-left">
          
          {activeTab === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Room Title / Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Deluxe Ocean View Suite"
                required
              />
              <InputField
                label="Category Description"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Luxury AC Suite"
                required
              />
              <InputField
                label="Rate per Night ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <InputField
                label="Size (sqm)"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g. 45"
              />
              <InputField
                label="Guests Limit"
                name="guests"
                type="number"
                value={formData.guests}
                onChange={handleChange}
              />
              <InputField
                label="Star Rating"
                name="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Bed Layout Description"
                  name="bed"
                  value={formData.bed}
                  onChange={handleChange}
                  placeholder="e.g. 1 King Bed & 1 Sofa Bed"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Overview / Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the rooms style, view, comfort features..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">Core Hotel Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2.5 p-3 border border-gray-100 hover:border-gold/30 rounded-xl cursor-pointer hover:bg-gold-50/10 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => handleAmenityToggle(amenity, e.target.checked)}
                        className="w-4 h-4 rounded text-gold focus:ring-gold border-gray-200"
                      />
                      <span className="text-xs font-semibold capitalize text-gray-600 flex items-center gap-1.5">
                        <AmenityIcon amenity={amenity as any} />
                        {amenity.replace(/([A-Z])/g, " $1")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">Custom Package Highlights</label>
                
                {/* Feature tags */}
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-700"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-gray-400 hover:text-rose-600"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g. Free airport shuttle transfer"
                    className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-luxury-blue-905 bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-gray-700 text-xs">Upload Room Photography</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 mb-4">Upload rich high resolution photos of the suite layout</p>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="bg-gold hover:bg-gold-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-gold/15 transition-all"
                >
                  Launch Upload Manager
                </button>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-3">Room Gallery Images</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-150 shadow-sm">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-sm rounded-lg text-rose-500 hover:text-rose-700 shadow-sm transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </form>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-250 bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-gold hover:bg-gold-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-gold/15 transition-all"
          >
            {room ? "Update Room Portfolio" : "Confirm & Save Room"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Input Field Utility component ---
const InputField: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.name} className="block text-xs font-bold text-gray-750 mb-1.5">
      {label}
    </label>
    <input
      id={props.name}
      {...props}
      className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all placeholder:text-gray-400"
    />
  </div>
);

// --- Delete Confirmation Modal ---
const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-150 shadow-2xl"
    >
      <div className="flex items-center gap-3 text-rose-600 mb-3">
        <div className="p-2 rounded-xl bg-rose-50">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-800">Confirm Deletion</h3>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed mb-6">
        Are you sure you want to remove this room from your active catalog? This action will permanently remove the room specification.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/10"
        >
          Delete Room
        </button>
      </div>
    </motion.div>
  </div>
);
