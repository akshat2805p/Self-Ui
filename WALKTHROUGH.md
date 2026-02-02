# SelfUi Project Walkthrough

## 1. Project Overview
**SelfUi** is a Next.js application designed to generate frontend UI components using Google's Gemini AI. It features a modern, dashboard-style interface where users can describe an interface (e.g., "A login card with social buttons") and receive production-ready HTML and Tailwind CSS code.

## 2. Getting Started

### Prerequisites
- **Node.js**: Ensure Node.js is installed (Version 18+ recommended).
- **Gemini API Key**: You need a Google Gemini API Key. (Get it from Google AI Studio).

### Installation
1.  Open your terminal in the project directory:
    ```bash
    cd c:\Users\aksha\OneDrive\Desktop\SelfUi
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to:
    `http://localhost:3000`

### Setting the API Key
Two ways to set the key:
1.  **Environment Variable** (Recommended for Dev/Server):
    Edit `.env.local` and add:
    ```env
    GEMINI_API_KEY=your_key_here
    NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
    ```
2.  **In-App Settings** (Client-side):
    Go to "Settings" in the Dashboard and paste your key.

## 3. Vercel Deployment (Web)

To deploy this project to the web using Vercel:

1.  **Push to GitHub**: ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    -   Go to [Vercel Dashboard](https://vercel.com).
    -   Click "Add New..." -> "Project".
    -   Select your repository.
3.  **Configure Environment Variables**:
    -   In the Vercel project settings during import, add the following Environment Variables (copy from `.env.local`):
        -   `NEXT_PUBLIC_FIREBASE_API_KEY`
        -   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
        -   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        -   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
        -   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
        -   `NEXT_PUBLIC_FIREBASE_APP_ID`
        -   `NEXT_PUBLIC_GEMINI_API_KEY`
        -   `GEMINI_API_KEY`
    -   These are required for Authentication to work.
4.  **Deploy**: Click "Deploy".
    -   Once deployed, you will get a URL like `https://self-ui.vercel.app`.

## 4. Play Store (Android App)

This project uses **Capacitor** to turn the web app into a mobile app.

### Prerequisites
-   **Android Studio**: You must have Android Studio installed to build the APK/AAB.

### Steps to Build Android App
1.  **Build the Web Project**:
    ```bash
    npm run build
    ```

2.  **Sync Capacitor**:
    This copies your web build (`.next` or `out`) to the Android project.
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
    -   This will launch Android Studio.
    -   Wait for Gradle sync to finish.

4.  **Update App URL (Crucial)**:
    -   By default, Capacitor serves the *local* files. But your API route (`/api/generate`) requires a server (like Vercel).
    -   **Option A (Hybrid)**: Keep using local UI, but update `out`? Next.js API routes don't work in static export.
    -   **Option B (Wrapper - Recommended)**: Point the app to your Vercel URL.
        -   Open `capacitor.config.ts`.
        -   Change `server: { url: "https://your-vercel-url.app" }`.
        -   This makes the app load your live website.
    -   **Option C (Full Native + API)**: If you keep `server: { androidScheme: 'https' }`, you cannot use Next.js API routes. You must call the full URL `https://your-vercel-app.com/api/generate` in your frontend code (`src/lib/gemini.ts` or `DashboardContent`).
        -   *Current code calls `/api/generate` relative path.*
        -   **Action**: In `src/app/dashboard/page.tsx`, change `fetch("/api/generate")` to use a full URL config if on mobile.

5.  **Build APK**:
    -   In Android Studio, go to `Build` -> `Generate Signed Bundle / APK`.
    -   Select `APK` (for testing) or `Android App Bundle` (for Play Store).
    -   Follow the wizard to sign your app.
    -   Upload the `.aab` file to Google Play Console.

## 5. Troubleshooting
-   **Vulnerability Warnings**: Run `npm audit fix`.
-   **Build Errors**: Ensure TypeScript types are correct. If `npm run build` fails on API types, ensure strict null checks are handled.

### Fixing "Firebase: Error (auth/unauthorized-domain)"
If you see this error in your browser console, it means your current domain (e.g., `localhost`) is not allowed by Firebase.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (**SelfUi**).
3.  Go to **Authentication** -> **Settings** -> **Authorized Domains**.
4.  Click **Add Domain**.
5.  Add the following:
    -   `localhost`
    -   `127.0.0.1`
    -   `self-ui.vercel.app` (Your Vercel deployment URL)
6.  Save changes. The error should resolve immediately.
