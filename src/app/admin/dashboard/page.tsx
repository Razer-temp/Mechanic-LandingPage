'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
    Settings,
    Users,
    Bike,
    BarChart3,
    ChevronRight,
    Zap,
    IndianRupee,
    BrainCircuit
} from 'lucide-react';
import clsx from 'clsx';

// Admin Components
import DashboardStats from '@/components/admin/DashboardStats';
import BookingsList from '@/components/admin/BookingsList';
import CustomersList from '@/components/admin/CustomersList';
import IntelligenceLogs from '@/components/admin/IntelligenceLogs';
import SettingsPanel from '@/components/admin/SettingsPanel';
import RevenueAnalytics from '@/components/admin/RevenueAnalytics';
import VehicleHistory from '@/components/admin/VehicleHistory';

type AdminTab = 'bookings' | 'chats' | 'customers' | 'settings' | 'fleet' | 'reports';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
    const [bookings, setBookings] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [diagnoses, setDiagnoses] = useState<any[]>([]);
    const [estimates, setEstimates] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [serviceHistory, setServiceHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState<'chats' | 'diagnoses' | 'estimates'>('chats');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
    const [accentColor, setAccentColor] = useState('#00c8ff');



    const notificationRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Sync Global Theme Accent
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('admin_settings')
                    .select('*');

                if (data) {
                    data.forEach(setting => {
                        if (setting.key === 'theme_color') {
                            const color = setting.value as string;
                            setAccentColor(color);
                            localStorage.setItem('admin_theme_color', color);
                            document.documentElement.style.setProperty('--admin-accent', color);
                        }
                    });
                } else {
                    // Fallback
                    const color = localStorage.getItem('admin_theme_color') || '#00c8ff';
                    setAccentColor(color);
                    document.documentElement.style.setProperty('--admin-accent', color);
                }
            } catch (err) {
                console.error('Error fetching theme:', err);
            }
        };
        fetchSettings();
    }, [supabase]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [bRes, cRes, eRes, shRes, dRes, estRes] = await Promise.all([
                supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                supabase.from('chat_sessions').select('*, chat_messages(*)').order('created_at', { ascending: false }),
                supabase.from('daily_expenses').select('*').order('date', { ascending: false }),
                supabase.from('service_history').select('*').order('date', { ascending: false }),
                supabase.from('ai_diagnoses' as any).select('*').order('created_at', { ascending: false }),
                supabase.from('ai_estimates' as any).select('*').order('created_at', { ascending: false }),
            ]);

            if (dRes.error) console.error('AI Diagnoses Fetch Error:', dRes.error);
            if (estRes.error) console.error('AI Estimates Fetch Error:', estRes.error);

            console.log('Admin Data Fetch Results:', {
                bookings: bRes.data?.length || 0,
                chats: cRes.data?.length || 0,
                diagnoses: dRes.data?.length || 0,
                estimates: estRes.data?.length || 0
            });

            if (bRes.data) setBookings(bRes.data);
            if (cRes.data) setChats(cRes.data);
            if (eRes.data) setExpenses(eRes.data);
            if (shRes.data) setServiceHistory(shRes.data);
            if (dRes.data) setDiagnoses(dRes.data);
            if (estRes.data) setEstimates(estRes.data);
        } catch (err: any) {
            console.error('CRITICAL: Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    // Auth Check
    useEffect(() => {
        const isAdmin = sessionStorage.getItem('admin_auth');
        if (isAdmin !== 'true') {
            router.push('/admin/login');
        } else {
            fetchData();
        }
    }, [router, fetchData]);

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        router.push('/admin/login');
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.phone.includes(searchQuery) ||
                b.bike_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.service_type.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = bookingFilter === 'all' || b.status === bookingFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchQuery, bookingFilter]);

    const filteredChats = chats.filter(session =>
        session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.chat_messages?.some((m: any) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleExplore = (type: string) => {
        if (type === 'all_bookings') {
            setActiveTab('bookings');
            setBookingFilter('all');
        } else if (type === 'pending') {
            setActiveTab('bookings');
            setBookingFilter('pending');
        } else if (type === 'revenue') {
            setActiveTab('reports');
        } else if (type === 'customers') {
            setActiveTab('customers');
        }
    };






    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-4 mb-14">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#00c8ff] to-[#a78bfa] rounded-xl flex items-center justify-center shadow-lg shadow-[#00c8ff22]">
                    <ShieldCheck size={20} className="text-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-black text-white leading-none tracking-tight uppercase">SmartBike</span>
                    <span className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.3em] mt-1">Terminal DX</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] ml-4 mb-4 text-left">Operations</p>

                <button
                    onClick={() => { setActiveTab('bookings'); setBookingFilter('all'); setShowMobileMenu(false); }}
                    className={clsx(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                        activeTab === 'bookings' ? "bg-[#00c8ff1a] text-[var(--admin-accent)] shadow-sm" : "text-[#55556a] hover:text-white hover:bg-white/5"
                    )}
                >
                    <Calendar size={20} className={activeTab === 'bookings' ? "text-[var(--admin-accent)]" : ""} />
                    <span>Reservations</span>
                    {pendingCount > 0 && activeTab !== 'bookings' && (
                        <span className="ml-auto w-5 h-5 bg-[#00c8ff] text-black text-[10px] rounded-full flex items-center justify-center font-black">
                            {pendingCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => { setActiveTab('customers'); setShowMobileMenu(false); }}
                    className={clsx(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                        activeTab === 'customers' ? "bg-[#34d3991a] text-[#34d399] shadow-sm" : "text-[#55556a] hover:text-white hover:bg-white/5"
                    )}
                >
                    <Users size={20} className={activeTab === 'customers' ? "text-[#34d399]" : ""} />
                    <span>Market Database</span>
                </button>

                <button
                    onClick={() => { setActiveTab('fleet'); setShowMobileMenu(false); }}
                    className={clsx(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                        activeTab === 'fleet' ? "bg-[#fbbf241a] text-[#fbbf24] shadow-sm" : "text-[#55556a] hover:text-white hover:bg-white/5"
                    )}
                >
                    <Bike size={20} className={activeTab === 'fleet' ? "text-[#fbbf24]" : ""} />
                    <span>Garage Hub</span>
                </button>

                <div className="h-4"></div>
                <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] ml-4 mb-4 text-left">Intelligence</p>

                <div className={clsx(
                    "w-full flex flex-col gap-2 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                    activeTab === 'chats' ? "bg-[#a78bfa1a] text-[#a78bfa] shadow-sm" : "text-[#55556a] hover:text-white hover:bg-white/5"
                )}>
                    <button
                        onClick={() => { setActiveTab('chats'); setActiveSubTab('chats'); setShowMobileMenu(false); }}
                        className={clsx(
                            "w-full flex items-center gap-4 font-bold transition-all duration-300 group",
                            activeTab === 'chats' ? "text-[#a78bfa]" : "text-[#55556a] hover:text-white"
                        )}
                    >
                        <div className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            activeTab === 'chats' ? "bg-[#a78bfa] text-black shadow-lg" : "bg-white/5 text-[#55556a]"
                        )}>
                            <BrainCircuit size={20} />
                        </div>
                        <span>Intelligence Hub</span>
                    </button>
                    {activeTab === 'chats' && (
                        <div className="flex flex-col gap-2 pl-14 pt-2">
                            <button
                                onClick={() => setActiveSubTab('chats')}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeSubTab === 'chats' ? "bg-[#a78bfa] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                                )}
                            >
                                Neural Logs
                                <span className={clsx("px-1.5 py-0.5 rounded-md text-[10px]", activeSubTab === 'chats' ? "bg-black/20" : "bg-white/5")}>
                                    {chats.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveSubTab('diagnoses')}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeSubTab === 'diagnoses' ? "bg-[#00c8ff] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                                )}
                            >
                                Diagnoses
                                <span className={clsx("px-1.5 py-0.5 rounded-md text-[10px]", activeSubTab === 'diagnoses' ? "bg-black/20" : "bg-white/5")}>
                                    {diagnoses.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveSubTab('estimates')}
                                className={clsx(
                                    "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                                    activeSubTab === 'estimates' ? "bg-[#34d399] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                                )}
                            >
                                Estimates
                                <span className={clsx("px-1.5 py-0.5 rounded-md text-[10px]", activeSubTab === 'estimates' ? "bg-black/20" : "bg-white/5")}>
                                    {estimates.length}
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => { setActiveTab('reports'); setShowMobileMenu(false); }}
                    className={clsx(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group",
                        activeTab === 'reports' ? "bg-[#34d3991a] text-[#34d399] shadow-sm" : "text-[#55556a] hover:text-white hover:bg-white/5"
                    )}
                >
                    <BarChart3 size={20} className={activeTab === 'reports' ? "text-[#34d399]" : ""} />
                    <span>Analytics</span>
                </button>
            </nav>

            <div className="pt-8 border-t border-white/5 space-y-3">
                <button
                    onClick={() => { setActiveTab('settings'); setShowMobileMenu(false); }}
                    className={clsx(
                        "w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold transition-all",
                        activeTab === 'settings' ? "bg-white/10 text-white border border-white/10" : "text-[#55556a] hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                >
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
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#050508] text-[#eeeef2]">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-[#0c0c16] border-r border-white/5 p-8 z-40 hidden xl:flex flex-col shadow-2xl">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <>
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[50] xl:hidden"
                        onClick={() => setShowMobileMenu(false)}
                    ></div>
                    <aside className="fixed left-0 top-0 h-full w-80 bg-[#0c0c16] border-r border-white/10 p-8 z-[60] xl:hidden flex flex-col shadow-2xl animate-admin-in">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setShowMobileMenu(false)} className="p-2 text-[#55556a] hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* Main Container */}
            <main className="flex-1 xl:pl-72 flex flex-col min-h-screen relative overflow-hidden">
                {/* Cinematic Backdrop */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                    <div
                        className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full"
                        style={{ backgroundColor: `${accentColor}08` }}
                    ></div>
                    <div
                        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full opacity-20"
                        style={{ backgroundColor: `${accentColor}05` }}
                    ></div>
                </div>

                {/* Top Navbar */}
                <header className="sticky top-0 bg-[#050508]/80 backdrop-blur-3xl border-b border-white/5 px-6 xl:px-12 py-5 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setShowMobileMenu(true)}
                            className="xl:hidden p-2 bg-white/5 rounded-xl text-[#eeeef2] border border-white/5"
                        >
                            <LayoutDashboard size={20} />
                        </button>

                        <h2 className="text-xl xl:text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                            {activeTab === 'bookings' ? `Reservations ${bookingFilter !== 'all' ? `• ${bookingFilter}` : ''}` :
                                activeTab === 'chats' ? 'Neural Node Logs' :
                                    activeTab === 'customers' ? 'Market Database' :
                                        activeTab === 'fleet' ? 'Fleet Operations' :
                                            activeTab === 'reports' ? 'Revenue Analytics' : 'System Configuration'}
                        </h2>
                        <div className="h-8 w-px bg-white/10 mx-4 hidden lg:block"></div>
                        <p className="text-[#8888a0] text-[10px] font-black uppercase tracking-[0.4em] hidden lg:block animate-pulse">
                            Operational Status: Nominal
                        </p>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="relative group hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={`Query data across ${activeTab}...`}
                                className="bg-[#0c0c16] border-2 border-white/5 rounded-2xl py-3 pl-12 pr-6 focus:border-[#00c8ff33] focus:ring-8 focus:ring-[#00c8ff05] outline-none transition-all text-sm w-64 lg:w-96 text-white font-bold placeholder:text-[#55556a]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-[#eeeef2] border-2 border-white/5 shadow-inner"
                            title="Synchronize Data"
                        >
                            <RefreshCcw size={22} className={clsx(loading && "animate-spin")} />
                        </button>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all relative border-2",
                                    showNotifications ? "bg-[#ff2d551a] border-[#ff2d5533] text-[#ff2d55]" : "bg-white/5 border-white/5 text-[#55556a] hover:text-[#ff2d55]"
                                )}
                            >
                                <Bell size={24} />
                                {pendingCount > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-[#ff2d55] rounded-full ring-4 ring-[#050508] animate-pulse shadow-[0_0_15px_rgba(255,45,85,0.4)]"></span>}
                            </button>

                            {/* Notification Center */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-6 w-96 bg-[#10101e] border-2 border-white/5 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-admin-in">
                                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em]">Neural Alerts</h4>
                                        <button onClick={() => setShowNotifications(false)} className="text-[#55556a] hover:text-white transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="max-h-[500px] overflow-y-auto p-6 space-y-4 custom-scrollbar-minimal">
                                        {pendingCount > 0 ? (
                                            bookings.filter(b => b.status === 'pending').map(b => (
                                                <div
                                                    key={b.id}
                                                    className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-[#00c8ff33] transition-all cursor-pointer group"
                                                    onClick={() => { setActiveTab('bookings'); setBookingFilter('pending'); setShowNotifications(false); }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-sm font-black text-white">{b.name}</p>
                                                        <ChevronRight size={14} className="text-[#55556a] group-hover:translate-x-1 group-hover:text-[#00c8ff] transition-all" />
                                                    </div>
                                                    <p className="text-[10px] text-[#8888a0] font-black uppercase tracking-widest leading-relaxed">Incoming request for {b.bike_model} • Approval Required</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center space-y-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                    <ShieldCheck size={24} className="text-[#55556a]" />
                                                </div>
                                                <p className="text-[#55556a] text-[10px] font-black uppercase tracking-[0.2em]">All Systems Nominal</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="px-6 xl:px-12 py-10 xl:py-16 space-y-16 flex-1 overflow-y-auto custom-scrollbar-minimal z-10 relative">
                    {activeTab === 'bookings' && (
                        <>
                            <DashboardStats bookings={bookings} onExplore={handleExplore} />

                            <div className="space-y-8 animate-admin-in">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                                        <div className="w-2 h-8 bg-[#00c8ff] rounded-full shadow-[0_0_20px_rgba(0,200,255,0.4)]"></div>
                                        Deployment Queue
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#8888a0] bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5">
                                        <button onClick={() => setBookingFilter('pending')} className={clsx("flex items-center gap-2 hover:text-white transition-colors", bookingFilter === 'pending' && "text-[#fbbf24]")}><div className="w-2 h-2 bg-[#fbbf24] rounded-full"></div> Pending</button>
                                        <button onClick={() => setBookingFilter('confirmed')} className={clsx("flex items-center gap-2 hover:text-white transition-colors", bookingFilter === 'confirmed' && "text-[#00c8ff]")}><div className="w-2 h-2 bg-[#00c8ff] rounded-full"></div> Confirmed</button>
                                        <button onClick={() => setBookingFilter('in_progress')} className={clsx("flex items-center gap-2 hover:text-white transition-colors", bookingFilter === 'in_progress' && "text-[#a78bfa]")}><div className="w-2 h-2 bg-[#a78bfa] rounded-full"></div> In Progress</button>
                                        <button onClick={() => setBookingFilter('completed')} className={clsx("flex items-center gap-2 hover:text-white transition-colors", bookingFilter === 'completed' && "text-[#34d399]")}><div className="w-2 h-2 bg-[#34d399] rounded-full"></div> Done</button>
                                        <div className="w-px h-4 bg-white/10 mx-1"></div>
                                        <button onClick={() => setBookingFilter('all')} className={clsx("hover:text-white transition-colors", bookingFilter === 'all' && "text-white underline decoration-[#00c8ff] underline-offset-4")}>View All</button>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-40">
                                        <div className="w-16 h-16 border-4 border-[#00c8ff1a] border-t-[#00c8ff] rounded-full animate-spin shadow-2xl"></div>
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-[#55556a] space-y-4">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                            <Calendar size={32} className="opacity-50" />
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-widest">No Bookings Found</p>
                                    </div>
                                ) : (
                                    <BookingsList bookings={filteredBookings} onUpdate={fetchData} />
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'chats' && (
                        <IntelligenceLogs
                            chats={chats}
                            diagnoses={diagnoses}
                            estimates={estimates}
                            activeSubTab={activeSubTab}
                            setActiveSubTab={setActiveSubTab}
                        />
                    )}

                    {activeTab === 'customers' && (
                        <div className="space-y-10 animate-admin-in">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#34d399] rounded-full shadow-[0_0_20px_rgba(52,211,153,0.4)]"></div>
                                    Operational Intelligence
                                </h3>
                            </div>
                            <CustomersList bookings={bookings} />
                        </div>
                    )}

                    {activeTab === 'settings' && <SettingsPanel />}

                    {activeTab === 'fleet' && (
                        <VehicleHistory bookings={bookings} serviceHistory={serviceHistory} onHistoryChange={fetchData} />
                    )}

                    {activeTab === 'reports' && (
                        <RevenueAnalytics bookings={bookings} expenses={expenses} onExpenseChange={fetchData} />
                    )}
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar-minimal::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar-minimal::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-minimal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 20px; }
                .custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.08); }
            `}</style>
        </div>
    );
}
