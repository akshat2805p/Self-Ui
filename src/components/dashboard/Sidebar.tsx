"use client";

import { Button } from "@/components/ui/Button";
import { History, LayoutDashboard, Settings, LogOut, Plus, Trash2, Menu, X, MessageSquare } from "lucide-react";
import { useAuth, logOut } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { SettingsModal } from "./SettingsModal";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, if not I'll use template literals

interface Project {
    id: string;
    name: string;
    createdAt: number;
}

interface HistoryItem {
    id: string;
    prompt: string;
    timestamp: number;
    code: string; // Storing code might be heavy, maybe just store prompt + metadata and re-fetch or store snippet? 
    // User wants "keep a record of all the things". Storing code in LS is fine for a demo/MVP.
}

export function Sidebar() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentProjectId = searchParams.get("project");
    const currentHistoryId = searchParams.get("history");

    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Load Projects
        const storedProjects = localStorage.getItem("selfui_projects");
        if (storedProjects) {
            try {
                setProjects(JSON.parse(storedProjects));
            } catch (e) {
                console.error("Failed to parse projects", e);
            }
        }

        // Load History
        const storedHistory = localStorage.getItem("selfui_history");
        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Listen for storage events to update history if it changes elsewhere (like after generation)
    // Or we can rely on page reload? Better to expose a way to refresh.
    // For now, simple polling or just assume it loads on mount is okay, but user wants "record".
    // I'll add a listener.
    useEffect(() => {
        const handleStorageChange = () => {
            const storedHistory = localStorage.getItem("selfui_history");
            if (storedHistory) setHistory(JSON.parse(storedHistory));
        };

        window.addEventListener("storage", handleStorageChange);
        // Custom event for same-window updates
        window.addEventListener("selfui_history_update", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("selfui_history_update", handleStorageChange);
        };
    }, []);


    const saveProjects = (newProjects: Project[]) => {
        setProjects(newProjects);
        localStorage.setItem("selfui_projects", JSON.stringify(newProjects));
    };

    const saveHistory = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
        localStorage.setItem("selfui_history", JSON.stringify(newHistory));
    }

    const handleDeleteProject = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this project?")) {
            const updated = projects.filter(p => p.id !== id);
            saveProjects(updated);
            if (currentProjectId === id) router.push("/dashboard");
        }
    };

    const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Delete this history item?")) {
            const updated = history.filter(h => h.id !== id);
            saveHistory(updated);
            if (currentHistoryId === id) router.push("/dashboard");
        }
    }

    const handleNewProjectCreated = () => {
        setTimeout(() => {
            const stored = localStorage.getItem("selfui_projects");
            if (stored) setProjects(JSON.parse(stored));
        }, 500);
    };

    const handleLogout = async () => {
        await logOut();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Toggle Button (Visible only on mobile) */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-background border border-border rounded-lg shadow-sm"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen bg-background border-r border-border z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
                    md:translate-x-0 md:w-16 md:hover:w-64
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-4 h-16 mb-4 mt-2 cursor-pointer overflow-hidden whitespace-nowrap" onClick={() => router.push("/dashboard")}>
                    <div className="min-w-[32px] w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-bold text-lg tracking-tight text-foreground transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0 md:opacity-0"}`}>
                        SelfUi
                    </span>
                </div>

                {/* New Project Button */}
                <div className="px-2 mb-6">
                    <Button
                        className={`w-full justify-start gap-2 bg-muted/50 border border-border hover:bg-muted text-foreground overflow-hidden whitespace-nowrap px-0 pl-2 ${isHovered || isMobileOpen ? "px-4" : ""}`}
                        variant="ghost"
                        onClick={() => setIsNewProjectModalOpen(true)}
                    >
                        <Plus className="min-w-[16px] w-4 h-4" />
                        <span className={`transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0"}`}>
                            New Project
                        </span>
                    </Button>
                </div>

                {/* Projects List */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 px-2 scrollbar-hide">
                    <div className={`px-2 text-xs font-semibold text-muted-foreground mb-2 transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0 hidden md:block"}`}>
                        PROJECTS
                    </div>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className={`group flex items-center justify-between w-full p-2 rounded-lg text-sm transition-colors cursor-pointer overflow-hidden ${currentProjectId === project.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            onClick={() => {
                                router.push(`/dashboard?project=${project.id}&name=${encodeURIComponent(project.name)}`);
                                setIsMobileOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                                <History className="min-w-[16px] w-4 h-4 flex-shrink-0" />
                                <span className={`truncate transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0"}`}>
                                    {project.name}
                                </span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteProject(e, project.id)}
                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all ${isHovered || isMobileOpen ? "" : "hidden"}`}
                                title="Delete Project"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Divider */}
                    <div className="my-4 border-t border-border/50 mx-2" />

                    {/* History List */}
                    <div className={`px-2 text-xs font-semibold text-muted-foreground mb-2 transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0 hidden md:block"}`}>
                        HISTORY
                    </div>
                    {history.length === 0 && (isHovered || isMobileOpen) && (
                        <div className="px-4 text-xs text-muted-foreground italic">No history yet.</div>
                    )}
                    {history.slice(0, 10).map((item) => (
                        <div
                            key={item.id}
                            className={`group flex items-center justify-between w-full p-2 rounded-lg text-sm transition-colors cursor-pointer overflow-hidden ${currentHistoryId === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                            onClick={() => {
                                router.push(`/dashboard?history=${item.id}`);
                                setIsMobileOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                                <MessageSquare className="min-w-[16px] w-4 h-4 flex-shrink-0" />
                                <span className={`truncate transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0"}`}>
                                    {item.prompt.substring(0, 20)}...
                                </span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteHistory(e, item.id)}
                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all ${isHovered || isMobileOpen ? "" : "hidden"}`}
                                title="Delete"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-4 border-t border-border space-y-2 p-2">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 h-9 text-muted-foreground hover:text-foreground hover:bg-muted overflow-hidden whitespace-nowrap px-0 pl-2 ${isHovered || isMobileOpen ? "px-2" : ""}`}
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings className="min-w-[16px] w-4 h-4" />
                        <span className={`transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0"}`}>Settings</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-2 h-9 text-destructive hover:text-destructive hover:bg-destructive/10 overflow-hidden whitespace-nowrap px-0 pl-2 ${isHovered || isMobileOpen ? "px-2" : ""}`}
                        onClick={handleLogout}
                    >
                        <LogOut className="min-w-[16px] w-4 h-4" />
                        <span className={`transition-opacity duration-200 ${isHovered || isMobileOpen ? "opacity-100" : "opacity-0"}`}>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => {
                    setIsNewProjectModalOpen(false);
                    handleNewProjectCreated();
                }}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />
        </>
    );
}
