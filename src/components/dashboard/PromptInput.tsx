"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Send, Sparkles, Mic } from "lucide-react";

interface PromptInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export function PromptInput({ onSendMessage, isLoading }: PromptInputProps) {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;
        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        setIsListening(true);

        recognition.onstart = () => {
            console.log("Listening...");
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? " " : "") + transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') {
                console.warn("No speech detected.");
                // Ensure we don't block the UI, but maybe don't stop strictly if continuous?
                // For this simple implementation, we just stop.
                setIsListening(false);
                return;
            }
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            alert("Microphone error: " + event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };


    return (
        <div className="w-full max-w-3xl mx-auto relative px-4">
            <motion.div
                layout
                animate={{
                    height: isFocused || input ? "auto" : "3.5rem",
                    boxShadow: isFocused ? "0 0 40px -10px rgba(124, 58, 237, 0.3)" : "none",
                }}
                className={`
            relative z-20 overflow-hidden rounded-2xl border transition-colors duration-200
            ${isFocused ? "border-purple-500/50 bg-black/80" : "border-white/10 bg-white/5"}
            backdrop-blur-xl
        `}
            >
                <div className="flex items-end gap-2 p-2">
                    <div className={`p-2 rounded-xl transition-colors ${isFocused ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground"}`}>
                        <Sparkles className="w-5 h-5" />
                    </div>

                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Listening..." : "Describe the UI you want to build..."}
                        className="flex-1 bg-transparent border-0 focus:ring-0 resize-none max-h-40 min-h-[1.5rem] py-2 text-sm md:text-base scrollbar-hide placeholder:text-muted-foreground/50"
                        rows={1}
                        style={{ height: "auto" }}
                    />

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className={`h-8 w-8 transition-colors ${isListening ? "text-red-500 bg-red-500/10 animate-pulse" : "text-muted-foreground hover:text-white"}`}
                            onClick={toggleListening}
                        >
                            <Mic className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            className={`h-8 w-8 transition-all ${input.trim() ? "bg-purple-600 hover:bg-purple-500" : "bg-white/10 hover:bg-white/20 text-muted-foreground"}`}
                            onClick={handleSubmit}
                            disabled={isLoading || !input.trim()}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Glow Effect */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-xl rounded-2xl"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
