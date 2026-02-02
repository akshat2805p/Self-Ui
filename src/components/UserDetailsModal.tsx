"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any; // Using any for simplicity with Firebase user object, can be typed strictly
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                        <h2 className="text-xl font-semibold text-white">User Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-white/50" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-zinc-900" />
                        </div>

                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-bold text-white">{user?.displayName || "Anonymous User"}</h3>
                            <p className="text-zinc-400 text-sm">{user?.email}</p>
                        </div>

                        <div className="w-full grid gap-3 pt-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-zinc-400 text-sm">Account Status</span>
                                <span className="text-green-400 text-xs font-bold uppercase tracking-wider border border-green-400/20 bg-green-400/10 px-2 py-0.5 rounded">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={onClose}>
                            Close
                        </Button>
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full gap-2">
                                Go to Workspace <ExternalLink className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
