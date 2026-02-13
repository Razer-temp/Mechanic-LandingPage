import React from 'react';
import { LucideIcon, Calendar, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => (
    <div className="bg-[#10101e] border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all group flex flex-col justify-between shadow-xl">
        <div className="flex justify-between items-start mb-6">
            <div
                className="p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${color}1a`, color: color, border: `1px solid ${color}33` }}
            >
                <Icon size={28} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${trend.isUp ? 'bg-[#34d3991a] text-[#34d399] border border-[#34d39933]' : 'bg-[#ff2d551a] text-[#ff2d55] border border-[#ff2d5533]'
                    }`}>
                    {trend.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend.value}
                </div>
            )}
        </div>

        <div>
            <p className="text-[#8888a0] text-xs font-black uppercase tracking-[0.2em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
                {label.includes('Revenue') && <span className="text-[#55556a] font-bold">INR</span>}
            </div>
        </div>
    </div>
);

export default function DashboardStats({ bookings }: { bookings: any[] }) {
    const totalBookings = bookings.length;
    const pendingTasks = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const estimatedRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((acc, b) => acc + (b.service_type.toLowerCase().includes('general') ? 800 : 500), 0);

    const uniqueCustomers = new Set(bookings.map(b => b.phone)).size;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-admin-in">
            <StatCard
                label="Global Bookings"
                value={totalBookings}
                icon={Calendar}
                trend={{ value: '12% vs last week', isUp: true }}
                color="#00c8ff"
            />
            <StatCard
                label="Pending Tasks"
                value={pendingTasks}
                icon={Clock}
                color="#fbbf24"
            />
            <StatCard
                label="Est. Revenue"
                value={`₹${estimatedRevenue}`}
                icon={CheckCircle}
                trend={{ value: 'High Growth', isUp: true }}
                color="#34d399"
            />
            <StatCard
                label="Total Customers"
                value={uniqueCustomers}
                icon={Users}
                color="#a78bfa"
            />
        </div>
    );
}
