import React, { useState } from 'react';
import { User, Phone, Bike, MapPin, Calendar, Clock, ChevronRight, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

interface BookingsListProps {
    bookings: any[];
    onUpdate: () => void;
}

export default function BookingsList({ bookings, onUpdate }: BookingsListProps) {
    const supabase = createClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            await supabase.from('bookings').update({ status }).eq('id', id);
            onUpdate();
        } catch (err) {
            console.error('Error updating status:', err);
        }
        setUpdatingId(null);
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-20 bg-[#0c0c16]/30 rounded-[2rem] border border-dashed border-white/5 animate-admin-in">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-[#8888a0] font-medium">No bookings found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 animate-admin-in">
            {bookings.map((b) => (
                <div
                    key={b.id}
                    className="group relative bg-[#0c0c16] border border-white/5 rounded-[2rem] p-8 hover:bg-[#10101e] transition-all duration-500 overflow-hidden"
                >
                    {/* Status Glow Bar */}
                    <div className={clsx(
                        "absolute left-0 top-0 bottom-0 w-1",
                        b.status === 'pending' ? "bg-[#fbbf24]" :
                            b.status === 'confirmed' ? "bg-[#00c8ff]" :
                                b.status === 'completed' ? "bg-[#34d399]" : "bg-[#ff2d55]"
                    )} />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#a78bfa] group-hover:scale-110 transition-transform duration-500">
                                    <User size={32} />
                                </div>
                                <div className={clsx(
                                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#0c0c16]",
                                    b.service_location === 'doorstep' ? "bg-[#ff2d55] text-white" : "bg-[#00c8ff] text-white"
                                )}>
                                    {b.service_location === 'doorstep' ? <MapPin size={12} /> : <Bike size={12} />}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-white">{b.name}</h3>
                                    <span className={clsx(
                                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                        b.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                            b.status === 'confirmed' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                b.status === 'completed' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        {b.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-[#8888a0] font-medium">
                                    <span className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={14} /> {b.phone}</span>
                                    <span className="flex items-center gap-2 hover:text-white transition-colors"><Bike size={14} /> {b.bike_model}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8">
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em]">Scheduled For</span>
                                <div className="flex items-center gap-3 text-white font-bold">
                                    <Calendar size={16} className="text-[#00c8ff]" />
                                    <span>{new Date(b.preferred_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="text-white/20">|</span>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <Clock size={16} />
                                        <span className="capitalize">{b.preferred_time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pl-8 lg:border-l border-white/5">
                                {b.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'confirmed')}
                                        disabled={updatingId === b.id}
                                        className="p-3 bg-white/5 hover:bg-[#00c8ff1a] text-[#00c8ff] rounded-2xl border border-white/5 hover:border-[#00c8ff33] transition-all active:scale-95"
                                        title="Confirm Booking"
                                    >
                                        <CheckCircle size={22} />
                                    </button>
                                )}
                                {b.status === 'confirmed' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'completed')}
                                        disabled={updatingId === b.id}
                                        className="p-3 bg-white/5 hover:bg-[#34d3991a] text-[#34d399] rounded-2xl border border-white/5 hover:border-[#34d39933] transition-all active:scale-95"
                                        title="Mark Completed"
                                    >
                                        <CheckCircle size={22} />
                                    </button>
                                )}
                                <button
                                    onClick={() => updateStatus(b.id, 'cancelled')}
                                    disabled={updatingId === b.id}
                                    className="p-3 bg-white/5 hover:bg-[#ff2d551a] text-[#ff2d55] rounded-2xl border border-white/5 hover:border-[#ff2d5533] transition-all active:scale-95"
                                    title="Cancel Booking"
                                >
                                    <XCircle size={22} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/5 rounded-xl text-[#8888a0]">
                                <Bike size={16} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">Service Requested</span>
                                <p className="text-sm text-white font-bold">{b.service_type}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/5 rounded-xl text-[#00c8ff]">
                                <MapPin size={16} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">Service Site</span>
                                <p className="text-sm text-white font-bold capitalize">
                                    {b.service_location === 'doorstep' ? `Doorstep @ ${b.address}` : "Workshop Service"}
                                </p>
                            </div>
                        </div>

                        {b.notes && (
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-xl text-[#fbbf24]">
                                    <MoreVertical size={16} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">Admins Notes</span>
                                    <p className="text-sm text-[#8888a0] leading-relaxed italic">&quot;{b.notes}&quot;</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
