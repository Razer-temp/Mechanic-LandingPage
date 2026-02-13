import React from 'react';
import { LucideIcon, Calendar, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color: string;
    onViewAll?: () => void;
}

const StatCard = ({ label, value, icon: Icon, trend, color, onViewAll }: StatCardProps) => (
    <div className="bg-[#10101e] border border-white/10 p-6 xl:p-8 rounded-[2rem] hover:border-white/20 transition-all group flex flex-col h-full shadow-xl">
        <div className="flex justify-between items-start mb-6">
            <div
                className="p-3 xl:p-4 rounded-xl xl:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${color}1a`, color: color, border: `1px solid ${color}33` }}
            >
                <Icon size={24} className="xl:hidden" />
                <Icon size={28} className="hidden xl:block" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm hidden sm:flex ${trend.isUp ? 'bg-[#34d3991a] text-[#34d399] border border-[#34d39933]' : 'bg-[#ff2d551a] text-[#ff2d55] border border-[#ff2d5533]'
                    }`}>
                    {trend.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend.value}
                </div>
            )}
        </div>

        <div className="flex-1">
            <p className="text-[#8888a0] text-[10px] xl:text-xs font-black uppercase tracking-[0.2em] mb-1 xl:mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-3xl xl:text-4xl font-black text-white tracking-tighter truncate">{value}</h4>
                {label.includes('Revenue') && <span className="text-[#55556a] text-xs font-bold">INR</span>}
            </div>
        </div>

        {onViewAll && (
            <button
                onClick={onViewAll}
                className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#55556a] hover:text-white transition-colors group/btn"
            >
                View Analytics
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        )}
    </div>
);

export default function DashboardStats({ bookings, onTabChange }: { bookings: any[], onTabChange?: (tab: 'bookings' | 'chats') => void }) {
    const totalBookings = bookings.length;
    const pendingTasks = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    const estimatedRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((acc, b) => acc + (b.service_type.toLowerCase().includes('general') ? 800 : 500), 0);

    const uniqueCustomers = new Set(bookings.map(b => b.phone)).size;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 animate-admin-in overflow-hidden">
            <StatCard
                label="Global Bookings"
                value={totalBookings}
                icon={Calendar}
                trend={{ value: '12% vs last week', isUp: true }}
                color="#00c8ff"
                onViewAll={() => onTabChange?.('bookings')}
            />
            <StatCard
                label="Pending Tasks"
                value={pendingTasks}
                icon={Clock}
                color="#fbbf24"
                onViewAll={() => onTabChange?.('bookings')}
            />
            <StatCard
                label="Est. Revenue"
                value={`₹${estimatedRevenue}`}
                icon={CheckCircle}
                trend={{ value: 'High Growth', isUp: true }}
                color="#34d399"
                onViewAll={() => onTabChange?.('bookings')}
            />
            <StatCard
                label="Intelligence Logs"
                value={totalBookings > 0 ? (totalBookings * 1.5).toFixed(0) : 0}
                icon={Users}
                color="#a78bfa"
                onViewAll={() => onTabChange?.('chats')}
            />
        </div>
    );
}
