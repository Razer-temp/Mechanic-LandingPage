'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LayoutDashboard, Calendar, MessageSquare, LogOut, Search, Clock, MapPin, Phone, Bike, User } from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');
    const [bookings, setBookings] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Bookings
            const { data: bData } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch Chat Sessions
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
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        router.push('/admin/login');
    };

    const filteredBookings = bookings.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery) ||
        b.bike_model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050508] text-gray-200">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-[#0c0c16] border-r border-white/5 p-6 z-20">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00c8ff] to-[#a78bfa] rounded-lg flex items-center justify-center font-bold text-black">S</div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">SmartBike Admin</span>
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === 'bookings' ? "bg-[#00c8ff1a] text-[#00c8ff] border border-[#00c8ff33]" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        )}
                    >
                        <Calendar size={20} />
                        <span className="font-medium">Bookings</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('chats')}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === 'chats' ? "bg-[#00c8ff1a] text-[#00c8ff] border border-[#00c8ff33]" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        )}
                    >
                        <MessageSquare size={20} />
                        <span className="font-medium">AI Chats</span>
                    </button>
                </nav>

                <div className="absolute bottom-8 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ff2d55] hover:bg-[#ff2d551a] transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 bg-[#050508cc] backdrop-blur-md border-bottom border-white/5 px-8 py-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>

                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search customers, bikes..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:border-[#00c8ff] outline-none transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="p-8">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="w-10 h-10 border-4 border-[#00c8ff] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'bookings' ? (
                                <div className="grid gap-4">
                                    {filteredBookings.length > 0 ? (
                                        filteredBookings.map((b) => (
                                            <div key={b.id} className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 hover:border-[#00c8ff33] transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#a78bfa]">
                                                            <User size={24} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">{b.name}</h3>
                                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1"><Phone size={14} /> {b.phone}</span>
                                                                <span className="flex items-center gap-1"><Bike size={14} /> {b.bike_model}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={clsx(
                                                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                            b.status === 'pending' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                                                        )}>
                                                            {b.status}
                                                        </span>
                                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Clock size={12} /> {new Date(b.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Service</span>
                                                        <p className="text-sm font-medium">{b.service_type}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Location</span>
                                                        <p className="text-sm font-medium flex items-center gap-1">
                                                            {b.service_location === 'doorstep' ? <><MapPin size={12} className="text-[#ff2d55]" /> Doorstep</> : "Workshop"}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Schedule</span>
                                                        <p className="text-sm font-medium">{b.preferred_date} ({b.preferred_time})</p>
                                                    </div>
                                                    <div className="space-y-1 col-span-1">
                                                        <button className="text-[10px] text-[#00c8ff] hover:underline font-bold uppercase tracking-widest">Mark Confirmed</button>
                                                    </div>
                                                </div>

                                                {b.address && (
                                                    <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-gray-500 italic">
                                                        📍 Address: {b.address}
                                                    </div>
                                                )}
                                                {b.notes && (
                                                    <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-gray-400">
                                                        📝 Notes: {b.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-[#0c0c16] rounded-2xl border border-dashed border-white/10">
                                            <p className="text-gray-500">No bookings found matching your search.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {chats.length > 0 ? (
                                        chats.map((session) => (
                                            <div key={session.id} className="bg-[#0c0c16] border border-white/5 rounded-2xl overflow-hidden hover:border-[#a78bfa33] transition-all">
                                                <div className="p-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center text-xs">
                                                    <span className="text-gray-500">Session: {session.id.slice(0, 8)}...</span>
                                                    <span className="text-gray-600">{new Date(session.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    {session.chat_messages?.map((msg: any) => (
                                                        <div key={msg.id} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                                            <div className={clsx(
                                                                "max-w-[80%] p-3 rounded-2xl text-sm",
                                                                msg.role === 'user' ? "bg-[#00c8ff1a] text-[#00c8ff]" : "bg-white/5 text-gray-300"
                                                            )}>
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 bg-[#0c0c16] rounded-2xl border border-dashed border-white/10">
                                            <p className="text-gray-500">No chat logs found yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
        </div>
    );
}
