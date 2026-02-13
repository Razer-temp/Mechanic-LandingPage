'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    Calendar,
    MessageSquare,
    LogOut,
    Search,
    RefreshCcw,
    LayoutDashboard,
    ShieldCheck,
    Bell,
    X,
    Settings
} from 'lucide-react';
import clsx from 'clsx';

// Admin Components
import DashboardStats from '@/components/admin/DashboardStats';
import BookingsList from '@/components/admin/BookingsList';
import ChatLogs from '@/components/admin/ChatLogs';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');
    const [bookings, setBookings] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Auth Check
    useEffect(() => {
        const isAdmin = sessionStorage.getItem('admin_auth');
        if (isAdmin !== 'true') {
            router.push('/admin/login');
        } else {
            fetchData();
        }
    }, [router]);

    // Handle clicks outside of notification panel
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: bData } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            const { data: cData } = await supabase
                .from('chat_sessions')
                .select('*, chat_messages(*)')
                .order('created_at', { ascending: false });

            if (bData) setBookings(bData);
            if (cData) setChats(cData);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        }
        setLoading(false);
    }, [supabase]);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        router.push('/admin/login');
    };

    const filteredBookings = bookings.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.bike_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.service_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredChats = chats.filter(session =>
        session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.chat_messages?.some((m: any) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="flex min-h-screen bg-[#050508] text-[#eeeef2]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-[#0c0c16] border-r border-white/5 p-8 z-40 hidden xl:flex flex-col">
                <div className="flex items-center gap-4 mb-14">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#00c8ff] to-[#a78bfa] rounded-xl flex items-center justify-center shadow-lg shadow-[#00c8ff22]">
                        <ShieldCheck size={20} className="text-black" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-white leading-none tracking-tight">SMARTBIKE</span>
                        <span className="text-[10px] font-black text-[#00c8ff] uppercase tracking-[0.2em] mt-1">Command Center</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={clsx(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                            activeTab === 'bookings' ? "bg-[#00c8ff1a] text-[#00c8ff] shadow-sm shadow-[#00c8ff0a]" : "text-[#55556a] hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Calendar size={20} className={clsx("transition-transform group-hover:scale-110", activeTab === 'bookings' ? "text-[#00c8ff]" : "")} />
                        <span>Reservations</span>
                        {pendingCount > 0 && activeTab !== 'bookings' && (
                            <span className="ml-auto w-5 h-5 bg-[#00c8ff] text-black text-[10px] rounded-full flex items-center justify-center font-black">
                                {pendingCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('chats')}
                        className={clsx(
                            "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                            activeTab === 'chats' ? "bg-[#a78bfa1a] text-[#a78bfa] shadow-sm shadow-[#a78bfa0a]" : "text-[#55556a] hover:text-white hover:bg-white/5"
                        )}
                    >
                        <MessageSquare size={20} className={clsx("transition-transform group-hover:scale-110", activeTab === 'chats' ? "text-[#a78bfa]" : "")} />
                        <span>AI Interaction</span>
                    </button>
                </nav>

                <div className="pt-8 border-t border-white/5 space-y-4">
                    <button className="w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-[#55556a] hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[#ff2d55] hover:bg-[#ff2d550a] transition-all group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Terminate</span>
                    </button>
                </div>
            </aside>

            {/* Main Container */}
            <main className="flex-1 xl:pl-72 flex flex-col min-h-screen">
                {/* Top Navbar */}
                <header className="sticky top-0 bg-[#050508]/90 backdrop-blur-2xl border-b border-white/5 px-6 xl:px-12 py-5 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight">
                            {activeTab === 'bookings' ? 'System Bookings' : 'Intelligence Logs'}
                        </h2>
                        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block"></div>
                        <p className="text-[#8888a0] text-sm font-bold hidden sm:block">
                            {loading ? 'SYNCING...' : `${activeTab === 'bookings' ? bookings.length : chats.length} RECORDS`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className="bg-[#0c0c16] border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:border-[#00c8ff33] focus:ring-4 focus:ring-[#00c8ff05] outline-none transition-all text-sm w-64 lg:w-96 text-white font-semibold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-[#eeeef2] border border-white/5"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={20} className={clsx(loading && "animate-spin")} />
                        </button>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={clsx(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all relative border",
                                    showNotifications ? "bg-[#ff2d5533] border-[#ff2d5533] text-[#ff2d55]" : "bg-white/5 border-white/5 text-[#55556a] hover:text-[#ff2d55]"
                                )}
                            >
                                <Bell size={22} />
                                {pendingCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff2d55] rounded-full ring-4 ring-[#050508]"></span>}
                            </button>

                            {/* Notification Panel */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-80 bg-[#10101e] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-admin-in">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Alerts</h4>
                                        <button onClick={() => setShowNotifications(false)} className="text-[#55556a] hover:text-white">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                                        {pendingCount > 0 ? (
                                            bookings.filter(b => b.status === 'pending').map(b => (
                                                <div key={b.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#00c8ff33] transition-all cursor-pointer" onClick={() => { setActiveTab('bookings'); setShowNotifications(false); }}>
                                                    <p className="text-xs font-bold text-white">{b.name}</p>
                                                    <p className="text-[10px] text-[#8888a0] mt-1">Pending approval for {b.bike_model}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center py-8 text-[#55556a] text-xs font-bold italic">No active alerts</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="px-6 xl:px-12 py-8 xl:py-12 space-y-12">
                    {activeTab === 'bookings' && (
                        <>
                            <DashboardStats bookings={bookings} onTabChange={setActiveTab} />

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-[#00c8ff] rounded-full"></div>
                                        Deployment Queue
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-[#8888a0] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div> Pending</span>
                                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#00c8ff] rounded-full"></div> Confirmed</span>
                                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#34d399] rounded-full"></div> Completed</span>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-40">
                                        <div className="w-12 h-12 border-4 border-[#00c8ff]/20 border-t-[#00c8ff] rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <BookingsList bookings={filteredBookings} onUpdate={fetchData} />
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'chats' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-[#a78bfa] rounded-full"></div>
                                    Intelligence Logs
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-40">
                                    <div className="w-12 h-12 border-4 border-[#a78bfa]/20 border-t-[#a78bfa] rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <ChatLogs sessions={filteredChats} />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
