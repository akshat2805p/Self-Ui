"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
    const [projectName, setProjectName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        setIsCreating(true);

        // Simulate project creation delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Generate a random ID for the project
        const projectId = Math.random().toString(36).substring(7);

        // Save to local storage for persistence (mock backend)
        const newProject = {
            id: projectId,
            name: projectName,
            createdAt: Date.now()
        };

        try {
            const stored = localStorage.getItem("selfui_projects");
            const projects = stored ? JSON.parse(stored) : [];
            projects.unshift(newProject);
            localStorage.setItem("selfui_projects", JSON.stringify(projects));
        } catch (e) {
            console.error("Failed to save project", e);
        }

        // Navigate to the dashboard with the new project context
        router.push(`/dashboard?project=${projectId}&name=${encodeURIComponent(projectName)}`);

        setIsCreating(false);
        setProjectName("");
        onClose();
    };

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
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FolderPlus className="w-5 h-5 text-primary" />
                            New Project
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="p-6 flex flex-col gap-6">
                        <div className="space-y-2">
                            <label htmlFor="projectName" className="text-sm font-medium text-zinc-400">
                                Project Name
                            </label>
                            <input
                                id="projectName"
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="e.g., Marketing Landing Page"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:border-zinc-700"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isCreating}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!projectName.trim() || isCreating} className="min-w-[100px]">
                                {isCreating ? "Creating..." : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
