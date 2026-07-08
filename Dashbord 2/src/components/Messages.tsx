import React, { useState, useEffect } from 'react';
import { User, Mail, MessageSquare, Trash2, CheckSquare, Reply, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

type Message = {
    _id: string;
    fullName: string;
    email: string;
    subject: string;
    createdAt: string;
    isRead?: boolean;
    message?: string;
};

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/messages`);
                if (!response.ok) {
                    const errorBody = await response.text();
                    console.error("Server responded with an error:", response.status, errorBody);
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const messageList = Array.isArray(data) ? data : data.data || [];
                setMessages(messageList);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const markAsRead = (id: string) => {
        setMessages(prev =>
            prev.map(m => m._id === id ? { ...m, isRead: true } : m)
        );
    };

    const confirmDelete = (msg: Message) => {
        setSelectedMessage(msg);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedMessage) return;
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${selectedMessage._id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (result.success) {
                setMessages(prev => prev.filter(m => m._id !== selectedMessage._id));
            } else {
                alert(result.error || "Failed to delete message.");
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message. Please try again.");
        } finally {
            setShowDeleteModal(false);
            setSelectedMessage(null);
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Title Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Guest Enquiries</h1>
                <p className="text-gray-400 text-xs mt-0.5">Read and reply to feedback and concierge queries from the portal.</p>
              </div>
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-12 text-center text-gray-400 text-xs">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        Loading messages...
                      </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 text-xs">
                        No enquiries or messages found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                onClick={() => markAsRead(message._id)}
                                className={`p-6 hover:bg-gray-50/50 transition-colors cursor-pointer relative ${
                                    !message.isRead ? 'bg-gold-50/10' : ''
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        
                                        {/* Avatar initials */}
                                        <div className="w-10 h-10 rounded-lg bg-gold-100/50 border border-gold-200/20 flex items-center justify-center text-gold-700 font-bold text-[11px] uppercase shadow-inner flex-shrink-0 mt-0.5">
                                            {message.fullName ? message.fullName[0] : "G"}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-gray-800">{message.fullName}</p>
                                                {!message.isRead && (
                                                    <span className="w-2 h-2 bg-gold rounded-full" title="New Message" />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                {message.email}
                                            </p>
                                            <p className="text-xs font-bold text-gray-700 mt-2">
                                                {message.subject || "No Subject"}
                                            </p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium pt-1 max-w-2xl whitespace-pre-line">
                                                {message.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold tracking-wider pt-2 block">
                                                {formatTimeAgo(message.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <div className="flex items-center gap-3 self-end sm:self-start">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `mailto:${message.email}?subject=RE: ${encodeURIComponent(message.subject || '')}`;
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-gold hover:text-gold-700 transition-colors"
                                        >
                                            <Reply className="w-3.5 h-3.5" />
                                            Reply
                                        </button>
                                        <div className="w-px h-3 bg-gray-200" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                confirmDelete(message);
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && selectedMessage && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-150 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 text-rose-600 mb-3">
                                <div className="p-2 rounded-xl bg-rose-50">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Delete Enquiry</h3>
                            </div>
                            
                            <p className="text-gray-500 text-xs leading-relaxed mb-6">
                                Are you sure you want to delete the enquiry from <strong className="text-gray-800 font-semibold">{selectedMessage.fullName}</strong>? This action cannot be undone.
                            </p>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-250 rounded-xl hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-500/10"
                                    onClick={handleDelete}
                                >
                                    Delete message
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
