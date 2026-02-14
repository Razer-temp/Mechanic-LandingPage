'use client';

import React, { useState } from 'react';
import {
    MessageSquare,
    Zap,
    IndianRupee,
    Clock,
    Search,
    ChevronDown,
    BrainCircuit,
    AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface IntelligenceLogsProps {
    chats: any[];
    diagnoses: any[];
    estimates: any[];
}

export default function IntelligenceLogs({ chats, diagnoses, estimates }: IntelligenceLogsProps) {
    const [activeSubTab, setActiveSubTab] = useState<'chats' | 'diagnoses' | 'estimates'>('chats');

    return (
        <div className="space-y-6 animate-admin-in">
            {/* Header / Sub-tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10101e] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-4 ml-2">
                    <div className="w-12 h-12 bg-[#a78bfa]/10 rounded-2xl flex items-center justify-center text-[#a78bfa]">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">AI Intelligence</h2>
                        <p className="text-[#55556a] text-[10px] font-bold uppercase tracking-widest">Neural Network Insights</p>
                    </div>
                </div>

                <div className="flex bg-[#050508] p-1.5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveSubTab('chats')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                            activeSubTab === 'chats' ? "bg-[#a78bfa] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                        )}
                    >
                        Neural Logs
                    </button>
                    <button
                        onClick={() => setActiveSubTab('diagnoses')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                            activeSubTab === 'diagnoses' ? "bg-[#00c8ff] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                        )}
                    >
                        Diagnoses
                    </button>
                    <button
                        onClick={() => setActiveSubTab('estimates')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                            activeSubTab === 'estimates' ? "bg-[#34d399] text-black shadow-lg" : "text-[#55556a] hover:text-white"
                        )}
                    >
                        Estimates
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-4">
                {activeSubTab === 'chats' && (
                    <div className="space-y-4">
                        {chats.length === 0 ? (
                            <div className="bg-[#10101e] p-12 rounded-[2rem] border-2 border-dashed border-white/5 text-center">
                                <MessageSquare size={48} className="mx-auto text-[#55556a] mb-4 opacity-20" />
                                <p className="text-[#55556a] font-bold uppercase text-xs tracking-widest">No chat sessions found</p>
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div key={chat.id} className="bg-[#10101e] border border-white/5 rounded-[2rem] p-6 hover:border-[#a78bfa]/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/10 flex items-center justify-center text-[#a78bfa]">
                                                <MessageSquare size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">{chat.customer_name || 'Anonymous Rider'}</h4>
                                                <p className="text-[10px] text-[#55556a] font-bold uppercase tracking-widest">
                                                    {format(new Date(chat.created_at), 'PPP • p')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-[#8888a0] uppercase tracking-widest">
                                            {chat.chat_messages?.length || 0} Messages
                                        </div>
                                    </div>

                                    <div className="space-y-3 pl-13">
                                        {chat.chat_messages?.slice(0, 2).map((msg: any) => (
                                            <div key={msg.id} className={clsx(
                                                "p-3 rounded-2xl text-[13px] leading-relaxed",
                                                msg.role === 'user' ? "bg-white/5 text-[#eeeef2] rounded-tl-none" : "bg-[#a78bfa]/5 text-[#a78bfa] rounded-tr-none border border-[#a78bfa]/10"
                                            )}>
                                                <span className="font-black uppercase text-[9px] block mb-1 opacity-50">{msg.role}</span>
                                                {msg.content}
                                            </div>
                                        ))}
                                        {chat.chat_messages?.length > 2 && (
                                            <button className="text-[10px] font-black text-[#a78bfa] uppercase tracking-widest mt-2 hover:opacity-70">
                                                + {chat.chat_messages.length - 2} more messages...
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeSubTab === 'diagnoses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {diagnoses.length === 0 ? (
                            <div className="col-span-full bg-[#10101e] p-12 rounded-[2rem] border-2 border-dashed border-white/5 text-center">
                                <Zap size={48} className="mx-auto text-[#55556a] mb-4 opacity-20" />
                                <p className="text-[#55556a] font-bold uppercase text-xs tracking-widest">No diagnoses recorded yet</p>
                            </div>
                        ) : (
                            diagnoses.map((d) => (
                                <div key={d.id} className="bg-[#10101e] border border-white/5 rounded-[2.5rem] p-7 group hover:border-[#00c8ff]/30 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-[#00c8ff]/10 rounded-2xl flex items-center justify-center text-[#00c8ff]">
                                            <Zap size={20} />
                                        </div>
                                        <div className={clsx(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            d.result_urgency === 'high' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                d.result_urgency === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        )}>
                                            {d.result_urgency} Urgency
                                        </div>
                                    </div>

                                    <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] mb-2">User Query</p>
                                    <h4 className="text-white font-bold text-lg mb-6 group-hover:text-[#00c8ff] transition-colors">&quot;{d.input_text}&quot;</h4>

                                    <div className="bg-[#050508] rounded-3xl p-5 border border-white/5">
                                        <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] mb-3">AI Analysis</p>
                                        <h5 className="text-white font-black uppercase tracking-tight mb-2 text-sm">{d.result_title}</h5>
                                        <div className="flex items-center gap-2 text-[#00c8ff] font-bold text-xs">
                                            <IndianRupee size={12} />
                                            <span>Est. Cost: {d.result_cost}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-[#55556a] uppercase tracking-widest">
                                        <span>{format(new Date(d.created_at), 'PPP')}</span>
                                        <span className="opacity-50">ID: {d.id.slice(0, 8)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeSubTab === 'estimates' && (
                    <div className="space-y-4">
                        {estimates.length === 0 ? (
                            <div className="bg-[#10101e] p-12 rounded-[2rem] border-2 border-dashed border-white/5 text-center">
                                <IndianRupee size={48} className="mx-auto text-[#55556a] mb-4 opacity-20" />
                                <p className="text-[#55556a] font-bold uppercase text-xs tracking-widest">No cost estimates recorded</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {estimates.map((e) => (
                                    <div key={e.id} className="bg-[#10101e] border border-white/5 rounded-3xl p-6 hover:border-[#34d399]/30 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 bg-[#34d399]/10 rounded-xl flex items-center justify-center text-[#34d399]">
                                                <IndianRupee size={18} />
                                            </div>
                                            <span className="text-[9px] font-black text-[#55556a] uppercase tracking-widest">
                                                {format(new Date(e.created_at), 'MMM d')}
                                            </span>
                                        </div>

                                        <h4 className="text-white font-bold capitalize mb-1">{e.bike_type}</h4>
                                        <p className="text-[#34d399] font-black text-[10px] uppercase tracking-widest mb-4">{e.service_type} Service</p>

                                        <div className="flex items-end gap-1 mb-2">
                                            <span className="text-2xl font-black text-white tracking-tighter">₹{e.min_cost}</span>
                                            <span className="text-[#55556a] text-sm mb-1">–</span>
                                            <span className="text-xl font-bold text-white/50 tracking-tighter">₹{e.max_cost}</span>
                                        </div>
                                        <p className="text-[9px] text-[#55556a] font-bold uppercase tracking-widest">Estimated Price Range</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
