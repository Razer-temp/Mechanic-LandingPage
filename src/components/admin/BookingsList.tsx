import React, { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    User,
    Bike,
    MapPin,
    Phone,
    Calendar,
    MoreVertical,
    Check,
    RotateCcw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

interface BookingsListProps {
    bookings: any[];
    onUpdate: () => void;
}

export default function BookingsList({ bookings, onUpdate }: BookingsListProps) {
    const supabase = createClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
        setUpdatingId(id);
        try {
            const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Please check your connection.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-32 bg-[#10101e] rounded-[2.5rem] border border-dashed border-white/10 animate-admin-in shadow-inner">
                <div className="text-6xl mb-6">📂</div>
                <p className="text-[#eeeef2] text-lg font-bold">No records found matching your criteria.</p>
                <p className="text-[#55556a] mt-2">Try adjusting your search or sync filters.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 animate-admin-in">
            {bookings.map((b) => (
                <div
                    key={b.id}
                    className="group relative bg-[#10101e] border border-white/10 rounded-[2.5rem] p-10 hover:border-[#00c8ff/30] transition-all shadow-2xl overflow-hidden"
                >
                    {/* Status Bar */}
                    <div className={clsx(
                        "absolute top-0 left-0 w-1.5 h-full",
                        b.status === 'pending' ? "bg-[#fbbf24]" :
                            b.status === 'confirmed' ? "bg-[#00c8ff]" :
                                b.status === 'completed' ? "bg-[#34d399]" : "bg-[#ff2d55]"
                    )}></div>

                    <div className="flex flex-col xl:flex-row justify-between gap-10">
                        {/* Customer Info */}
                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#ff2d55] border border-white/5 shadow-inner">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tight">{b.name}</h4>
                                    <div className="flex items-center gap-3 text-[#8888a0] mt-1 font-bold">
                                        <Phone size={14} className="text-[#00c8ff]" />
                                        {b.phone}
                                        <span className="text-[#333]">•</span>
                                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-tighter">ID: {b.id.slice(0, 8)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em]">
                                        <Bike size={12} strokeWidth={3} />
                                        Vehicle Context
                                    </div>
                                    <p className="text-lg text-white font-black leading-tight">{b.bike_model}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-[#00c8ff1a] text-[#00c8ff] rounded-lg text-xs font-black uppercase tracking-wider border border-[#00c8ff33]">
                                            {b.service_type}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em]">
                                        <MapPin size={12} strokeWidth={3} />
                                        Deployment Site
                                    </div>
                                    <p className="text-lg text-white font-black leading-tight">
                                        {b.location === 'doorstep' ? (
                                            <span className="text-[#fbbf24]">Doorstep Delivery</span>
                                        ) : (
                                            <span className="text-[#00c8ff]">Workshop Service</span>
                                        )}
                                    </p>
                                    {b.location === 'doorstep' && b.address && (
                                        <p className="text-xs text-[#8888a0] font-medium leading-relaxed max-w-sm italic">
                                            "{b.address}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scheduling & Actions */}
                        <div className="xl:w-80 flex flex-col justify-between items-start xl:items-end border-t xl:border-t-0 xl:border-l border-white/5 pt-10 xl:pt-0 xl:pl-10">
                            <div className="text-left xl:text-right space-y-4 mb-8">
                                <div className="flex items-center justify-start xl:justify-end gap-3 text-[#eeeef2] font-black text-lg tracking-tight">
                                    <Calendar size={20} className="text-[#a78bfa]" />
                                    {new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center justify-start xl:justify-end gap-2">
                                    <span className={clsx(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg",
                                        b.status === 'pending' ? "bg-[#fbbf24] text-black" :
                                            b.status === 'confirmed' ? "bg-[#00c8ff] text-black" :
                                                b.status === 'completed' ? "bg-[#34d399] text-black" : "bg-[#ff2d55] text-white"
                                    )}>
                                        {b.status}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 w-full xl:justify-end">
                                {b.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'confirmed')}
                                        disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#00c8ff] text-black rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                        Confirm
                                    </button>
                                )}

                                {b.status === 'confirmed' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'completed')}
                                        disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#34d399] text-black rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        Complete
                                    </button>
                                )}

                                {b.status !== 'cancelled' && b.status !== 'completed' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'cancelled')}
                                        disabled={updatingId === b.id}
                                        className="p-3 bg-white/5 hover:bg-[#ff2d551a] hover:text-[#ff2d55] rounded-xl transition-all text-[#55556a] border border-white/5"
                                        title="Cancel Booking"
                                    >
                                        <XCircle size={22} />
                                    </button>
                                )}

                                {b.status === 'cancelled' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'pending')}
                                        disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all border border-white/5 shadow-xl"
                                    >
                                        <RotateCcw size={18} strokeWidth={3} />
                                        Restore
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
