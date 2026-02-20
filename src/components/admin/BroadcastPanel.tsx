'use client';

import React, { useState, useEffect } from 'react';
import {
    Send,
    MessageSquare,
    Users,
    Copy,
    CheckCircle2,
    ExternalLink,
    ChevronDown,
    LayoutTemplate,
    Search,
    MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';
import type { Subscriber, MarketingTemplate } from '@/types/database';

export default function BroadcastPanel() {
    const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tRes, sRes] = await Promise.all([
                    supabase.from('marketing_templates').select('*'),
                    supabase.from('subscribers').select('*').eq('status', 'active')
                ]);

                if (tRes.data) setTemplates(tRes.data);
                if (sRes.data) setSubscribers(sRes.data);
            } catch (err) {
                console.error('Error fetching broadcast data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [supabase]);

    const handleSelectTemplate = (template: MarketingTemplate) => {
        setSelectedTemplate(template);
        setMessageContent(template.content);
    };

    const handleWhatsAppShare = (phone: string) => {
        if (!phone) return;
        let p = phone.replace(/\D/g, '');
        if (p.length === 10) p = '91' + p;
        const msg = encodeURIComponent(messageContent);
        window.open(`https://wa.me/${p}?text=${msg}`, '_blank');
    };

    const handleCopyMessage = () => {
        navigator.clipboard.writeText(messageContent);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const filteredSubscribers = subscribers.filter(s =>
    (s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery))
    );

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-admin-in">
            {/* Left: Templates & Message Editor */}
            <div className="xl:col-span-2 space-y-8">
                <div className="bg-[#10101e] border-2 border-white/5 rounded-[3rem] p-10 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-[#a78bfa1a] rounded-xl flex items-center justify-center text-[#a78bfa]">
                            <LayoutTemplate size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Compose Broadcast</h3>
                    </div>

                    {/* Template Picker */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] ml-1">Select Template</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => handleSelectTemplate(t)}
                                    className={clsx(
                                        "p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                                        selectedTemplate?.id === t.id
                                            ? "bg-[#a78bfa12] border-[#a78bfa33]"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="relative z-10">
                                        <p className={clsx(
                                            "font-black uppercase tracking-widest text-[10px] mb-1",
                                            selectedTemplate?.id === t.id ? "text-[#a78bfa]" : "text-[#55556a]"
                                        )}>{t.category || 'MARKETING'}</p>
                                        <p className="text-white font-bold">{t.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Editor */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em]">Message Content</p>
                            <button
                                onClick={handleCopyMessage}
                                className="flex items-center gap-2 text-[10px] font-black text-[#00c8ff] uppercase tracking-widest hover:opacity-80 transition-all"
                            >
                                {copySuccess ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                {copySuccess ? "Copied" : "Copy Content"}
                            </button>
                        </div>
                        <textarea
                            className="w-full h-64 bg-[#050508] border-2 border-white/5 rounded-[2rem] p-8 text-white font-medium focus:border-[#a78bfa33] outline-none transition-all resize-none shadow-inner"
                            placeholder="Select a template or type your custom message here..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <p className="text-[10px] text-[#55556a] font-bold italic ml-2">Tip: Use WhatsApp emojis to make your broadcast more engaging. 🚀✨</p>
                    </div>
                </div>
            </div>

            {/* Right: Target Recipients */}
            <div className="space-y-8">
                <div className="bg-[#10101e] border-2 border-white/5 rounded-[3rem] p-8 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-[#34d3991a] rounded-xl flex items-center justify-center text-[#34d399]">
                            <Users size={20} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">Recipients</h3>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#34d399] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter subscribers..."
                            className="w-full bg-[#050508] border-2 border-white/5 rounded-2xl py-3 pl-10 pr-6 text-white font-bold text-xs focus:border-[#34d39933] outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar-minimal pr-2 space-y-4 max-h-[600px]">
                        {loading ? (
                            <div className="py-20 flex justify-center">
                                <div className="w-8 h-8 border-2 border-[#34d3991a] border-t-[#34d399] rounded-full animate-spin"></div>
                            </div>
                        ) : filteredSubscribers.length === 0 ? (
                            <div className="text-center py-20 opacity-30 text-[#55556a] text-[10px] font-black uppercase tracking-widest">
                                No active targets
                            </div>
                        ) : (
                            filteredSubscribers.map(s => (
                                <div
                                    key={s.id}
                                    className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                                >
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="min-w-0">
                                            <p className="text-white font-bold text-xs truncate mb-1">{s.email || 'Subscriber'}</p>
                                            <p className="text-[10px] text-[#55556a] font-black tracking-widest flex items-center gap-2">
                                                <MessageCircle size={10} className="text-[#34d399]" />
                                                {s.phone}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleWhatsAppShare(s.phone || '')}
                                            disabled={!messageContent}
                                            className="p-3 bg-[#25d366]/10 text-[#25d366] rounded-xl hover:bg-[#25d366] hover:text-white transition-all disabled:opacity-30 disabled:grayscale"
                                            title="Share to WhatsApp"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[9px] text-[#55556a] font-black uppercase tracking-[0.2em] leading-relaxed">
                            Total Reach: <span className="text-[#34d399]">{subscribers.length} Active Targets</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
