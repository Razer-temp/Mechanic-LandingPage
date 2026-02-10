'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Calendar, Clock, Wrench, Bike, Tag, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { Service } from '@/types/database';


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
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-bg-elevated">
                    <div
                        className="h-full bg-accent-base transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="mb-8">
                    <span className="text-xs font-bold text-accent-base uppercase tracking-widest mb-2 block">Step {step} of 3</span>
                    <h1 className="font-heading font-bold text-2xl text-text-primary">
                        {step === 1 && "What work needs to be done?"}
                        {step === 2 && "Select a Service Package"}
                        {step === 3 && "Pick a Date & Time"}
                    </h1>
                </div>

                {/* STEP 1: Bike Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Bike Model</label>
                            <div className="relative">
                                <Bike className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                                <input
                                    value={formData.bikeModel}
                                    onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                                    placeholder="e.g. Royal Enfield Classic 350"
                                    className="w-full bg-bg-void border border-border-subtle rounded-xl py-3 pl-10 text-text-primary outline-none focus:border-accent-base focus:ring-1 focus:ring-accent-base transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Describe any specific issues..."
                                className="w-full bg-bg-void border border-border-subtle rounded-xl p-3 text-text-primary outline-none focus:border-accent-base min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: Service Selection */}
                {step === 2 && (
                    <div className="grid gap-3 animate-in fade-in slide-in-from-right-8 duration-300">
                        {services.map((service) => (
                            <button
                                key={service.id as string}
                                onClick={() => setFormData({ ...formData, serviceId: service.id as string })}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${formData.serviceId === service.id
                                    ? 'bg-accent-base/10 border-accent-base ring-1 ring-accent-base'
                                    : 'bg-bg-void border-border-subtle hover:border-border-accent'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center text-xl shrink-0">
                                    {service.icon || '🔧'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-primary text-sm">{service.name}</h3>
                                    <p className="text-xs text-text-secondary">{service.description || 'Professional service'}</p>
                                </div>
                                <div className="text-accent-base font-bold text-sm">₹{service.base_price}</div>
                            </button>

                        ))}
                    </div>
                )}

                {/* STEP 3: Date & Time */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Select Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-bg-void border border-border-subtle rounded-xl py-3 pl-10 text-text-primary outline-none focus:border-accent-base appearance-none invert-calendar-icon"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">Time Slot</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 w-5 h-5 text-text-muted" />
                                    <select
                                        value={formData.timeSlot}
                                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                        className="w-full bg-bg-void border border-border-subtle rounded-xl py-3 pl-10 text-text-primary outline-none focus:border-accent-base appearance-none"
                                    >
                                        <option value="">Select Time</option>
                                        {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent-base/10 border border-accent-base/20 rounded-xl p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-accent-base shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm text-text-primary mb-1">Almost Done!</h4>
                                <p className="text-xs text-text-secondary">
                                    Your booking for <strong>{services.find(s => s.id === formData.serviceId)?.name}</strong> on <strong>{formData.bikeModel}</strong> will be scheduled.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="mt-8 flex justify-between pt-6 border-t border-border-subtle">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className="px-6 py-2.5 rounded-xl font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => Math.min(3, s + 1))}
                            disabled={!isStepValid()}
                            className="px-6 py-2.5 rounded-xl bg-accent-base text-white font-bold hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-base/20"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!isStepValid() || loading}
                            className="px-8 py-2.5 rounded-xl bg-accent-green text-white font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent-green/20 flex items-center gap-2"
                        >
                            {loading ? <span className="animate-spin">◌</span> : 'Confirm Booking'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
