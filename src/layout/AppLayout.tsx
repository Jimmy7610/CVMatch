import { Outlet, Link, NavLink } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { FileText, Briefcase } from "lucide-react";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold tracking-tight">CVMatch</Link>
                    <nav className="flex gap-6 h-full items-center">
                        <NavLink
                            to="/cv"
                            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors h-full border-b-2 pt-1 ${isActive ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}
                        >
                            <FileText className="h-4 w-4" /> Mitt CV
                        </NavLink>
                        <NavLink
                            to="/jobs"
                            className={({ isActive }) => `flex items-center gap-2 text-sm font-medium transition-colors h-full border-b-2 pt-1 ${isActive ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground border-transparent"}`}
                        >
                            <Briefcase className="h-4 w-4" /> Jobb
                        </NavLink>
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
