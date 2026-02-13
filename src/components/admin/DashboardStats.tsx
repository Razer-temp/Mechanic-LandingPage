import React, { useMemo } from 'react';
import { LucideIcon, Calendar, CheckCircle, Clock, Users, ArrowUpRight, ArrowDownRight, ChevronRight, IndianRupee, Wrench, TrendingUp } from 'lucide-react';
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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-500",
                    "lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0",
                    "opacity-100 translate-y-0",
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

// Mini bar chart for weekly bookings
const WeeklySparkline = ({ bookings }: { bookings: any[] }) => {
    const days = useMemo(() => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = bookings.filter(b => b.created_at?.startsWith(dateStr)).length;
            result.push({
                label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
                count,
                isToday: i === 0
            });
        }
        return result;
    }, [bookings]);

    const max = Math.max(...days.map(d => d.count), 1);

    return (
        <div className="flex items-end gap-2 h-16">
            {days.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div
                        className={clsx(
                            "w-full rounded-t-md transition-all min-h-[4px]",
                            d.isToday ? "bg-[#00c8ff]" : "bg-white/10"
                        )}
                        style={{ height: `${(d.count / max) * 48}px` }}
                    ></div>
                    <span className={clsx(
                        "text-[8px] font-black uppercase",
                        d.isToday ? "text-[#00c8ff]" : "text-[#55556a]"
                    )}>{d.label}</span>
                </div>
            ))}
        </div>
    );
};

export default function DashboardStats({ bookings, onExplore }: { bookings: any[], onExplore?: (type: string) => void }) {
    const totalBookings = bookings.length;
    const pendingTasks = bookings.filter(b => b.status === 'pending').length;
    const inProgressTasks = bookings.filter(b => b.status === 'in_progress').length;

    // Real revenue from final_cost field
    const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((acc, b) => acc + (b.final_cost || 0), 0);

    const uniqueCustomers = new Set(bookings.map(b => b.phone)).size;

    // Today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.created_at?.startsWith(today));
    const todayRevenue = todayBookings
        .filter(b => b.status === 'completed')
        .reduce((acc: number, b: any) => acc + (b.final_cost || 0), 0);
    const todayCompleted = todayBookings.filter(b => b.status === 'completed').length;

    // Average job value
    const completedBookings = bookings.filter(b => b.status === 'completed' && b.final_cost > 0);
    const avgJobValue = completedBookings.length > 0
        ? Math.round(completedBookings.reduce((a: number, b: any) => a + b.final_cost, 0) / completedBookings.length)
        : 0;

    return (
        <div className="space-y-8 animate-admin-in">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                <StatCard
                    label="Total Bookings"
                    value={totalBookings}
                    icon={Calendar}
                    trend={{ value: `${todayBookings.length} today`, isUp: todayBookings.length > 0 }}
                    color="#00c8ff"
                    onExplore={() => onExplore?.('all_bookings')}
                />
                <StatCard
                    label="Pending Queue"
                    value={pendingTasks}
                    icon={Clock}
                    trend={inProgressTasks > 0 ? { value: `${inProgressTasks} in progress`, isUp: true } : { value: 'Clear', isUp: true }}
                    color="#fbbf24"
                    onExplore={() => onExplore?.('pending')}
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                    icon={IndianRupee}
                    trend={{ value: `Avg ₹${avgJobValue}`, isUp: true }}
                    color="#34d399"
                    onExplore={() => onExplore?.('revenue')}
                />
                <StatCard
                    label="Unique Customers"
                    value={uniqueCustomers}
                    icon={Users}
                    trend={{ value: `${completedBookings.length} jobs done`, isUp: true }}
                    color="#a78bfa"
                    onExplore={() => onExplore?.('customers')}
                />
            </div>

            {/* Today's Pulse + Weekly Sparkline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Pulse */}
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 blur-[100px] opacity-5 bg-[#00c8ff]"></div>
                    <h4 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00c8ff] rounded-full animate-pulse"></div>
                        Today&apos;s Pulse
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-3xl font-black text-white">{todayBookings.length}</p>
                            <p className="text-[9px] font-black text-[#55556a] uppercase tracking-widest mt-1">Bookings</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#34d399]">₹{todayRevenue.toLocaleString('en-IN')}</p>
                            <p className="text-[9px] font-black text-[#55556a] uppercase tracking-widest mt-1">Revenue</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-[#fbbf24]">{todayCompleted}</p>
                            <p className="text-[9px] font-black text-[#55556a] uppercase tracking-widest mt-1">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Weekly Trend */}
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 blur-[100px] opacity-5 bg-[#a78bfa]"></div>
                    <h4 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <TrendingUp size={12} className="text-[#a78bfa]" />
                        7-Day Booking Trend
                    </h4>
                    <WeeklySparkline bookings={bookings} />
                </div>
            </div>
        </div>
    );
}
