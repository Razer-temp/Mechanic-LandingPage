'use client';

import React, { useState, useMemo } from 'react';
import {
    IndianRupee,
    TrendingUp,
    TrendingDown,
    Plus,
    Trash2,
    Calendar,
    Wrench,
    Fuel,
    Home,
    Zap,
    Users,
    Hammer,
    MoreHorizontal,
    ArrowUpRight,
    PieChart
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

interface RevenueAnalyticsProps {
    bookings: any[];
    expenses: any[];
    onExpenseChange: () => void;
}

const EXPENSE_CATEGORIES = [
    { value: 'parts', label: 'Parts', icon: Wrench, color: '#00c8ff' },
    { value: 'rent', label: 'Rent', icon: Home, color: '#a78bfa' },
    { value: 'utilities', label: 'Utilities', icon: Zap, color: '#fbbf24' },
    { value: 'wages', label: 'Wages', icon: Users, color: '#34d399' },
    { value: 'tools', label: 'Tools', icon: Hammer, color: '#ff6b6b' },
    { value: 'fuel', label: 'Fuel', icon: Fuel, color: '#f97316' },
    { value: 'misc', label: 'Misc', icon: MoreHorizontal, color: '#8888a0' },
];

export default function RevenueAnalytics({ bookings, expenses, onExpenseChange }: RevenueAnalyticsProps) {
    const supabase = createClient();
    const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d');
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState({ category: 'parts', description: '', amount: '' });
    const [saving, setSaving] = useState(false);

    // Period filter
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const filteredBookings = useMemo(() =>
        bookings.filter(b => new Date(b.created_at) >= cutoff),
        [bookings, period]
    );

    const filteredExpenses = useMemo(() =>
        expenses.filter(e => new Date(e.date) >= cutoff),
        [expenses, period]
    );

    // Revenue stats
    const totalRevenue = filteredBookings
        .filter(b => b.status === 'completed')
        .reduce((acc: number, b: any) => acc + (b.final_cost || 0), 0);

    const totalExpenses = filteredExpenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
    const profit = totalRevenue - totalExpenses;

    const completedJobs = filteredBookings.filter(b => b.status === 'completed').length;
    const avgJobValue = completedJobs > 0 ? Math.round(totalRevenue / completedJobs) : 0;

    // Daily revenue chart (last 7 days)
    const dailyData = useMemo(() => {
        const result = [];
        const days = period === '7d' ? 7 : period === '30d' ? 14 : 30;
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dayRevenue = bookings
                .filter(b => b.created_at?.startsWith(dateStr) && b.status === 'completed')
                .reduce((acc: number, b: any) => acc + (b.final_cost || 0), 0);

            const dayExpense = expenses
                .filter(e => e.date === dateStr)
                .reduce((acc: number, e: any) => acc + (e.amount || 0), 0);

            result.push({
                label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
                revenue: dayRevenue,
                expense: dayExpense,
                isToday: i === 0
            });
        }
        return result;
    }, [bookings, expenses, period]);

    const maxChart = Math.max(...dailyData.map(d => Math.max(d.revenue, d.expense)), 1);

    // Service breakdown
    const serviceBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        filteredBookings
            .filter(b => b.status === 'completed' && b.final_cost > 0)
            .forEach((b: any) => {
                map[b.service_type] = (map[b.service_type] || 0) + b.final_cost;
            });
        return Object.entries(map)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue);
    }, [filteredBookings]);

    const serviceColors = ['#00c8ff', '#34d399', '#fbbf24', '#a78bfa', '#ff6b6b', '#f97316', '#ec4899', '#8b5cf6'];

    // Most popular service
    const serviceCountMap: Record<string, number> = {};
    filteredBookings.forEach((b: any) => {
        serviceCountMap[b.service_type] = (serviceCountMap[b.service_type] || 0) + 1;
    });
    const mostPopular = Object.entries(serviceCountMap).sort(([, a], [, b]) => b - a)[0];

    // Add expense handler
    const handleAddExpense = async () => {
        if (!newExpense.description || !newExpense.amount) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('daily_expenses').insert({
                category: newExpense.category as 'parts' | 'rent' | 'utilities' | 'wages' | 'tools' | 'fuel' | 'misc',
                description: newExpense.description,
                amount: parseFloat(newExpense.amount),
                date: new Date().toISOString().split('T')[0]
            });
            if (error) throw error;
            setNewExpense({ category: 'parts', description: '', amount: '' });
            setShowAddExpense(false);
            onExpenseChange();
        } catch (err) {
            console.error('Error adding expense:', err);
            alert('Failed to add expense');
        }
        setSaving(false);
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Delete this expense?')) return;
        try {
            await supabase.from('daily_expenses').delete().eq('id', id);
            onExpenseChange();
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    return (
        <div className="space-y-10 animate-admin-in">
            {/* Period Toggle */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#34d399] rounded-full shadow-[0_0_20px_rgba(52,211,153,0.4)]"></div>
                    Revenue Command
                </h3>
                <div className="flex bg-[#10101e] p-1.5 rounded-xl border border-white/5 gap-1">
                    {(['7d', '30d', 'all'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                period === p ? "bg-[#34d399] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                            )}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Revenue / Expense / Profit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 blur-[80px] opacity-10 bg-[#34d399]"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#34d3991a] rounded-xl text-[#34d399]"><TrendingUp size={20} /></div>
                        <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em]">Revenue</p>
                    </div>
                    <h4 className="text-4xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</h4>
                    <p className="text-xs text-[#55556a] mt-2 font-bold">{completedJobs} completed jobs • Avg ₹{avgJobValue}</p>
                </div>

                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 blur-[80px] opacity-10 bg-[#ff2d55]"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#ff2d551a] rounded-xl text-[#ff2d55]"><TrendingDown size={20} /></div>
                        <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em]">Expenses</p>
                    </div>
                    <h4 className="text-4xl font-black text-white">₹{totalExpenses.toLocaleString('en-IN')}</h4>
                    <p className="text-xs text-[#55556a] mt-2 font-bold">{filteredExpenses.length} entries logged</p>
                </div>

                <div className={clsx(
                    "bg-[#10101e] border rounded-3xl p-8 relative overflow-hidden",
                    profit >= 0 ? "border-[#34d39933]" : "border-[#ff2d5533]"
                )}>
                    <div className={clsx("absolute -right-8 -top-8 w-32 h-32 blur-[80px] opacity-10", profit >= 0 ? "bg-[#34d399]" : "bg-[#ff2d55]")}></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={clsx("p-2 rounded-xl", profit >= 0 ? "bg-[#34d3991a] text-[#34d399]" : "bg-[#ff2d551a] text-[#ff2d55]")}>
                            <IndianRupee size={20} />
                        </div>
                        <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em]">Net Profit</p>
                    </div>
                    <h4 className={clsx("text-4xl font-black", profit >= 0 ? "text-[#34d399]" : "text-[#ff2d55]")}>
                        {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')}
                    </h4>
                    <p className="text-xs text-[#55556a] mt-2 font-bold">
                        Margin: {totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0}%
                    </p>
                </div>
            </div>

            {/* Revenue vs Expense Chart */}
            <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8">
                <h4 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <Calendar size={12} className="text-[#00c8ff]" />
                    Daily Revenue vs Expenses
                    <span className="ml-auto flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34d399]"></span>Revenue</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff2d55]"></span>Expense</span>
                    </span>
                </h4>
                <div className="flex items-end gap-2 h-48">
                    {dailyData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                <p className="text-[#34d399]">₹{d.revenue.toLocaleString('en-IN')}</p>
                                <p className="text-[#ff2d55]">-₹{d.expense.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="w-full flex gap-0.5 items-end justify-center">
                                <div
                                    className="flex-1 rounded-t-sm bg-[#34d399] transition-all min-h-[2px] max-w-[12px]"
                                    style={{ height: `${(d.revenue / maxChart) * 160}px` }}
                                ></div>
                                <div
                                    className="flex-1 rounded-t-sm bg-[#ff2d55] transition-all min-h-[2px] max-w-[12px]"
                                    style={{ height: `${(d.expense / maxChart) * 160}px` }}
                                ></div>
                            </div>
                            <span className={clsx(
                                "text-[7px] font-black uppercase mt-1",
                                d.isToday ? "text-[#00c8ff]" : "text-[#333]"
                            )}>{d.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Breakdown + Expense Logger */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Breakdown */}
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8">
                    <h4 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <PieChart size={12} className="text-[#a78bfa]" />
                        Revenue by Service
                    </h4>
                    {serviceBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {serviceBreakdown.map((s, i) => {
                                const pct = totalRevenue > 0 ? Math.round((s.revenue / totalRevenue) * 100) : 0;
                                return (
                                    <div key={s.name} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">{s.name}</span>
                                            <span className="text-sm font-black text-[#34d399]">₹{s.revenue.toLocaleString('en-IN')} ({pct}%)</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, backgroundColor: serviceColors[i % serviceColors.length] }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-[#55556a] text-sm font-bold text-center py-8">No completed jobs in this period</p>
                    )}

                    {mostPopular && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-[9px] font-black text-[#55556a] uppercase tracking-widest mb-1">Most Popular Service</p>
                            <p className="text-lg font-black text-white">{mostPopular[0]} <span className="text-[#00c8ff]">({mostPopular[1]} jobs)</span></p>
                        </div>
                    )}
                </div>

                {/* Expense Logger */}
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] flex items-center gap-2">
                            <IndianRupee size={12} className="text-[#ff2d55]" />
                            Expense Tracker
                        </h4>
                        <button
                            onClick={() => setShowAddExpense(!showAddExpense)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff2d551a] text-[#ff2d55] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#ff2d5533] transition-all"
                        >
                            <Plus size={12} />
                            Log Expense
                        </button>
                    </div>

                    {/* Add Expense Form */}
                    {showAddExpense && (
                        <div className="mb-6 p-6 bg-[#050508] rounded-2xl border border-white/5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {EXPENSE_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setNewExpense(prev => ({ ...prev, category: cat.value }))}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border",
                                            newExpense.category === cat.value
                                                ? "border-white/20 bg-white/10 text-white"
                                                : "border-white/5 text-[#55556a] hover:text-white"
                                        )}
                                    >
                                        <cat.icon size={12} style={{ color: cat.color }} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Description..."
                                className="w-full bg-[#10101e] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#ff2d5533]"
                                value={newExpense.description}
                                onChange={e => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Amount ₹"
                                    className="flex-1 bg-[#10101e] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#ff2d5533]"
                                    value={newExpense.amount}
                                    onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                />
                                <button
                                    onClick={handleAddExpense}
                                    disabled={saving}
                                    className="px-6 py-3 bg-[#ff2d55] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {saving ? '...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Expense List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar-minimal">
                        {filteredExpenses.length > 0 ? filteredExpenses
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((e: any) => {
                                const cat = EXPENSE_CATEGORIES.find(c => c.value === e.category);
                                const CatIcon = cat?.icon || MoreHorizontal;
                                return (
                                    <div key={e.id} className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all group">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat?.color || '#888'}1a` }}>
                                            <CatIcon size={16} style={{ color: cat?.color || '#888' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{e.description}</p>
                                            <p className="text-[9px] font-bold text-[#55556a] uppercase tracking-widest">
                                                {cat?.label} • {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <p className="text-sm font-black text-[#ff2d55]">-₹{e.amount.toLocaleString('en-IN')}</p>
                                        <button
                                            onClick={() => handleDeleteExpense(e.id)}
                                            className="p-2 text-[#55556a] hover:text-[#ff2d55] opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            }) : (
                            <p className="text-[#55556a] text-sm font-bold text-center py-8">No expenses logged</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
