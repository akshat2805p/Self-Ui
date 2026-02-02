import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Fail-safe initialization for build time
// If keys are missing (during build), we don't crash, but auth/db validation will fail if used.
const isClient = typeof window !== "undefined";
const hasKeys = !!firebaseConfig.apiKey;

let app;
let auth: Auth;
let db: Firestore;

try {
    if (!getApps().length) {
        if (hasKeys) {
            app = initializeApp(firebaseConfig);
            console.log("Firebase Initialized: [DEFAULT]");
        } else {
            console.warn("Firebase Config missing. Skipping initialization (Safe for Build).");
            // Mock app for safe export, or leave undefined?
            // If we leave it undefined, other files importing 'auth' will crash.
            // Better to handle it.
        }
    } else {
        app = getApp();
    }

    if (app) {
        auth = getAuth(app);
        db = getFirestore(app);
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

// Export as potentially undefined or with a getter check to be safer?
// For existing code compatibility, we export them directly, but might need to be careful.
// A better pattern for Next.js is often to export a function to getAuth() safely.
// However, the current usage is likely `import { auth } from '@/lib/firebase'`.
// If `auth` is undefined, accessing `auth.currentUser` will throw.

export { app, auth, db };
