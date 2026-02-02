"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Settings as SettingsIcon, Key, User, Moon, Sun, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState("general");
    const [apiKey, setApiKey] = useState("");
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const storedKey = localStorage.getItem("manual_gemini_api_key");
        if (storedKey) setApiKey(storedKey);

        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    const handleSave = () => {
        if (apiKey) {
            localStorage.setItem("manual_gemini_api_key", apiKey);
        } else {
            localStorage.removeItem("manual_gemini_api_key");
        }
        onClose();
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: <SettingsIcon className="w-4 h-4" /> },
        { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
        { id: "api", label: "API", icon: <Key className="w-4 h-4" /> },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] text-foreground"
                >
                    {/* Sidebar */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/20 p-6 flex flex-col gap-2">
                        <h2 className="text-xl font-bold mb-6 px-2">Settings</h2>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col min-w-0 bg-background">
                        <div className="flex items-center justify-end p-4">
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-0">
                            {/* GENERAL TAB */}
                            {activeTab === "general" && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Appearance</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleThemeChange("dark")}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === "dark"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-muted-foreground/50"
                                                    }`}
                                            >
                                                <Moon className="w-6 h-6 text-indigo-400" />
                                                <span className="text-sm font-medium">Dark Mode</span>
                                                {theme === "dark" && <Check className="w-4 h-4 text-primary" />}
                                            </button>
                                            <button
                                                onClick={() => handleThemeChange("light")}
                                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === "light"
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-muted-foreground/50"
                                                    }`}
                                            >
                                                <Sun className="w-6 h-6 text-amber-500" />
                                                <span className="text-sm font-medium">Light Mode</span>
                                                {theme === "light" && <Check className="w-4 h-4 text-primary" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* API TAB */}
                            {activeTab === "api" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Gemini API Configuration</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            SelfUi uses the Google Gemini API. Usually this is configured by the environment, but you can override it here.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Custom API Key</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="password"
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    placeholder="sk-..."
                                                    className="w-full bg-input border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Your key is stored locally in your browser and never sent to our servers.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ACCOUNT TAB */}
                            {activeTab === "account" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">My Account</h3>
                                        <div className="flex items-center gap-4 mt-6 p-4 bg-muted/20 rounded-2xl border border-border">
                                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                {user?.photoURL ? (
                                                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold opacity-50">{user?.email?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{user?.displayName || "User"}</h4>
                                                <p className="text-muted-foreground text-sm">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3 md:rounded-br-2xl">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
