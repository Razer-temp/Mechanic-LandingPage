'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Wrench, LayoutDashboard, Calendar, Settings, LogOut, Menu, X, User } from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();

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

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-bg-void flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-bg-surface/80 backdrop-blur-xl border-b border-border-subtle sticky top-0 z-50">
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
                "fixed inset-y-0 left-0 z-40 w-72 bg-bg-surface/95 backdrop-blur-3xl border-r border-white/[0.05] transform transition-all duration-700 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] md:shadow-none",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 border-b border-white/[0.05] hidden md:block">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-grad-blue flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight text-text-primary">Smart<span className="text-accent">Bike</span> Pro</span>
                    </Link>
                </div>

                <div className="p-6 border-b border-white/[0.05]">
                    <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.05] rounded-[24px] hover:bg-white/[0.05] transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-grad-blue flex items-center justify-center text-white font-black text-xl shadow-xl shadow-accent/20 group-hover:scale-105 transition-transform duration-500">
                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-black text-sm text-text-primary truncate leading-tight">{profile?.full_name || 'My Account'}</p>
                            <p className="text-[10px] text-text-muted truncate uppercase tracking-[0.2em] font-black mt-1">PRO MEMBER</p>
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
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all group relative overflow-hidden uppercase tracking-widest",
                                    isActive
                                        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(0,200,255,0.1)]"
                                        : "text-text-muted hover:bg-white/[0.04] hover:text-text-primary border border-transparent"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(0,200,255,0.8)]" />
                                )}
                                <item.icon className={clsx("w-5 h-5 transition-transform duration-500", isActive ? "text-accent scale-110" : "text-text-muted group-hover:text-text-primary group-hover:rotate-12")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/[0.05] mt-auto">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black text-text-muted hover:bg-accent-red/10 hover:text-accent-red transition-all group uppercase tracking-widest"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto h-screen scrollbar-hide relative">
                {/* Decorative Background for Dashboard Content */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-violet/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-md transition-all duration-500"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
