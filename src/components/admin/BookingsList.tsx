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
    Check,
    MessageCircle,
    Trash2,
    Wrench,
    IndianRupee,
    Play,
    Hash
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
    const [editingCostId, setEditingCostId] = useState<string | null>(null);
    const [editingMechanicId, setEditingMechanicId] = useState<string | null>(null);
    const [costInput, setCostInput] = useState('');
    const [mechanicInput, setMechanicInput] = useState('');
    const [completionModal, setCompletionModal] = useState<{
        show: boolean;
        booking: any;
        km: string;
        nextKm: string;
    }>({ show: false, booking: null, km: '', nextKm: '' });

    const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
        setUpdatingId(id);
        try {
            const updateData: any = { status };
            if (status === 'in_progress') updateData.started_at = new Date().toISOString();
            if (status === 'completed') {
                setCompletionModal({
                    show: true,
                    booking: bookings.find(b => b.id === id),
                    km: '',
                    nextKm: ''
                });
                setUpdatingId(null);
                return; // Wait for modal
            }

            const { error } = await supabase.from('bookings').update(updateData).eq('id', id);
            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSetFinalCost = async (id: string) => {
        if (!costInput) return;
        try {
            const { error } = await supabase.from('bookings').update({ final_cost: parseFloat(costInput) }).eq('id', id);
            if (error) throw error;
            setEditingCostId(null);
            setCostInput('');
            onUpdate();
        } catch (err) {
            console.error('Error setting cost:', err);
        }
    };

    const handleSetMechanic = async (id: string) => {
        if (!mechanicInput) return;
        try {
            const { error } = await supabase.from('bookings').update({ mechanic_name: mechanicInput }).eq('id', id);
            if (error) throw error;
            setEditingMechanicId(null);
            setMechanicInput('');
            onUpdate();
        } catch (err) {
            console.error('Error setting mechanic:', err);
        }
    };

    const handleDeleteBooking = async (id: string, name: string) => {
        if (!confirm(`Permanently delete booking for ${name}?`)) return;
        setUpdatingId(id);
        try {
            const { error } = await supabase.from('bookings').delete().eq('id', id);
            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Delete failed.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCompleteJob = async () => {
        const { booking, km, nextKm } = completionModal;
        if (!booking || !km) {
            alert("Mileage at service is required.");
            return;
        }

        setUpdatingId(booking.id);
        try {
            const finalCost = booking.final_cost || booking.estimated_cost || 0;
            const completionDate = new Date().toISOString();

            // 1. Update Booking
            const { error: bError } = await supabase.from('bookings').update({
                status: 'completed',
                completed_at: completionDate,
                next_service_km: parseFloat(nextKm) || 0
            }).eq('id', booking.id);
            if (bError) throw bError;

            // 2. Add to Service History (Garage Hub)
            const { error: shError } = await supabase.from('service_history').insert({
                vehicle_number: booking.vehicle_number,
                bike_model: booking.bike_model,
                customer_phone: booking.phone,
                customer_name: booking.name,
                service_type: booking.service_type,
                mileage_at_service: parseFloat(km),
                next_service_km: parseFloat(nextKm) || 0,
                cost: finalCost,
                notes: booking.notes,
                date: completionDate.split('T')[0]
            });
            if (shError) throw shError;

            setCompletionModal({ show: false, booking: null, km: '', nextKm: '' });
            onUpdate();
        } catch (err) {
            console.error('Error completing job:', err);
            alert('Failed to complete job record.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleWhatsAppConfirm = async (booking: any) => {
        let templates = {
            confirmation: "Hello {name}, your booking for {bike} is confirmed! We'll see you at {time}.",
            completion: "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
            reminder: "Hello {name}, just a reminder about your appointment today for {bike}.",
            cancellation: "Hello {name}, we have received your request to cancel the booking for {bike}."
        };

        try {
            const { data } = await supabase.from('admin_settings').select('value').eq('key', 'whatsapp_templates').single();
            if (data?.value) templates = data.value as any;
        } catch { /* fallback */ }

        let template = templates.confirmation;
        if (booking.status === 'completed') template = templates.completion;
        if (booking.status === 'cancelled') template = templates.cancellation;

        const cost = booking.final_cost || booking.estimated_cost || 0;
        const rawMessage = template
            .replace(/{name}/g, booking.name)
            .replace(/{bike}/g, booking.bike_model)
            .replace(/{time}/g, new Date(booking.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
            .replace(/{revenue}/g, `₹${cost}`);

        let phone = booking.phone.replace(/\D/g, '');
        if (phone.length === 10) phone = '91' + phone;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(rawMessage)}`, '_blank');

        if (booking.status === 'pending') updateStatus(booking.id, 'confirmed');
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-32 bg-[#10101e] rounded-[2.5rem] border border-dashed border-white/10 animate-admin-in shadow-inner">
                <div className="text-6xl mb-6">📂</div>
                <p className="text-[#eeeef2] text-lg font-bold">No Bookings Found</p>
                <p className="text-[#55556a] mt-2">Bookings will appear here as they come in.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 animate-admin-in">
            {bookings.map((b) => (
                <div
                    key={b.id}
                    className="group relative bg-[#10101e] border border-white/10 rounded-[2.5rem] p-8 xl:p-10 hover:border-white/20 transition-all shadow-2xl overflow-hidden"
                >
                    {/* Status Bar */}
                    <div className={clsx(
                        "absolute top-0 left-0 w-1.5 h-full",
                        b.status === 'pending' ? "bg-[#fbbf24]" :
                            b.status === 'confirmed' ? "bg-[#00c8ff]" :
                                b.status === 'in_progress' ? "bg-[#a78bfa]" :
                                    b.status === 'completed' ? "bg-[#34d399]" : "bg-[#ff2d55]"
                    )}></div>

                    <div className="flex flex-col xl:flex-row justify-between gap-8 xl:gap-10">
                        {/* Customer Info */}
                        <div className="flex-1 space-y-6 xl:space-y-8">
                            <div className="flex items-center gap-4 xl:gap-6">
                                <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#ff2d55] border border-white/5 shadow-inner">
                                    <User size={24} className="xl:hidden" />
                                    <User size={32} className="hidden xl:block" />
                                </div>
                                <div>
                                    <h4 className="text-xl xl:text-2xl font-black text-white tracking-tight">{b.name}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-[#8888a0] mt-1 font-bold text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-[var(--admin-accent)]" />
                                            {b.phone}
                                        </div>
                                        {b.vehicle_number && (
                                            <div className="flex items-center gap-1.5 text-[9px] bg-[#fbbf241a] text-[#fbbf24] px-2 py-0.5 rounded border border-[#fbbf2433] uppercase font-black tracking-widest">
                                                <Hash size={10} /> {b.vehicle_number}
                                            </div>
                                        )}
                                        {b.metadata?.device && (
                                            <div className="flex items-center gap-1.5 text-[9px] bg-white text-black px-2 py-0.5 rounded border border-white/20 uppercase font-black tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                                {b.metadata.device === 'Mobile' ? '📱 ' + (b.metadata.model || 'Mobile') :
                                                    b.metadata.device === 'Tablet' ? '📟 ' + (b.metadata.model || 'Tablet') :
                                                        '💻 ' + (b.metadata.os || 'Desktop')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-10">
                                {/* Vehicle */}
                                <div className="space-y-2 xl:space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] text-[#8888a0] font-black uppercase tracking-[0.2em]">
                                        <Bike size={12} strokeWidth={3} className="text-[#55556a]" />
                                        Vehicle
                                    </div>
                                    <p className="text-base xl:text-lg text-white font-black leading-tight">{b.bike_model}</p>
                                    <span className="inline-block px-3 py-1 bg-[rgba(var(--admin-accent-rgb),0.1)] text-[var(--admin-accent)] rounded-lg text-[10px] font-black uppercase tracking-wider border border-[rgba(var(--admin-accent-rgb),0.2)]">
                                        {b.service_type}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="space-y-2 xl:space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] text-[#8888a0] font-black uppercase tracking-[0.2em]">
                                        <MapPin size={12} strokeWidth={3} className="text-[#55556a]" />
                                        Location
                                    </div>
                                    <p className="text-base xl:text-lg text-white font-black leading-tight">
                                        {b.service_location === 'doorstep' ? (
                                            <span className="text-[#fbbf24]">Doorstep</span>
                                        ) : (
                                            <span className="text-[var(--admin-accent)]">Workshop</span>
                                        )}
                                    </p>
                                    {b.service_location === 'doorstep' && b.address && (
                                        <p className="text-xs text-[#8888a0] font-medium leading-relaxed max-w-sm italic">
                                            &ldquo;{b.address}&rdquo;
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Cost + Mechanic Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Estimated Cost */}
                                <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Estimated</p>
                                    <p className="text-lg font-black text-white">₹{(b.estimated_cost || 0).toLocaleString('en-IN')}</p>
                                </div>

                                {/* Final Cost */}
                                <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Final Cost</p>
                                    {editingCostId === b.id ? (
                                        <div className="flex gap-2">
                                            <input type="number" className="w-full bg-[#10101e] border border-white/10 rounded-lg px-2 py-1 text-sm text-white font-bold outline-none" placeholder="₹" value={costInput} onChange={e => setCostInput(e.target.value)} autoFocus />
                                            <button onClick={() => handleSetFinalCost(b.id)} className="px-2 py-1 bg-[#34d399] text-black rounded-lg text-xs font-bold">✓</button>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-black text-[#34d399] cursor-pointer hover:underline" onClick={() => { setEditingCostId(b.id); setCostInput(b.final_cost?.toString() || ''); }}>
                                            {b.final_cost ? `₹${b.final_cost.toLocaleString('en-IN')}` : <span className="text-[#55556a] text-sm">Set cost →</span>}
                                        </p>
                                    )}
                                </div>

                                {/* Mechanic */}
                                <div className="bg-[#050508] p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Mechanic</p>
                                    {editingMechanicId === b.id ? (
                                        <div className="flex gap-2">
                                            <input type="text" className="w-full bg-[#10101e] border border-white/10 rounded-lg px-2 py-1 text-sm text-white font-bold outline-none" placeholder="Name" value={mechanicInput} onChange={e => setMechanicInput(e.target.value)} autoFocus />
                                            <button onClick={() => handleSetMechanic(b.id)} className="px-2 py-1 bg-[#a78bfa] text-black rounded-lg text-xs font-bold">✓</button>
                                        </div>
                                    ) : (
                                        <p className="text-base font-black text-white cursor-pointer hover:underline flex items-center gap-1" onClick={() => { setEditingMechanicId(b.id); setMechanicInput(b.mechanic_name || ''); }}>
                                            <Wrench size={12} className="text-[#a78bfa]" />
                                            {b.mechanic_name || <span className="text-[#55556a] text-sm">Assign →</span>}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scheduling & Actions */}
                        <div className="xl:w-80 flex flex-col justify-between items-start xl:items-end border-t xl:border-t-0 xl:border-l border-white/5 pt-8 xl:pt-0 xl:pl-10">
                            <div className="text-left xl:text-right space-y-3 xl:space-y-4 mb-6 xl:mb-8">
                                <div className="flex items-center justify-start xl:justify-end gap-3 text-[#eeeef2] font-black text-lg tracking-tight">
                                    <Calendar size={20} className="text-[#a78bfa]" />
                                    {new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="flex items-center justify-start xl:justify-end gap-2">
                                    <span className={clsx(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg",
                                        b.status === 'pending' ? "bg-[#fbbf24] text-black" :
                                            b.status === 'confirmed' ? "bg-[#00c8ff] text-black" :
                                                b.status === 'in_progress' ? "bg-[#a78bfa] text-black" :
                                                    b.status === 'completed' ? "bg-[#34d399] text-black" : "bg-[#ff2d55] text-white"
                                    )}>
                                        {b.status === 'in_progress' ? 'In Progress' : b.status}
                                    </span>
                                </div>
                                {b.preferred_date && (
                                    <p className="text-xs text-[#55556a] font-bold">
                                        Preferred: {b.preferred_date} • {b.preferred_time}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 xl:gap-4 w-full xl:justify-end">
                                {b.status === 'pending' && (
                                    <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 xl:px-6 py-3 bg-[var(--admin-accent)] text-[var(--admin-accent-contrast)] rounded-2xl font-black text-xs xl:text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                                        <Check size={18} strokeWidth={3} /> Confirm
                                    </button>
                                )}

                                {b.status === 'confirmed' && (
                                    <button onClick={() => updateStatus(b.id, 'in_progress')} disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 xl:px-6 py-3 bg-[#a78bfa] text-black rounded-2xl font-black text-xs xl:text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                                        <Play size={18} strokeWidth={3} /> Start
                                    </button>
                                )}

                                <button onClick={() => handleWhatsAppConfirm(b)}
                                    className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 xl:px-6 py-3 bg-[#25d366] text-white rounded-2xl font-black text-xs xl:text-sm hover:scale-105 transition-all shadow-xl">
                                    <MessageCircle size={18} strokeWidth={3} /> WhatsApp
                                </button>

                                {b.status === 'in_progress' && (
                                    <button onClick={() => updateStatus(b.id, 'completed')} disabled={updatingId === b.id}
                                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 xl:px-6 py-3 bg-[#34d399] text-black rounded-2xl font-black text-xs xl:text-sm hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                                        <CheckCircle size={18} strokeWidth={3} /> Done
                                    </button>
                                )}

                                <button onClick={() => handleDeleteBooking(b.id, b.name)} disabled={updatingId === b.id}
                                    className="p-3 bg-white/5 hover:bg-[#ff2d551a] hover:text-[#ff2d55] rounded-xl transition-all text-[#55556a] border border-white/5"
                                    title="Delete">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* Completion Modal */}
            {completionModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-admin-in">
                    <div className="bg-[#10101e] border-2 border-white/10 rounded-[3rem] p-8 xl:p-12 w-full max-w-xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        {/* Glow */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#34d399] blur-[100px] opacity-10"></div>

                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Finalize Service</h3>
                                <p className="text-[#8888a0] text-sm font-bold">Complete the record for {completionModal.booking?.name}&apos;s {completionModal.booking?.bike_model}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">Current Mileage (KM)*</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 12500"
                                        className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-[#34d399] focus:border-opacity-40 transition-all placeholder:text-[#55556a]"
                                        value={completionModal.km}
                                        onChange={e => setCompletionModal(p => ({ ...p, km: e.target.value }))}
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">Next Service KM (Optional)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 15000"
                                        className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-[#00c8ff] focus:border-opacity-40 transition-all placeholder:text-[#55556a]"
                                        value={completionModal.nextKm}
                                        onChange={e => setCompletionModal(p => ({ ...p, nextKm: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCompletionModal({ show: false, booking: null, km: '', nextKm: '' })}
                                    className="flex-1 py-4 bg-white/5 text-[#8888a0] font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCompleteJob}
                                    disabled={updatingId === completionModal.booking?.id || !completionModal.km}
                                    className="flex-[2] py-4 bg-[#34d399] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#34d39922] disabled:opacity-50"
                                >
                                    {updatingId === completionModal.booking?.id ? 'Processing...' : 'Complete Record'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
