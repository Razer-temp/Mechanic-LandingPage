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
    const { user, profile, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<(Booking & { services: Service | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        // Fallback: Ensure loading resolves even if database is slow
        const fallback = setTimeout(() => {
            if (mounted) {
                console.log('Dashboard data fallback triggered');
                setLoading(false);
            }
        }, 5000);

        async function fetchData() {
            if (!user) return;
            try {
                const { data, error: fetchError } = await supabase
                    .from('bookings')
                    .select(`*, services (*)`)
                    .eq('user_id', user.id)
                    .order('scheduled_at', { ascending: false });

                if (fetchError) throw fetchError;
                if (mounted) setBookings(data as (Booking & { services: Service | null })[]);
            } catch (err: any) {
                console.error('Error fetching bookings:', err);
                if (mounted) setError(err.message || 'Unable to load your dashboard data.');
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(fallback);
                }
            }
        }

        if (!authLoading && user) {
            fetchData();
        } else if (!authLoading && !user) {
            router.push('/login');
        }

        return () => {
            mounted = false;
            clearTimeout(fallback);
        };
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 relative">
                <div>
                    <div className="section-tag mb-4">
                        <div className="pulse-dot" /> Member Dashboard
                    </div>
                    <h1 className="section-title !m-0" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', textAlign: 'left' }}>
                        Welcome back, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Rider'}</span>
                    </h1>
                    <p className="text-text-secondary font-medium mt-3 tracking-wide">Your workshop status at a glance.</p>
                </div>
                <Link href="/dashboard/new-booking" className="btn btn-primary btn-glow group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span>New Booking</span>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Services', value: bookings.filter(b => b.status === 'completed').length, icon: CheckCircle, color: 'text-accent-green', bg: 'bg-accent-green/5' },
                    { label: 'Upcoming', value: upcomingBookings.length, icon: Calendar, color: 'text-accent', bg: 'bg-accent/5' },
                    { label: 'Estimated Balance', value: `₹${bookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0)}`, icon: Wrench, color: 'text-accent-violet', bg: 'bg-accent-violet/5' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card group p-8 hover:border-accent/30 transition-all duration-500 overflow-visible relative">
                        <div className={clsx("absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110", stat.bg)}>
                            <stat.icon className={clsx("w-6 h-6", stat.color)} />
                        </div>
                        <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{stat.label}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-text-primary group-hover:text-white transition-colors tracking-tight">{stat.value}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Upcoming Appointments */}
            <section className="relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                        <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="font-heading font-black text-2xl text-text-primary tracking-tight">Upcoming Appointments</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                </div>

                {upcomingBookings.length === 0 ? (
                    <div className="glass-card p-16 text-center group border-dashed hover:border-accent/20 transition-all">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] flex items-center justify-center mx-auto mb-6 border border-white/[0.05] group-hover:rotate-12 transition-transform duration-700">
                            <Calendar className="w-10 h-10 text-text-muted opacity-30" />
                        </div>
                        <h3 className="text-text-primary font-black text-xl mb-3">No active bookings</h3>
                        <p className="text-text-secondary text-base mb-8 max-w-sm mx-auto leading-relaxed">Your bike misses the high-performance treatment! Why not treat it to a professional checkup?</p>
                        <Link href="/dashboard/new-booking" className="btn btn-secondary !bg-accent/5 hover:!bg-accent/10 border-accent/10 text-accent font-black">
                            Schedule Service
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {upcomingBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </section>

            {/* History Section */}
            <section className="relative pt-6">
                <div className="flex items-center gap-4 mb-8 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                        <CheckCircle className="w-5 h-5 text-text-muted" />
                    </div>
                    <h2 className="font-heading font-black text-2xl text-text-primary tracking-tight">Service History</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent ml-4" />
                </div>
                <div className="grid gap-5">
                    {pastBookings.length === 0 && (
                        <p className="text-text-muted text-sm italic pl-2 opacity-50">No past service entries recorded yet.</p>
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
            "glass-card group flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 transition-all duration-500 border-white/[0.04]",
            isPast && "opacity-60 saturate-[0.2] hover:opacity-80 hover:saturate-[0.8]"
        )} style={{ padding: '24px 32px' }}>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            <div className="flex items-start sm:items-center gap-6 flex-1 relative z-10">
                <div className={clsx(
                    "w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-3xl shrink-0 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    isPast ? "bg-white/[0.02] text-text-muted border-white/5" : "bg-accent/10 text-accent border-accent/20 shadow-lg shadow-accent/5"
                )}>
                    {booking.services?.icon || '🔧'}
                </div>
                <div className="overflow-hidden space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-black text-text-primary text-xl tracking-tight transition-colors group-hover:text-accent">{booking.services?.name || 'General Service'}</h3>
                        <span className={clsx(
                            "capitalize px-3 py-1 rounded-lg text-[9px] font-black tracking-[0.15em] uppercase border",
                            booking.status === 'confirmed' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                                booking.status === 'pending' ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" :
                                    booking.status === 'cancelled' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                        "bg-bg-elevated text-text-muted border-border-subtle"
                        )}>{booking.status}</span>
                    </div>
                    <p className="text-base text-text-secondary font-bold flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-accent/50" />
                        {booking.bike_model}
                    </p>
                    {booking.notes && <p className="text-xs text-text-muted italic max-w-md truncate opacity-70 group-hover:opacity-100 transition-opacity">“{booking.notes}”</p>}
                </div>
            </div>

            <div className="flex items-center gap-10 w-full lg:w-auto justify-between border-t border-white/[0.05] lg:border-0 pt-6 lg:pt-0 relative z-10">
                <div className="text-left lg:text-right space-y-1.5">
                    <div className="flex items-center lg:justify-end gap-2 text-[15px] text-text-primary font-black tracking-tight">
                        <Calendar className="w-4 h-4 text-accent" />
                        {new Date(booking.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center lg:justify-end gap-2 text-xs text-text-muted font-bold tracking-widest uppercase">
                        <Clock className="w-3.5 h-3.5 text-accent-violet" />
                        {new Date(booking.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {!isPast && (
                    <button className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group/btn">
                        <MoreHorizontal className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
