'use client';

import React, { useState, useEffect } from 'react';
import {
    Mail,
    Phone,
    Search,
    Copy,
    Trash2,
    UserCheck,
    UserMinus,
    Download,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';
import type { Subscriber } from '@/types/database';

export default function SubscribersManager() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (err) {
            console.error('Error fetching subscribers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'unsubscribed' : 'active';
        try {
            const { error } = await supabase
                .from('subscribers')
                .update({ status: newStatus as any })
                .eq('id', id);

            if (error) throw error;
            setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        try {
            const { error } = await supabase
                .from('subscribers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSubscribers(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Error deleting subscriber:', err);
        }
    };

    const copyAllEmails = () => {
        const emails = subscribers
            .filter(s => s.status === 'active' && s.email)
            .map(s => s.email)
            .join(', ');

        navigator.clipboard.writeText(emails);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const filteredSubscribers = subscribers.filter(s =>
    (s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery))
    );

    return (
        <div className="space-y-8 animate-admin-in">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search subscribers..."
                        className="w-full bg-[#10101e] border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-sm focus:border-[#00c8ff33] outline-none transition-all placeholder:text-[#55556a]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={copyAllEmails}
                        className={clsx(
                            "flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                            copySuccess ? "bg-[#34d399] text-black" : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                        )}
                    >
                        {copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {copySuccess ? "Emails Copied!" : "Copy Active Emails"}
                    </button>
                    <button
                        onClick={fetchSubscribers}
                        className="p-4 bg-white/5 text-[#8888a0] rounded-2xl hover:text-white border border-white/5"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Subscribers Grid */}
            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-12 h-12 border-4 border-[#00c8ff1a] border-t-[#00c8ff] rounded-full animate-spin"></div>
                </div>
            ) : filteredSubscribers.length === 0 ? (
                <div className="py-20 text-center bg-[#10101e] rounded-[3rem] border border-dashed border-white/10">
                    <p className="text-[#55556a] font-black uppercase tracking-widest">No subscribers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubscribers.map((subscriber) => (
                        <div
                            key={subscriber.id}
                            className="bg-[#10101e] border-2 border-white/5 rounded-[2rem] p-6 hover:border-[#00c8ff33] transition-all group relative overflow-hidden"
                        >
                            {/* Status Indicator */}
                            <div className={clsx(
                                "absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10",
                                subscriber.status === 'active' ? "bg-[#34d399]" : "bg-[#ff2d55]"
                            )}></div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#8888a0]">
                                        <Mail size={24} />
                                    </div>
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        subscriber.status === 'active' ? "bg-[#34d3991a] text-[#34d399]" : "bg-[#ff2d551a] text-[#ff2d55]"
                                    )}>
                                        {subscriber.status}
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-white font-bold truncate">{subscriber.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-[#eeeef2] font-bold flex items-center gap-2">
                                            <Phone size={12} className="text-[#00c8ff]" />
                                            {subscriber.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-[#55556a] uppercase tracking-widest mb-1">Joined Date</p>
                                        <p className="text-[#8888a0] text-xs font-bold flex items-center gap-2">
                                            <Calendar size={12} />
                                            {new Date(subscriber.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleToggleStatus(subscriber.id, subscriber.status)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#8888a0] hover:text-white transition-all"
                                    >
                                        {subscriber.status === 'active' ? <UserMinus size={14} /> : <UserCheck size={14} />}
                                        {subscriber.status === 'active' ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subscriber.id)}
                                        className="p-2 bg-white/5 hover:bg-[#ff2d551a] hover:text-[#ff2d55] rounded-xl text-[#55556a] transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
