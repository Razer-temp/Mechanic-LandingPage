'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench, LayoutDashboard, Calendar, Settings, LogOut, Menu, X, User } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, loading, signOut } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    const navItems = useMemo(() => [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ], []);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center animate-in fade-in duration-700">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin shadow-[0_0_20px_rgba(0,200,255,0.4)]"></div>
                </div>
                <p className="text-text-muted text-sm font-black tracking-[0.2em] uppercase animate-pulse">Establishing Secure Session...</p>
            </div>
        );
    }

    // Protection logic is also handled by middleware, but this ensures a clean UI transition
    if (!user) return null;

    return (
        <div className="min-h-screen bg-bg-void flex flex-col md:flex-row relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-accent-violet/5 blur-[100px] rounded-full" />
                <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent-red/5 blur-[150px] rounded-full opacity-50" />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-bg-surface/60 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-50">
                <Link href="/" className="nav-logo" style={{ fontSize: '1.1rem' }}>
                    <span className="logo-icon">
                        <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
                        </svg>
                    </span>
                    <span className="logo-text">Smart<span className="accent">Bike</span></span>
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-primary p-2 hover:bg-white/5 rounded-lg transition-colors">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-40 w-72 bg-bg-surface/80 backdrop-blur-[40px] border-r border-white/[0.05] transform transition-all duration-700 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] md:shadow-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 border-b border-white/[0.05] hidden md:block">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-grad-blue flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500 relative">
                            <div className="absolute inset-0 bg-white/20 blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight text-text-primary">Smart<span className="text-accent">Bike</span> Pro</span>
                    </Link>
                </div>

                <div className="p-6 border-b border-white/[0.05]">
                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-[24px] hover:bg-white/[0.04] transition-all cursor-pointer group hover:border-accent/20">
                        <div className="w-12 h-12 rounded-2xl bg-grad-blue flex items-center justify-center text-white font-black text-xl shadow-xl shadow-accent/10 group-hover:scale-105 transition-transform duration-500">
                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-sm text-text-primary truncate leading-tight group-hover:text-accent transition-colors">{profile?.full_name || 'My Account'}</p>
                            <p className="text-[10px] text-accent font-black mt-1 tracking-[0.2em] opacity-80 uppercase">Active Rider</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black transition-all group relative overflow-hidden uppercase tracking-[0.15em]",
                                    isActive
                                        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(0,200,255,0.05)]"
                                        : "text-text-muted hover:bg-white/[0.03] hover:text-text-primary border border-transparent"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-full shadow-[0_0_10px_rgba(0,200,255,0.6)]" />
                                )}
                                <item.icon className={clsx("w-5 h-5 transition-all duration-500", isActive ? "text-accent" : "text-text-muted group-hover:text-accent group-hover:rotate-6")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/[0.05] mt-auto">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black text-text-muted hover:bg-accent-red/5 hover:text-accent-red transition-all group uppercase tracking-[0.15em]"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto h-screen scrollbar-hide relative z-10 transition-all">
                <div className="max-w-[1240px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-md transition-all duration-500"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
