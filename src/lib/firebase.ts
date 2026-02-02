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
let auth: Auth | undefined;
let db: Firestore | undefined;

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

// Helper to prevent crashes if auth/db are accessed when not initialized
const createMockAuth = () => {
    return {
        currentUser: null,
        onAuthStateChanged: () => () => { },
        signInWithPopup: () => Promise.reject(new Error("Firebase not initialized")),
        // Add other methods if needed, casting to Auth
    } as unknown as Auth;
}

const createMockFirestore = () => {
    return {
        collection: () => {
            console.warn("Firestore not initialized. Using mock.");
            return {
                doc: () => ({
                    get: () => Promise.reject(new Error("Firestore not initialized")),
                    set: () => Promise.reject(new Error("Firestore not initialized")),
                    update: () => Promise.reject(new Error("Firestore not initialized")),
                    delete: () => Promise.reject(new Error("Firestore not initialized")),
                }),
                add: () => Promise.reject(new Error("Firestore not initialized")),
            };
        },
        // Add other Firestore methods if needed, casting to Firestore
    } as unknown as Firestore;
}

if (!auth) {
    auth = createMockAuth();
}

if (!db) {
    db = createMockFirestore();
}

export { app, auth, db };
