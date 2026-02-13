import React, { useState, useMemo } from 'react';
import {
    User,
    Phone,
    Calendar,
    IndianRupee,
    History,
    Search,
    Filter,
    Star,
    Bike,
    MessageCircle,
    Hash
} from 'lucide-react';
import clsx from 'clsx';
import { createClient } from '@/lib/supabase/client';

interface CustomersListProps {
    bookings: any[];
}

export default function CustomersList({ bookings }: CustomersListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTier, setFilterTier] = useState<string>('all');
    const [purging, setPurging] = useState<string | null>(null);
    const supabase = createClient();

    const handlePurgeCustomer = async (phone: string, name: string) => {
        if (!confirm(`CRITICAL: Permanently purge all data for ${name} (${phone})?`)) return;
        setPurging(phone);
        try {
            const { error } = await supabase.from('bookings').delete().eq('phone', phone);
            if (error) throw error;
            alert(`Customer ${name} purged.`);
            window.location.reload();
        } catch (err) {
            console.error('Error purging customer:', err);
            alert('Failed to purge.');
        }
        setPurging(null);
    };

    const handleWhatsAppReminder = (phone: string, name: string) => {
        let p = phone.replace(/\D/g, '');
        if (p.length === 10) p = '91' + p;
        const msg = encodeURIComponent(`Hi ${name}, it's been a while since your last visit! Book your next service today and keep your ride in top shape. 🏍️`);
        window.open(`https://wa.me/${p}?text=${msg}`, '_blank');
    };

    // Aggregate customers by phone
    const customerMap = useMemo(() => {
        return bookings.reduce((acc: any, b) => {
            const phone = b.phone;
            if (!acc[phone]) {
                acc[phone] = {
                    name: b.name,
                    phone: b.phone,
                    visits: 0,
                    totalRevenue: 0,
                    lastVisit: b.created_at,
                    bookings: [],
                    vehicles: new Set<string>(),
                    vehicleNumbers: new Set<string>()
                };
            }

            // Real revenue from final_cost
            const revenue = b.final_cost || b.estimated_cost || 0;
            acc[phone].visits += 1;
            acc[phone].totalRevenue += revenue;

            if (new Date(b.created_at) > new Date(acc[phone].lastVisit)) {
                acc[phone].lastVisit = b.created_at;
            }
            acc[phone].bookings.push({ ...b, calculatedRevenue: revenue });
            if (b.bike_model) acc[phone].vehicles.add(b.bike_model);
            if (b.vehicle_number) acc[phone].vehicleNumbers.add(b.vehicle_number);
            return acc;
        }, {});
    }, [bookings]);

    const customers = useMemo(() => {
        return Object.values(customerMap)
            .map((c: any) => {
                let tier = "Standard";
                if (c.visits >= 4 || c.totalRevenue > 5000) tier = "Platinum";
                else if (c.visits >= 2 || c.totalRevenue > 2000) tier = "Gold";

                // Days since last visit
                const daysSince = Math.floor((Date.now() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24));

                return {
                    ...c,
                    tier,
                    daysSince,
                    vehicles: Array.from(c.vehicles),
                    vehicleNumbers: Array.from(c.vehicleNumbers),
                    isInactive: daysSince > 30
                };
            })
            .filter((c: any) => {
                const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
                const matchesTier = filterTier === 'all' || c.tier.toLowerCase() === filterTier.toLowerCase();
                return matchesSearch && matchesTier;
            })
            .sort((a: any, b: any) => b.visits - a.visits);
    }, [customerMap, searchQuery, filterTier]);

    if (Object.keys(customerMap).length === 0) {
        return (
            <div className="text-center py-32 bg-[#10101e] rounded-[3rem] border border-dashed border-white/10 animate-admin-in">
                <div className="text-6xl mb-6">👥</div>
                <p className="text-[#eeeef2] text-xl font-black">No customer data yet.</p>
                <p className="text-[#55556a] mt-2 font-medium">Customer insights appear as bookings are processed.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-admin-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[var(--admin-accent)] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or mobile..."
                        className="w-full bg-[#10101e] border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-sm focus:border-[var(--admin-accent)] focus:border-opacity-30 focus:ring-4 focus:ring-[var(--admin-accent)] focus:ring-opacity-5 outline-none transition-all placeholder:text-[#333]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Filter size={18} className="text-[#55556a] hidden sm:block" />
                    <div className="flex bg-[#10101e] p-1.5 rounded-xl border border-white/5 gap-2 w-full md:w-auto">
                        {['All', 'Platinum', 'Gold', 'Standard'].map((tier) => (
                            <button
                                key={tier}
                                onClick={() => setFilterTier(tier.toLowerCase())}
                                className={clsx(
                                    "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    filterTier === tier.toLowerCase() ? "bg-[var(--admin-accent)] text-[var(--admin-accent-contrast)] shadow-lg shadow-[rgba(var(--admin-accent-rgb),0.2)]" : "text-[#55556a] hover:text-white"
                                )}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {customers.length === 0 ? (
                <div className="py-20 text-center bg-[#10101e] rounded-[3rem] border border-white/5">
                    <p className="text-[#55556a] font-black uppercase tracking-[0.2em]">No results found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
                    {customers.map((c: any) => (
                        <div
                            key={c.phone}
                            className="group bg-[#10101e] border-2 border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 hover:border-[var(--admin-accent)] hover:border-opacity-30 transition-all shadow-3xl relative overflow-hidden"
                        >
                            {/* Glow */}
                            <div className={clsx(
                                "absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20",
                                c.tier === 'Platinum' ? "bg-[#fbbf24]" : c.tier === 'Gold' ? "bg-[var(--admin-accent)]" : "bg-white"
                            )}></div>

                            {/* Customer Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 sm:mb-10 relative z-10">
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/[0.03] border-2 border-white/5 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-[#ff2d55] shadow-2xl transition-transform group-hover:scale-105">
                                        <User size={30} strokeWidth={2.5} className="sm:hidden" />
                                        <User size={40} strokeWidth={2.5} className="hidden sm:block" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xl sm:text-3xl font-black text-white tracking-tighter mb-1 truncate max-w-[150px] sm:max-w-none">{c.name}</h4>
                                        <div className="flex items-center gap-2 text-[#55556a] font-bold text-sm sm:text-base">
                                            <Phone size={14} className="text-[var(--admin-accent)]" />
                                            {c.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                                    <div className="flex items-center gap-2 sm:mb-2">
                                        <Star size={12} className={c.tier === 'Platinum' ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#55556a]"} />
                                        <p className="text-[8px] sm:text-[10px] text-[#8888a0] font-black uppercase tracking-[0.3em]">Tier</p>
                                    </div>
                                    <span className={clsx(
                                        "px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-xs font-black uppercase tracking-widest shadow-2xl border",
                                        c.tier === 'Platinum' ? "bg-[#fbbf24] text-black border-[#fbbf2433]" :
                                            c.tier === 'Gold' ? "bg-[var(--admin-accent)] text-[var(--admin-accent-contrast)] border-[rgba(var(--admin-accent-rgb),0.2)]" : "bg-white/5 text-[#8888a0] border-white/10"
                                    )}>
                                        {c.tier}
                                    </span>
                                </div>
                            </div>

                            {/* Vehicles */}
                            {c.vehicles.length > 0 && (
                                <div className="mb-6 relative z-10">
                                    <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-2">Vehicles</p>
                                    <div className="flex flex-wrap gap-2">
                                        {c.vehicles.map((v: string, i: number) => (
                                            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl text-xs font-bold text-white">
                                                <Bike size={12} className="text-[#fbbf24]" />
                                                {v}
                                                {c.vehicleNumbers[i] && <span className="text-[8px] text-[#55556a] ml-1">({c.vehicleNumbers[i]})</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 relative z-10">
                                <div className="bg-[#050508]/80 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 border-white/5 shadow-inner">
                                    <History size={16} className="text-[#fbbf24] mb-2" />
                                    <p className="text-[8px] sm:text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">Visits</p>
                                    <h5 className="text-2xl sm:text-3xl font-black text-white">{c.visits}</h5>
                                </div>
                                <div className="bg-[#050508]/80 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 border-white/5 shadow-inner">
                                    <IndianRupee size={16} className="text-[#34d399] mb-2" />
                                    <p className="text-[8px] sm:text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">LTV</p>
                                    <h5 className="text-2xl sm:text-3xl font-black text-white">₹{c.totalRevenue.toLocaleString('en-IN')}</h5>
                                </div>
                                <div className="col-span-2 md:col-span-1 bg-[#050508]/80 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border-2 border-white/5 shadow-inner">
                                    <Calendar size={16} className="text-[#00c8ff] mb-2" />
                                    <p className="text-[8px] sm:text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">Last Visit</p>
                                    <h5 className="text-xs sm:text-sm font-black text-[#eeeef2] uppercase mt-1">
                                        {new Date(c.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </h5>
                                    {c.isInactive && (
                                        <span className="text-[8px] font-black text-[#ff2d55] uppercase tracking-widest">{c.daysSince}d ago</span>
                                    )}
                                </div>
                            </div>

                            {/* Service History + Actions */}
                            <div className="pt-6 sm:pt-8 border-t border-white/5 relative z-10">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h5 className="text-[9px] sm:text-[11px] text-white font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-2 sm:gap-3">
                                        <div className="w-1.5 h-1.5 bg-[#00c8ff] rounded-full animate-pulse"></div>
                                        Service History
                                    </h5>
                                    <div className="flex items-center gap-3">
                                        {c.isInactive && (
                                            <button
                                                onClick={() => handleWhatsAppReminder(c.phone, c.name)}
                                                className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-black text-[#25d366] hover:text-[#34d399] transition-all uppercase tracking-widest"
                                            >
                                                <MessageCircle size={12} /> Remind
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handlePurgeCustomer(c.phone, c.name)}
                                            disabled={purging === c.phone}
                                            className="flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-[#55556a] hover:text-[#ff2d55] transition-all uppercase tracking-widest"
                                        >
                                            {purging === c.phone ? "Purging..." : "Purge"}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    {c.bookings.slice().reverse().slice(0, 4).map((b: any, idx: number) => (
                                        <div key={b.id + idx} className="flex items-center justify-between p-4 sm:p-5 bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all gap-4">
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-[8px] sm:text-[10px] font-black text-[#8888a0]">
                                                    {(c.bookings.length - idx).toString().padStart(2, '0')}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-black text-[10px] sm:text-xs uppercase tracking-widest truncate">{b.service_type}</p>
                                                    <p className="text-[8px] sm:text-[10px] text-[#55556a] font-bold mt-0.5 truncate">{b.bike_model}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-[#34d399] font-black text-xs sm:text-sm">₹{b.calculatedRevenue.toLocaleString('en-IN')}</span>
                                                <span className="text-[7px] sm:text-[9px] text-[#55556a] font-black uppercase tracking-widest">{new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
