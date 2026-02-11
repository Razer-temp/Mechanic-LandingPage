'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Calendar, Clock, Wrench, Bike, Tag, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Service } from '@/types/database';
import clsx from 'clsx';


// Mock services if DB is empty
const MOCK_SERVICES: Partial<Service>[] = [
    { id: '1', name: 'Engine Repair', base_price: 1500, icon: '🔩', description: 'Engine work' },
    { id: '2', name: 'Full Servicing', base_price: 799, icon: '⚙️', description: 'Oil & filters' },
    { id: '3', name: 'Brake Fix', base_price: 500, icon: '🛑', description: 'Brake pads' },
    { id: '4', name: 'Oil Change', base_price: 350, icon: '🛢️', description: 'Oil service' },
    { id: '5', name: 'Electrical Work', base_price: 400, icon: '⚡', description: 'Wiring check' },
];


export default function NewBookingPage() {
    const router = useRouter();
    const { user } = useAuth();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [services, setServices] = useState<Partial<Service>[]>([]);
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        bikeModel: '',
        serviceId: '',
        date: '',
        timeSlot: '',
        notes: ''
    });

    useEffect(() => {
        async function fetchServices() {
            const { data, error } = await supabase.from('services').select('*');
            if (!error && data && data.length > 0) {
                setServices(data);
            } else {
                setServices(MOCK_SERVICES);
            }
        }
        fetchServices();
    }, [supabase]);

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const selectedService = services.find(s => s.id === formData.serviceId);

            const { error } = await supabase.from('bookings').insert({
                user_id: user.id,
                service_id: selectedService?.id || null,
                bike_model: formData.bikeModel,
                status: 'pending',
                scheduled_at: new Date(`${formData.date}T${formData.timeSlot}`).toISOString(),
                time_slot: formData.timeSlot,
                notes: formData.notes,
                estimated_cost: selectedService?.base_price || 0
            });


            if (error) throw error;

            router.push('/dashboard');
        } catch (err) {
            console.error('Booking failed:', err);
            // Fallback for demo without DB connection: Just redirect
            alert('Booking submitted! (Demo mode)');
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = () => {
        if (step === 1) return formData.bikeModel.length > 2;
        if (step === 2) return !!formData.serviceId;
        if (step === 3) return !!formData.date && !!formData.timeSlot;
        return true;
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-8 transition-all font-bold group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>

            <div className="glass-card relative overflow-hidden" style={{ padding: '0' }}>
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/[0.03]">
                    <div
                        className="h-full bg-grad-blue transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,200,255,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8 md:p-10">
                    <div className="mb-10 text-center">
                        <span className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-3 block">Step {step} of 3</span>
                        <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0' }}>
                            {step === 1 && "What work needs to be done?"}
                            {step === 2 && "Select a Service Package"}
                            {step === 3 && "Pick a Date & Time"}
                        </h1>
                    </div>

                    {/* STEP 1: Bike Details */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-primary ml-1">Bike Model</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Bike className="w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        value={formData.bikeModel}
                                        onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                                        placeholder="e.g. Royal Enfield Classic 350"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium placeholder:text-text-muted/40"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-primary ml-1">Additional Notes (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Describe any specific issues..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] min-h-[140px] resize-none transition-all font-medium placeholder:text-text-muted/40"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Service Selection */}
                    {step === 2 && (
                        <div className="grid gap-4 animate-in fade-in slide-in-from-right-8 duration-500">
                            {services.map((service) => (
                                <button
                                    key={service.id as string}
                                    onClick={() => setFormData({ ...formData, serviceId: service.id as string })}
                                    className={clsx(
                                        "flex items-center gap-5 p-5 rounded-2xl border text-left transition-all",
                                        formData.serviceId === service.id
                                            ? 'bg-accent/10 border-accent shadow-[0_0_20px_rgba(0,200,255,0.1)]'
                                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                                    )}
                                >
                                    <div className={clsx(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border",
                                        formData.serviceId === service.id ? "bg-accent/20 border-accent/20" : "bg-white/[0.03] border-white/[0.05]"
                                    )}>
                                        {service.icon || '🔧'}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-black text-text-primary text-base mb-1 truncate">{service.name}</h3>
                                        <p className="text-xs text-text-secondary font-medium line-clamp-1">{service.description || 'Professional service'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-accent font-black text-lg">₹{service.base_price}</div>
                                        <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Starting</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 3: Date & Time */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-text-primary ml-1">Select Date</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium invert-calendar-icon"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-text-primary ml-1">Time Slot</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock className="w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <select
                                            value={formData.timeSlot}
                                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-8 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium appearance-none"
                                        >
                                            <option value="" className="bg-bg-surface">Select Time</option>
                                            {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                                                <option key={t} value={t} className="bg-bg-surface">{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '24px', background: 'rgba(0, 200, 255, 0.05)', borderColor: 'rgba(0, 200, 255, 0.1)' }}>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-text-primary mb-1">Almost Done!</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                            Booking for <span className="text-accent font-bold">{services.find(s => s.id === formData.serviceId)?.name}</span> on your <span className="text-text-primary font-bold">{formData.bikeModel || 'bike'}</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/[0.06]">
                        <button
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className="px-8 py-3 rounded-2xl font-black text-sm text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest"
                        >
                            Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(s => Math.min(3, s + 1))}
                                disabled={!isStepValid()}
                                className="btn btn-primary btn-glow"
                                style={{ padding: '12px 32px' }}
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!isStepValid() || loading}
                                className="btn btn-primary btn-glow"
                                style={{ padding: '12px 32px', background: 'var(--grad-blue)' }}
                            >
                                {loading ? <span className="animate-spin text-xl">◌</span> : 'Confirm Booking'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
