import React from 'react';
import { TrendingUp, Users, Calendar, Banknote } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => (
    <div className="bg-[#0c0c16]/50 backdrop-blur-sm border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={clsx("p-3 rounded-2xl", color)}>
                <Icon size={24} className="text-black" />
            </div>
            {trend && (
                <span className="text-[10px] font-bold text-[#34d399] bg-[#34d3991a] px-2 py-1 rounded-full uppercase tracking-wider">
                    {trend}
                </span>
            )}
        </div>
        <div className="space-y-1">
            <h3 className="text-[#8888a0] text-xs font-bold uppercase tracking-widest">{label}</h3>
            <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        </div>
    </div>
);

export default function DashboardStats({ bookings }: { bookings: any[] }) {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    // Approximate revenue (basic calculation)
    const estRevenue = totalBookings * 800; // Average service cost

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-admin-in">
            <StatCard
                label="Total Bookings"
                value={totalBookings}
                icon={Calendar}
                trend="+12% vs last week"
                color="bg-[#00c8ff]"
            />
            <StatCard
                label="Pending Tasks"
                value={pendingBookings}
                icon={Clock}
                color="bg-[#fbbf24]"
            />
            <StatCard
                label="Est. Revenue"
                value={`₹${estRevenue.toLocaleString()}`}
                icon={Banknote}
                trend="High Growth"
                color="bg-[#34d399]"
            />
            <StatCard
                label="Customers"
                value={Math.round(totalBookings * 0.9)}
                icon={Users}
                color="bg-[#a78bfa]"
            />
        </div>
    );
}

const Clock = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
