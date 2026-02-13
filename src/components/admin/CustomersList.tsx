import React from 'react';
import { User, Phone, Calendar, IndianRupee, History, TrendingUp, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface CustomersListProps {
    bookings: any[];
}

export default function CustomersList({ bookings }: CustomersListProps) {
    // Aggregate customers by phone
    const customerMap = bookings.reduce((acc: any, b) => {
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
        acc[phone].visits += 1;
        acc[phone].totalRevenue += (b.service_type.toLowerCase().includes('general') ? 800 : 500);
        if (new Date(b.created_at) > new Date(acc[phone].lastVisit)) {
            acc[phone].lastVisit = b.created_at;
        }
        acc[phone].bookings.push(b);
        return acc;
    }, {});

    const customers = Object.values(customerMap).sort((a: any, b: any) => b.visits - a.visits);

    if (customers.length === 0) {
        return (
            <div className="text-center py-32 bg-[#10101e] rounded-[2.5rem] border border-dashed border-white/10 animate-admin-in">
                <div className="text-6xl mb-6">👥</div>
                <p className="text-[#eeeef2] text-lg font-bold">No customers recorded in the database yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-admin-in">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {customers.map((c: any) => (
                    <div
                        key={c.phone}
                        className="group bg-[#10101e] border border-white/10 rounded-[2.5rem] p-8 xl:p-10 hover:border-[#00c8ff/30] transition-all shadow-2xl relative overflow-hidden"
                    >
                        {/* Customer Header */}
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#ff2d551a] border border-[#ff2d5533] rounded-2xl flex items-center justify-center text-[#ff2d55] shadow-inner">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tight">{c.name}</h4>
                                    <div className="flex items-center gap-2 text-[#8888a0] font-bold text-sm mt-1">
                                        <Phone size={14} className="text-[#00c8ff]" />
                                        {c.phone}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em] mb-1">Loyalty Tier</p>
                                <span className={clsx(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg",
                                    c.visits > 3 ? "bg-[#00c8ff] text-black" :
                                        c.visits > 1 ? "bg-[#a78bfa] text-black" : "bg-white/5 text-[#8888a0]"
                                )}>
                                    {c.visits > 3 ? "Platinum" : c.visits > 1 ? "Gold" : "Standard"}
                                </span>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-4 xl:gap-6 mb-10">
                            <div className="bg-[#050508]/50 p-6 rounded-3xl border border-white/5 space-y-2">
                                <History size={18} className="text-[#fbbf24] mb-1" />
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-wider">Total Visits</p>
                                <h5 className="text-2xl font-black text-white">{c.visits}</h5>
                            </div>
                            <div className="bg-[#050508]/50 p-6 rounded-3xl border border-white/5 space-y-2">
                                <IndianRupee size={18} className="text-[#34d399] mb-1" />
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-wider">Revenue</p>
                                <h5 className="text-2xl font-black text-white">₹{c.totalRevenue}</h5>
                            </div>
                            <div className="bg-[#050508]/50 p-6 rounded-3xl border border-white/5 space-y-2">
                                <Calendar size={18} className="text-[#00c8ff] mb-1" />
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-wider">Last Interaction</p>
                                <h5 className="text-xs font-black text-white uppercase mt-1">
                                    {new Date(c.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </h5>
                            </div>
                        </div>

                        {/* Recent History Preview */}
                        <div className="pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="text-[10px] text-[#8888a0] font-black uppercase tracking-[0.2em]">Service Timeline</h5>
                                <TrendingUp size={14} className="text-[#34d399]" />
                            </div>
                            <div className="space-y-3">
                                {c.bookings.slice(0, 2).map((b: any) => (
                                    <div key={b.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl border border-white/5 text-xs">
                                        <span className="text-[#eeeef2] font-bold">{b.service_type}</span>
                                        <span className="text-[#55556a] font-medium">{new Date(b.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
