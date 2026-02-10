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
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`*, services (*)`)
                    .eq('user_id', user.id)
                    .order('scheduled_at', { ascending: false });

                if (error) throw error;
                setBookings(data as (Booking & { services: Service | null })[]);
            } catch (error) {
                console.error('Error fetching bookings:', error);
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
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 rounded-full border-2 border-accent-base border-t-transparent animate-spin" />
            </div>
        );
    }

    const upcomingBookings = bookings.filter(b => new Date(b.scheduled_at) > new Date() && b.status !== 'cancelled' && b.status !== 'completed');
    const pastBookings = bookings.filter(b => new Date(b.scheduled_at) <= new Date() || b.status === 'cancelled' || b.status === 'completed');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-heading font-black text-3xl text-text-primary">My Dashboard</h1>
                    <p className="text-text-secondary">Welcome back, happy riding! 🏍️</p>
                </div>
                <Link href="/dashboard/new-booking" className="btn-primary bg-accent-base hover:bg-accent-dim text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-accent-base/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                    <Plus className="w-5 h-5" /> New Booking
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-bg-elevated/50 border border-border-subtle p-5 rounded-2xl">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Total Services</span>
                    <span className="text-3xl font-black text-text-primary">{bookings.filter(b => b.status === 'completed').length}</span>
                </div>
                <div className="bg-bg-elevated/50 border border-border-subtle p-5 rounded-2xl">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Upcoming</span>
                    <span className="text-3xl font-black text-accent-base">{upcomingBookings.length}</span>
                </div>
                <div className="bg-bg-elevated/50 border border-border-subtle p-5 rounded-2xl">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-wider block mb-1">Total Spent</span>
                    <span className="text-3xl font-black text-text-primary">₹{bookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0)}</span>
                </div>
            </div>

            {/* Upcoming Bookings */}
            <section>
                <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent-base" /> Upcoming Appointments
                </h2>
                {upcomingBookings.length === 0 ? (
                    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 text-center">
                        <Calendar className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-50" />
                        <h3 className="text-text-primary font-medium mb-1">No upcoming bookings</h3>
                        <p className="text-text-secondary text-sm mb-4">Time for a checkup?</p>
                        <Link href="/dashboard/new-booking" className="text-accent-base text-sm font-semibold hover:underline">
                            Book a Service Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </section>

            {/* Past Bookings */}
            <section>
                <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-text-secondary" /> Past History
                </h2>
                <div className="space-y-4">
                    {pastBookings.length === 0 && (
                        <p className="text-text-muted text-sm italic">No past service history found.</p>
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
            "bg-bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-border-accent",
            isPast && "opacity-75 grayscale-[0.3]"
        )}>
            <div className="flex items-start gap-4">
                <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                    isPast ? "bg-bg-elevated text-text-muted" : "bg-accent-base/10 text-accent-base"
                )}>
                    {booking.services?.icon || '🔧'}
                </div>
                <div>
                    <h3 className="font-bold text-text-primary">{booking.services?.name || 'General Service'}</h3>
                    <p className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                        <span className="font-medium text-text-muted">{booking.bike_model}</span>
                        •
                        <span className={clsx(
                            "capitalize px-2 py-0.5 rounded text-[10px] font-bold border",
                            booking.status === 'confirmed' ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                                booking.status === 'pending' ? "bg-accent-amber/10 text-accent-amber border-accent-amber/20" :
                                    booking.status === 'cancelled' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                        "bg-bg-elevated text-text-muted border-border-subtle"
                        )}>{booking.status}</span>
                    </p>
                    {booking.notes && <p className="text-xs text-text-muted italic max-w-md truncate">"{booking.notes}"</p>}
                </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pl-[64px] md:pl-0">
                <div className="text-right">
                    <div className="flex items-center gap-1.5 text-sm text-text-primary font-medium">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        {new Date(booking.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5 justify-end">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.scheduled_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>

                {!isPast && (
                    <button className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
