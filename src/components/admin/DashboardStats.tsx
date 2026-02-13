import React from 'react';
import { LucideIcon, Calendar, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color: string;
    onExplore?: () => void;
}

const StatCard = ({ label, value, icon: Icon, trend, color, onExplore }: StatCardProps) => (
    <div
        onClick={onExplore}
        className="bg-[#10101e] border border-white/10 p-6 xl:p-8 rounded-[2.5rem] hover:border-white/20 transition-all group flex flex-col h-full shadow-xl relative overflow-hidden cursor-pointer active:scale-95"
    >
        {/* Background Glow */}
        <div
            className="absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-30"
            style={{ backgroundColor: color }}
        ></div>

        <div className="flex justify-between items-center mb-10 relative z-10">
            <div
                className="p-3 xl:p-4 rounded-xl xl:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${color}1a`, color: color, border: `1px solid ${color}33` }}
            >
                <Icon size={24} className="xl:hidden" />
                <Icon size={28} className="hidden xl:block" />
            </div>

            {trend && (
                <div className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-500 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                    trend.isUp ? 'bg-[#34d3991a] text-[#34d399] border border-[#34d39933]' : 'bg-[#ff2d551a] text-[#ff2d55] border border-[#ff2d5533]'
                )}>
                    {trend.isUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                    {trend.value}
                </div>
            )}
        </div>

        <div className="flex-1 relative z-10 mt-auto">
            <p className="text-[#8888a0] text-[10px] xl:text-xs font-black uppercase tracking-[0.3em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-3xl xl:text-5xl font-black text-white tracking-tighter truncate leading-none">{value}</h4>
                {label.includes('Revenue') && <span className="text-[#55556a] text-xs font-black uppercase tracking-widest">INR</span>}
            </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#55556a] group-hover:text-white transition-all relative z-10">
            <span className="relative">
                Explore Analytics
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300"></span>
            </span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);


export default function DashboardStats({ bookings, onExplore }: { bookings: any[], onExplore?: (type: string) => void }) {
    const totalBookings = bookings.length;
    const pendingTasks = bookings.filter(b => b.status === 'pending').length;

    // Refined revenue calculation logic synced with CustomersList
    const estimatedRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((acc, b) => {
            const service = b.service_type.toLowerCase();
            let revenue = 500;
            if (service.includes('engine')) revenue = 2500;
            else if (service.includes('brake')) revenue = 1200;
            else if (service.includes('general')) revenue = 800;
            else if (service.includes('oil')) revenue = 600;
            else if (service.includes('chain')) revenue = 700;
            else if (service.includes('battery')) revenue = 1500;
            else if (service.includes('wash')) revenue = 300;
            return acc + revenue;
        }, 0);

    const uniqueCustomers = new Set(bookings.map(b => b.phone)).size;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 animate-admin-in">
            <StatCard
                label="System Bookings"
                value={totalBookings}
                icon={Calendar}
                trend={{ value: '+12.4%', isUp: true }}
                color="#00c8ff"
                onExplore={() => onExplore?.('all_bookings')}
            />
            <StatCard
                label="Pending Queue"
                value={pendingTasks}
                icon={Clock}
                trend={{ value: 'Priority High', isUp: false }}
                color="#fbbf24"
                onExplore={() => onExplore?.('pending')}
            />
            <StatCard
                label="Gross Revenue"
                value={`₹${estimatedRevenue}`}
                icon={CheckCircle}
                trend={{ value: 'Robust', isUp: true }}
                color="#34d399"
                onExplore={() => onExplore?.('revenue')}
            />
            <StatCard
                label="Primary Assets"
                value={uniqueCustomers}
                icon={Users}
                trend={{ value: 'Loyalty Up', isUp: true }}
                color="#a78bfa"
                onExplore={() => onExplore?.('customers')}
            />
        </div>
    );
}
