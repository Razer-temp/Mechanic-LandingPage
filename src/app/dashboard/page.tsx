'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Plus, Calendar, Clock, Wrench, AlertCircle, CheckCircle, MoreHorizontal } from 'lucide-react';
import type { Booking, Service } from '@/types/database';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<(Booking & { services: Service | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            try {
                const { data, error: fetchError } = await supabase
                    .from('bookings')
                    .select(`*, services (*)`)
                    .eq('user_id', user.id)
                    .order('scheduled_at', { ascending: false });

                if (fetchError) throw fetchError;
                setBookings(data as (Booking & { services: Service | null })[]);
            } catch (err: any) {
                console.error('Error fetching bookings:', err);
                setError(err.message || 'Unable to load your dashboard data.');
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading && user) {
            fetchData();
        } else if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, supabase, router]);

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

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-accent-red" />
                </div>
                <h2 className="text-text-primary font-black text-xl mb-2">Something went wrong</h2>
                <p className="text-text-secondary text-sm max-w-xs mb-8">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                    style={{ padding: '12px 24px' }}
                >
                    Try Refreshing
                </button>
            </div>
        );
    }

    const upcomingBookings = bookings.filter(b => new Date(b.scheduled_at) > new Date() && b.status !== 'cancelled' && b.status !== 'completed');
    const pastBookings = bookings.filter(b => new Date(b.scheduled_at) <= new Date() || b.status === 'cancelled' || b.status === 'completed');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="section-title" style={{ fontSize: '2.4rem', textAlign: 'left', marginBottom: '4px' }}>My <span className="gradient-text">Dashboard</span></h1>
                    <p className="text-text-secondary text-sm font-medium">Welcome back, happy riding! 🏍️</p>
                </div>
                <Link href="/dashboard/new-booking" className="btn btn-primary btn-glow">
                    <Plus className="w-5 h-5" /> New Booking
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div className="flex flex-col">
                        <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-2 block">Total Services</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-text-primary leading-none">{bookings.filter(b => b.status === 'completed').length}</span>
                            <span className="text-text-muted text-xs mb-1 font-medium">Completed</span>
                        </div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div className="flex flex-col">
                        <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-2 block">Upcoming</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black gradient-text leading-none">{upcomingBookings.length}</span>
                            <span className="text-text-muted text-xs mb-1 font-medium">Sessions</span>
                        </div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div className="flex flex-col">
                        <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-2 block">Total Spent</span>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-text-primary leading-none">₹{bookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0)}</span>
                            <span className="text-text-muted text-xs mb-1 font-medium">INR</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Bookings */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-accent" />
                    </div>
                    <h2 className="font-heading font-black text-xl text-text-primary">Upcoming Appointments</h2>
                </div>
                {upcomingBookings.length === 0 ? (
                    <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 border border-white/[0.05]">
                            <Calendar className="w-8 h-8 text-text-muted opacity-40" />
                        </div>
                        <h3 className="text-text-primary font-bold text-lg mb-2">No upcoming bookings</h3>
                        <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">Your bike misses the workshop! Time for a professional checkup?</p>
                        <Link href="/dashboard/new-booking" className="gradient-text font-bold text-sm hover:underline">
                            Book a Service Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </section>

            {/* Past Bookings */}
            <section>
                <div className="flex items-center gap-3 mb-6 opacity-60">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-text-muted" />
                    </div>
                    <h2 className="font-heading font-black text-xl text-text-primary">Past History</h2>
                </div>
                <div className="grid gap-4">
                    {pastBookings.length === 0 && (
                        <p className="text-text-muted text-sm italic pl-2">No past service history found.</p>
                    )}
                    {pastBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isPast />
                    ))}
                </div>
            </section>
        </div>
    );
}

function BookingCard({ booking, isPast }: { booking: Booking & { services: Service | null }, isPast?: boolean }) {
    return (
        <div className={clsx(
            "glass-card group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all",
            isPast && "opacity-60 grayscale-[0.5]"
        )} style={{ padding: '24px' }}>
            <div className="flex items-start gap-4 flex-1">
                <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-white/[0.05]",
                    isPast ? "bg-white/[0.02] text-text-muted" : "bg-accent/10 text-accent"
                )}>
                    {booking.services?.icon || '🔧'}
                </div>
                <div className="overflow-hidden">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-text-primary text-lg truncate whitespace-nowrap">{booking.services?.name || 'General Service'}</h3>
                        <span className={clsx(
                            "capitalize px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border",
                            booking.status === 'confirmed' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                                booking.status === 'pending' ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" :
                                    booking.status === 'cancelled' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                        "bg-bg-elevated text-text-muted border-border-subtle"
                        )}>{booking.status}</span>
                    </div>
                    <p className="text-sm text-text-secondary font-semibold mb-2">{booking.bike_model}</p>
                    {booking.notes && <p className="text-xs text-text-muted italic max-w-md truncate line-clamp-1">"{booking.notes}"</p>}
                </div>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end md:pl-0">
                <div className="text-left md:text-right">
                    <div className="flex items-center md:justify-end gap-2 text-sm text-text-primary font-bold mb-1">
                        <Calendar className="w-4 h-4 text-accent" />
                        {new Date(booking.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center md:justify-end gap-2 text-xs text-text-muted font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(booking.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {!isPast && (
                    <button className="p-3 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
