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
        async function fetchBookings() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, services(*)')
                    .eq('user_id', user.id)
                    .order('scheduled_at', { ascending: false });

                if (error) throw error;
                setBookings(data as (Booking & { services: Service | null })[]);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading && user) fetchBookings();
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
                <p className="mt-6 text-text-muted text-sm font-medium tracking-wide">Loading your history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="section-title" style={{ fontSize: '2.4rem', textAlign: 'left', marginBottom: '4px' }}>My <span className="gradient-text">Bookings</span></h1>
                    <p className="text-text-secondary text-sm font-medium">Manage your service history and upcoming visits.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search bike or service..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 px-4 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="all" className="bg-bg-surface">All Status</option>
                        <option value="pending" className="bg-bg-surface">Pending</option>
                        <option value="confirmed" className="bg-bg-surface">Confirmed</option>
                        <option value="completed" className="bg-bg-surface">Completed</option>
                        <option value="cancelled" className="bg-bg-surface">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredBookings.length === 0 ? (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mx-auto mb-6 border border-white/[0.05]">
                            <Search className="w-10 h-10 text-text-muted opacity-30" />
                        </div>
                        <h3 className="text-text-primary font-bold text-xl mb-2">No results found</h3>
                        <p className="text-text-secondary text-sm max-w-xs mx-auto mb-8">We couldn't find any bookings matching your criteria.</p>
                        <button onClick={() => { setSearch(''); setFilter('all'); }} className="gradient-text font-bold text-sm hover:underline">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <div key={booking.id} className="glass-card group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:translate-x-1 transition-all duration-300" style={{ padding: '24px' }}>
                            <div className="flex items-start gap-5 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl shrink-0 border border-accent/20">
                                    {booking.services?.icon || '🔧'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-black text-text-primary text-lg truncate">{booking.services?.name || 'Service'}</h3>
                                        <span className={clsx(
                                            "capitalize px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border",
                                            booking.status === 'confirmed' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                                                booking.status === 'pending' ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" :
                                                    booking.status === 'completed' ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20" :
                                                        booking.status === 'cancelled' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                                            "bg-bg-elevated text-text-muted border-border-subtle"
                                        )}>{booking.status}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary font-bold mb-2">{booking.bike_model}</p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(booking.scheduled_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            {booking.time_slot || 'Anytime'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-accent font-black">
                                            ₹{booking.estimated_cost}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/dashboard/bookings/${booking.id}`} className="w-full sm:w-auto p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] flex items-center justify-center sm:justify-between gap-3 text-text-muted hover:text-text-primary transition-all">
                                <span className="text-xs font-bold sm:hidden">View Details</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
