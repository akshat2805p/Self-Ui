"use client";

import { useState } from "react";
import { Loader2, Code, Eye, Copy, Check, FileCode, FileJson } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PreviewProps {
    code: string | null;
    isLoading: boolean;
}

type CodeTab = "html" | "react";

export function Preview({ code, isLoading }: PreviewProps) {
    const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
    const [codeTab, setCodeTab] = useState<CodeTab>("html");
    const [copied, setCopied] = useState(false);

    // Convert HTML to React-friendly JSX (basic heuristic)
    const getReactCode = (html: string) => {
        return html
            .replace(/class=/g, "className=")
            .replace(/for=/g, "htmlFor=")
            .replace(/<!--/g, "{/*")
            .replace(/-->/g, "*/}")
            .replace(/style="([^"]*)"/g, (match, styleString) => {
                // Very basic style object conversion (not perfect but helpful)
                // Skipping complex conversion for now to avoid breaking things, just keeping as string might warn in React but is readable.
                // React actually requires object for style. Let's just warn or leave it.
                // For this demo, let's just handle className which is 99% of Tailwind usage.
                return match;
            })
            // Void tags need closing slash in JSX if not present? Browsers handle it, but Prettier prefers it.
            // Keeping it simple.
            ;
    };

    const displayCode = codeTab === "react" && code ? getReactCode(code) : code;

    const handleCopy = () => {
        if (!displayCode) return;
        navigator.clipboard.writeText(displayCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 animate-pulse">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-purple-600" />
                <p>Gemini is Architecting your interface...</p>
            </div>
        );
    }

    if (!code) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 text-center">
                <div className="w-64 h-48 mb-6 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center">
                    <span className="text-4xl opacity-20">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Self-Evolving Canvas</h3>
                <p className="max-w-md text-zinc-400">
                    Ready to build. Describe any UI component, and Gemini will generate the code instantly.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full h-full overflow-hidden bg-zinc-950 relative rounded-t-3xl shadow-2xl border border-white/10 flex flex-col">
            {/* Toolbar */}
            <div className="h-14 bg-black/40 border-b border-white/10 flex items-center px-4 justify-between backdrop-blur-md">
                <div className="flex gap-1.5 md:opacity-100 opacity-0 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                {/* Main View Toggle */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "preview" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button
                        onClick={() => setViewMode("code")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "code" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}
                    >
                        <Code className="w-4 h-4" />
                        <span className="hidden sm:inline">Code</span>
                    </button>
                </div>

                {/* Copy Button (Always visible but context aware) */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 md:px-3 text-zinc-400 hover:text-white border border-white/5 hover:bg-white/10"
                    onClick={handleCopy}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-green-400 font-medium hidden sm:inline">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Copy {viewMode === 'code' ? (codeTab === 'react' ? 'JSX' : 'HTML') : 'HTML'}</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Sub-Toolbar for Code View */}
            {viewMode === "code" && (
                <div className="h-10 bg-zinc-900/50 border-b border-white/5 flex items-center px-4 gap-4">
                    <button
                        onClick={() => setCodeTab("html")}
                        className={`text-xs font-medium h-full border-b-2 flex items-center gap-2 px-2 transition-colors ${codeTab === "html" ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <FileCode className="w-3.5 h-3.5" /> HTML
                    </button>
                    <button
                        onClick={() => setCodeTab("react")}
                        className={`text-xs font-medium h-full border-b-2 flex items-center gap-2 px-2 transition-colors ${codeTab === "react" ? "border-blue-500 text-blue-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <FileCode className="w-3.5 h-3.5" /> React / JSX
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent bg-zinc-950">
                {viewMode === "preview" ? (
                    <div className="w-full h-full p-8 bg-black/20">
                        {/* Centered container for the preview to prevent full-width stretching if not needed, 
                             but user asked for 'responsive design' so full width is usually better. 
                             Adding a wrapper for isolation. */}
                        <div dangerouslySetInnerHTML={{ __html: code }} className="w-full h-full transition-all" />
                    </div>
                ) : (
                    <div className="p-4">
                        <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap break-all bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                            {displayCode}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
