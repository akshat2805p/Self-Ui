"use client";

import Image from "next/image";
import { signInWithGoogle, signUpWithEmail, signInWithEmail, useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signInWithGoogle();
        } catch (err: any) {
            if (err?.code !== 'auth/popup-blocked' && err?.code !== 'auth/popup-closed-by-user') {
                setError(err.message || "Google sign in failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            // Router redirect handled by useEffect
        } catch (err: any) {
            setError(err.message || "Authentication failed");
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-black text-white">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[400px]">
                <Card className="flex flex-col items-center p-8 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-white">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto text-center">
                        {isSignUp ? "Join the Self-Evolving Grid." : "Sign in to the Self-Evolving Grid."}
                    </p>

                    <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                            required
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-transform hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                                isSignUp ? "Sign Up" : "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="relative w-full mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-zinc-500">Or continue with</span></div>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-3"
                    >
                        <Image
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        <span>Google</span>
                    </Button>

                    <div className="mt-6 text-sm text-zinc-400">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-purple-400 hover:text-purple-300 font-semibold hover:underline"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>

                    {error && (
                        <p className="mt-6 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 w-full text-center">
                            {error}
                        </p>
                    )}
                </Card>
            </div>
        </main>
    );
}
