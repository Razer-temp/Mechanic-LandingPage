'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Wrench, LayoutDashboard, Calendar, Settings, LogOut, Menu, X, User } from 'lucide-react';
import clsx from 'clsx';
import { Navbar } from '@/components/ui/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-bg-void flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-bg-surface border-b border-border-subtle sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-text-primary font-heading font-extrabold text-lg">
                    <Wrench className="w-5 h-5 text-accent-base" />
                    <span>SmartBike</span>
                </Link>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-primary">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-bg-surface border-r border-border-subtle transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-border-subtle hidden md:block">
                    <Link href="/" className="flex items-center gap-2 text-text-primary font-heading font-extrabold text-xl tracking-tight">
                        <Wrench className="w-6 h-6 text-accent-base" />
                        <span>Smart<span className="text-accent-base">Bike</span> Pro</span>
                    </Link>
                </div>

                <div className="p-4 border-b border-border-subtle bg-bg-elevated/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-base flex items-center justify-center text-white font-bold text-lg">
                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-sm text-text-primary truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-accent-base/10 text-accent-base"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-accent-base" : "text-text-muted group-hover:text-text-primary")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border-subtle">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-bg-elevated hover:text-accent-red transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-accent-red" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scrollbar-hide">
                {children}
            </main>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
