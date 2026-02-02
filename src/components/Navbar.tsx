"use client";

import Link from "next/link";
import { useAuth, logOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserDetailsModal } from "./UserDetailsModal";

export function Navbar() {
    const { user, loading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter gradient-text">
                    SelfUi
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground hover:text-primary">
                        Features
                    </Link>
                    <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground hover:text-primary">
                        About
                    </Link>
                    {user && (
                        <button
                            onClick={() => setShowUserModal(true)}
                            className="text-sm font-medium hover:text-primary transition-colors focus:outline-none text-muted-foreground"
                        >
                            Dashboard
                        </button>
                    )}

                    {!loading && (
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowUserModal(true)}
                                        className="flex items-center gap-2 pr-4 pl-1 py-1 rounded-full bg-muted/50 border border-border shadow-inner hover:bg-muted transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold opacity-70">
                                                    {user.displayName?.charAt(0) || "U"}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground hidden xl:inline-block max-w-[100px] truncate">
                                            {user.displayName?.split(" ")[0]}
                                        </span>
                                    </button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLogout}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button variant="default" size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-background/90 backdrop-blur-xl border-b border-border"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            <Link
                                href="/#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium p-2 hover:bg-muted rounded-lg text-foreground"
                            >
                                Features
                            </Link>
                            <Link
                                href="/#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium p-2 hover:bg-muted rounded-lg text-foreground"
                            >
                                About
                            </Link>
                            {!loading && !user && (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium p-2 text-primary"
                                >
                                    Sign In
                                </Link>
                            )}
                            {user && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowUserModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg text-left"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-lg font-medium p-2 text-destructive hover:bg-white/5 rounded-lg"
                                    >
                                        <LogOut className="w-5 h-5" /> Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <UserDetailsModal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                user={user}
            />
        </header>
    );
}
