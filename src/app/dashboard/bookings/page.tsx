'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Search, Filter, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import type { Booking, Service } from '@/types/database';
import clsx from 'clsx';
import Link from 'next/link';

export default function BookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<(Booking & { services: Service | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        // Fallback: Ensure loading resolves even if database is slow
        const fallback = setTimeout(() => {
            if (mounted) {
                console.log('Bookings data fallback triggered');
                setLoading(false);
            }
        }, 5000);

        async function fetchBookings() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, services(*)')
                    .eq('user_id', user.id)
                    .order('scheduled_at', { ascending: false });

                if (error) throw error;
                if (mounted) setBookings(data as (Booking & { services: Service | null })[]);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(fallback);
                }
            }
        }

        if (!authLoading && user) fetchBookings();
        return () => {
            mounted = false;
            clearTimeout(fallback);
        }
    }, [user, authLoading, supabase]);

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.bike_model.toLowerCase().includes(search.toLowerCase()) ||
            b.services?.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || b.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading || authLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin shadow-[0_0_15px_rgba(0,200,255,0.4)]"></div>
                </div>
                <p className="mt-6 text-text-muted text-sm font-medium tracking-wide animate-pulse">Syncing your workshop data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <div className="section-tag mb-4">
                        <Calendar className="w-3 h-3" /> Workshop History
                    </div>
                    <h1 className="section-title !m-0" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'left' }}>
                        My <span className="gradient-text">Bookings</span>
                    </h1>
                    <p className="text-text-secondary font-medium mt-3 tracking-wide">Manage your service entries and upcoming visits.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Search bike or service..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-text-primary outline-none focus:border-accent/30 focus:bg-white/[0.04] transition-all font-medium"
                        />
                    </div>

                    <div className="relative sm:w-48 group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-10 text-sm text-text-primary outline-none focus:border-accent/30 focus:bg-white/[0.04] transition-all appearance-none cursor-pointer font-bold uppercase tracking-widest text-[10px]"
                        >
                            <option value="all" className="bg-bg-surface">All Status</option>
                            <option value="pending" className="bg-bg-surface">Pending</option>
                            <option value="confirmed" className="bg-bg-surface">Confirmed</option>
                            <option value="completed" className="bg-bg-surface">Completed</option>
                            <option value="cancelled" className="bg-bg-surface">Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-1.5 h-1.5 border-r border-b border-text-muted rotate-45" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredBookings.length === 0 ? (
                    <div className="glass-card p-20 text-center group border-dashed hover:border-accent/20 transition-all">
                        <div className="w-24 h-24 rounded-[3rem] bg-white/[0.02] flex items-center justify-center mx-auto mb-8 border border-white/[0.05] group-hover:rotate-12 transition-transform duration-700">
                            <Search className="w-10 h-10 text-text-muted opacity-30" />
                        </div>
                        <h3 className="text-text-primary font-black text-2xl mb-3">No results found</h3>
                        <p className="text-text-secondary text-base mb-10 max-w-sm mx-auto leading-relaxed">We couldn't find any bookings matching your current filters.</p>
                        <button onClick={() => { setSearch(''); setFilter('all'); }} className="btn btn-secondary !bg-accent/5 hover:!bg-accent/10 border-accent/10 text-accent font-black">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                )}
            </div>
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking & { services: Service | null } }) {
    const isPast = new Date(booking.scheduled_at) <= new Date() || booking.status === 'cancelled' || booking.status === 'completed';

    return (
        <div className={clsx(
            "glass-card group flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 transition-all duration-500 border-white/[0.04]",
            isPast && "opacity-60 saturate-[0.2] hover:opacity-100 hover:saturate-100"
        )} style={{ padding: '24px 32px' }}>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out" />

            <div className="flex items-start sm:items-center gap-6 flex-1 relative z-10">
                <div className={clsx(
                    "w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-3xl shrink-0 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    isPast ? "bg-white/[0.02] text-text-muted border-white/5" : "bg-accent/10 text-accent border-accent/20 shadow-lg shadow-accent/5"
                )}>
                    {booking.services?.icon || '🔧'}
                </div>
                <div className="overflow-hidden space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-black text-text-primary text-xl tracking-tight transition-colors group-hover:text-accent">{booking.services?.name || 'Service'}</h3>
                        <span className={clsx(
                            "capitalize px-3 py-1 rounded-lg text-[9px] font-black tracking-[0.15em] uppercase border",
                            booking.status === 'confirmed' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                                booking.status === 'pending' ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" :
                                    booking.status === 'completed' ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20" :
                                        booking.status === 'cancelled' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                            "bg-bg-elevated text-text-muted border-border-subtle"
                        )}>{booking.status}</span>
                    </div>
                    <p className="text-base text-text-secondary font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent/50" />
                        {booking.bike_model}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-black uppercase tracking-widest">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {new Date(booking.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-black uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5 text-accent-violet" />
                            {new Date(booking.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-accent font-black tracking-widest">
                            ₹{booking.estimated_cost}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center lg:pl-10 relative z-10 w-full lg:w-auto border-t lg:border-t-0 border-white/[0.05] pt-6 lg:pt-0">
                <Link href={`/dashboard/bookings/${booking.id}`} className="w-full lg:w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all group/btn">
                    <span className="lg:hidden text-xs font-black uppercase tracking-widest mr-3">Details</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
