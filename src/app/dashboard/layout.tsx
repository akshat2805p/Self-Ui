import { Sidebar } from "@/components/dashboard/Sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

            <Suspense fallback={<div className="w-16 h-screen bg-background border-r border-border" />}>
                <Sidebar />
            </Suspense>
            <main className="md:pl-16 pl-0 h-screen flex flex-col transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
