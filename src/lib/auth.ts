"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    onAuthStateChanged,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    Auth
} from "firebase/auth";
import { auth } from "./firebase";
import { useEffect, useState } from "react";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    console.log("Attempting Google Sign In...");
    try {
        const result = await signInWithPopup(auth as Auth, provider);
        return result.user;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
            console.warn("Popup blocked/closed, falling back to redirect...");
            try {
                await signInWithRedirect(auth as Auth, provider);
                return null;
            } catch (redirectError) {
                console.error("Error signing in with Redirect", redirectError);
                throw redirectError;
            }
        }
        console.error("Error signing in with Google", err);
        throw err;
    }
};

export const signUpWithEmail = async (email: string, pass: string) => {
    try {
        const result = await createUserWithEmailAndPassword(auth as Auth, email, pass);
        return result.user;
    } catch (error) {
        console.error("Error signing up", error);
        throw error;
    }
};

export const signInWithEmail = async (email: string, pass: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth as Auth, email, pass);
        return result.user;
    } catch (error) {
        console.error("Error signing in with email", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth as Auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !auth.onAuthStateChanged) {
            console.warn("Auth not initialized, skipping listener");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
};
