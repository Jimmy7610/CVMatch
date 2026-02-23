import { Outlet, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tight">CVMatch</Link>
                    <nav className="flex gap-4">
                        <Link to="/cv" className="text-sm font-medium hover:text-primary transition-colors">Mitt CV</Link>
                        <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">Jobb</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <Toaster />
        </div>
    );
}
