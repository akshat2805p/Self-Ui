"use client";

import { useState, useEffect, Suspense } from "react";
import { PromptInput } from "@/components/dashboard/PromptInput";
import { Preview } from "@/components/dashboard/Preview";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const historyId = searchParams.get("history");
        const projectId = searchParams.get("project");
        const projectName = searchParams.get("name");

        if (projectId) {
            // New Project Mode
            setGeneratedCode(`<div class="flex items-center justify-center p-10 h-full">
    <div class="text-center space-y-4">
        <div class="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto border border-border">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/><line x1="12" y1="12" x2="3.27 6.96"/><line x1="12" y1="12" x2="20.73 6.96"/></svg>
        </div>
        <div>
            <h2 class="text-2xl font-bold text-foreground">${projectName || "New Project"}</h2>
            <p class="text-muted-foreground max-w-sm mx-auto">Ready to build. Describe your interface below to get started.</p>
        </div>
    </div>
</div>`);
        } else if (historyId) {
            // Load from History
            const storedHistory = JSON.parse(localStorage.getItem("selfui_history") || "[]");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const item = storedHistory.find((h: any) => h.id === historyId);
            if (item) {
                setGeneratedCode(item.code);
            } else {
                setGeneratedCode(`<div class="flex items-center justify-center p-10 h-full text-muted-foreground">History item not found.</div>`);
            }
        } else {
            setGeneratedCode(null);
        }
    }, [searchParams]);

    const handleGenerate = async (prompt: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const customKey = localStorage.getItem("manual_gemini_api_key");
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-custom-api-key": customKey || ""
                },
                body: JSON.stringify({ prompt }),
            });

            // Improved Error Handling reading JSON
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details || "Generation failed");
            }

            setGeneratedCode(data.code);

            // Save to History
            try {
                const newHistoryItem = {
                    id: Date.now().toString(),
                    prompt,
                    code: data.code,
                    timestamp: Date.now()
                };
                const existingHistory = JSON.parse(localStorage.getItem("selfui_history") || "[]");
                const updatedHistory = [newHistoryItem, ...existingHistory];
                localStorage.setItem("selfui_history", JSON.stringify(updatedHistory));
                // Dispatch event to update sidebar
                window.dispatchEvent(new Event("selfui_history_update"));
            } catch (e) {
                console.error("Failed to save history", e);
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            console.error(err);
            setError(err.message || "Failed to generate UI. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative" suppressHydrationWarning>
            <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold opacity-80 text-foreground">Workspace</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium text-green-500">Active</span>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center justify-between"
                    >
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="hover:opacity-75">
                            ✕
                        </button>
                    </motion.div>
                )}

                {/* Canvas / Preview */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <Preview code={generatedCode} isLoading={isLoading} />
                </div>

                {/* Input Area */}
                <div className="pb-4 pt-2">
                    <PromptInput onSendMessage={handleGenerate} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="text-foreground p-10">Loading Workspace...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
