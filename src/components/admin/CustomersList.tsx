import React, { useState, useMemo } from 'react';
import {
    User,
    Phone,
    Calendar,
    IndianRupee,
    History,
    TrendingUp,
    Search,
    Filter,
    Users,
    Star
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
        if (!confirm(`CRITICAL WARNING: You are about to permanently purge all data for ${name} (${phone}). This action cannot be reversed. Proceed?`)) {
            return;
        }

        setPurging(phone);
        try {
            // Delete all bookings for this phone number
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('phone', phone);

            if (error) throw error;

            alert(`Customer ${name} and all associated records have been purged.`);
            window.location.reload(); // Refresh to update aggregation
        } catch (err) {
            console.error('Error purging customer:', err);
            alert('Failed to purge customer nodes.');
        }
        setPurging(null);
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
                    bookings: []
                };
            }

            // Refined revenue logic based on actual service name
            const service = b.service_type.toLowerCase();
            let revenue = 500; // Base service fee
            if (service.includes('engine')) revenue = 2500;
            else if (service.includes('brake')) revenue = 1200;
            else if (service.includes('general')) revenue = 800;
            else if (service.includes('oil')) revenue = 600;
            else if (service.includes('chain')) revenue = 700;
            else if (service.includes('battery')) revenue = 1500;
            else if (service.includes('wash')) revenue = 300;

            acc[phone].visits += 1;
            acc[phone].totalRevenue += revenue;

            if (new Date(b.created_at) > new Date(acc[phone].lastVisit)) {
                acc[phone].lastVisit = b.created_at;
            }
            acc[phone].bookings.push({ ...b, calculatedRevenue: revenue });
            return acc;
        }, {});
    }, [bookings]);

    const customers = useMemo(() => {
        return Object.values(customerMap)
            .map((c: any) => {
                let tier = "Standard";
                if (c.visits >= 4 || c.totalRevenue > 5000) tier = "Platinum";
                else if (c.visits >= 2 || c.totalRevenue > 2000) tier = "Gold";
                return { ...c, tier };
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
                <p className="text-[#eeeef2] text-xl font-black">No market data available yet.</p>
                <p className="text-[#55556a] mt-2 font-medium">Customer insights will appear as bookings are processed.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-admin-in">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or mobile..."
                        className="w-full bg-[#10101e] border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-sm focus:border-[#00c8ff33] focus:ring-4 focus:ring-[#00c8ff05] outline-none transition-all placeholder:text-[#333]"
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
                                    filterTier === tier.toLowerCase() ? "bg-[#00c8ff] text-black shadow-lg shadow-[#00c8ff22]" : "text-[#55556a] hover:text-white"
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
                    <p className="text-[#55556a] font-black uppercase tracking-[0.2em]">No results found for your query</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
                    {customers.map((c: any) => (
                        <div
                            key={c.phone}
                            className="group bg-[#10101e] border-2 border-white/5 rounded-[3rem] p-10 hover:border-[#00c8ff/30] transition-all shadow-3xl relative overflow-hidden"
                        >
                            {/* Cinematic Background Glow */}
                            <div
                                className={clsx(
                                    "absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20",
                                    c.tier === 'Platinum' ? "bg-[#00c8ff]" : c.tier === 'Gold' ? "bg-[#a78bfa]" : "bg-white"
                                )}
                            ></div>

                            {/* Customer Header */}
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white/[0.03] border-2 border-white/5 rounded-[2rem] flex items-center justify-center text-[#ff2d55] shadow-2xl transition-transform group-hover:scale-105">
                                        <User size={40} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h4 className="text-3xl font-black text-white tracking-tighter mb-1">{c.name}</h4>
                                        <div className="flex items-center gap-3 text-[#55556a] font-bold text-base">
                                            <Phone size={16} className="text-[#00c8ff]" />
                                            {c.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 mb-2">
                                        <Star size={14} className={c.tier === 'Platinum' ? "text-[#fbbf24] fill-[#fbbf24]" : "text-[#55556a]"} />
                                        <p className="text-[10px] text-[#8888a0] font-black uppercase tracking-[0.3em]">Tier Node</p>
                                    </div>
                                    <span className={clsx(
                                        "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl border",
                                        c.tier === 'Platinum' ? "bg-[#fbbf24] text-black border-[#fbbf2433]" :
                                            c.tier === 'Gold' ? "bg-[#00c8ff] text-black border-[#00c8ff33]" : "bg-white/5 text-[#8888a0] border-white/10"
                                    )}>
                                        {c.tier}
                                    </span>
                                </div>
                            </div>

                            {/* Metrics Command Grid */}
                            <div className="grid grid-cols-3 gap-6 mb-12 relative z-10">
                                <div className="bg-[#050508]/80 p-8 rounded-[2rem] border-2 border-white/5 shadow-inner group/stat hover:border-[#fbbf2433] transition-all">
                                    <History size={20} className="text-[#fbbf24] mb-3 transition-transform group-hover/stat:rotate-[-20deg]" />
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">Visits</p>
                                    <h5 className="text-3xl font-black text-white">{c.visits}</h5>
                                </div>
                                <div className="bg-[#050508]/80 p-8 rounded-[2rem] border-2 border-white/5 shadow-inner group/stat hover:border-[#34d39933] transition-all">
                                    <IndianRupee size={20} className="text-[#34d399] mb-3 transition-transform group-hover/stat:scale-110" />
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">LTV Est.</p>
                                    <h5 className="text-3xl font-black text-white">₹{c.totalRevenue}</h5>
                                </div>
                                <div className="bg-[#050508]/80 p-8 rounded-[2rem] border-2 border-white/5 shadow-inner group/stat hover:border-[#00c8ff33] transition-all">
                                    <Calendar size={20} className="text-[#00c8ff] mb-3 transition-transform group-hover/stat:translate-y-[-2px]" />
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest mb-1">Recency</p>
                                    <h5 className="text-sm font-black text-[#eeeef2] uppercase mt-1">
                                        {new Date(c.lastVisit).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                    </h5>
                                </div>
                            </div>

                            {/* Interaction Log */}
                            <div className="pt-10 border-t border-white/5 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h5 className="text-[11px] text-white font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-[#00c8ff] rounded-full animate-pulse"></div>
                                        Operational History
                                    </h5>
                                    <button
                                        onClick={() => handlePurgeCustomer(c.phone, c.name)}
                                        disabled={purging === c.phone}
                                        className="flex items-center gap-2 text-[10px] font-black text-[#55556a] hover:text-[#ff2d55] transition-all uppercase tracking-widest"
                                    >
                                        {purging === c.phone ? "SYST_PRG..." : "Purge Nodes"}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {c.bookings.slice().reverse().slice(0, 3).map((b: any, idx: number) => (
                                        <div key={b.id + idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-[#8888a0]">
                                                    {(c.bookings.length - idx).toString().padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-xs uppercase tracking-widest">{b.service_type}</p>
                                                    <p className="text-[10px] text-[#55556a] font-bold mt-0.5">{b.bike_model} • Integrated</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                <span className="text-[#34d399] font-black text-sm">₹{b.calculatedRevenue || (b.service_type.toLowerCase().includes('general') ? 800 : 500)}</span>
                                                <span className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">{new Date(b.created_at).toLocaleDateString()}</span>
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
