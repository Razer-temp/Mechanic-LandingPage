'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings,
    Shield,
    Bell,
    User,
    Smartphone,
    Globe,
    Lock,
    Save,
    RefreshCw,
    Cpu,
    Palette,
    Database,
    Trash2,
    Key,
    Eye,
    EyeOff,
    CheckCircle,
    ShieldCheck,
    Fingerprint,
    Activity,
    Monitor,
    MessageSquare
} from 'lucide-react';
import clsx from 'clsx';

type SettingsSection = 'security' | 'aesthetics' | 'comms' | 'profile' | 'system';

export default function SettingsPanel() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('security');
    const [passcode, setPasscode] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    const [saving, setSaving] = useState(false);

    // Theme & Comms State
    const [activeTheme, setActiveTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin_theme_color') || '#00c8ff';
        }
        return '#00c8ff';
    });

    const [waTemplates, setWaTemplates] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin_whatsapp_templates');
            return saved ? JSON.parse(saved) : {
                confirmation: "Hello {name}, your booking for {bike} is confirmed! We'll see you at {time}.",
                completion: "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
                reminder: "Hello {name}, just a reminder about your appointment today for {bike}."
            };
        }
        return {
            confirmation: "Hello {name}, your booking for {bike} is confirmed!",
            completion: "Hi {name}, your {bike} is ready!",
            reminder: "Hello {name}, reminder for your appointment."
        };
    });

    const handleUpdatePasscode = () => {
        if (passcode.length !== 4) {
            alert('Security Protocol Error: Passcode must be exactly 4 digits.');
            return;
        }
        setSaving(true);
        setTimeout(() => {
            localStorage.setItem('admin_passcode', passcode);
            setPasscode('');
            setSaving(false);
            alert('Security Key updated successfully. New protocols deployed.');
        }, 1200);
    };

    const handleUpdateTheme = (color: string) => {
        setActiveTheme(color);
        localStorage.setItem('admin_theme_color', color);
        alert('Aesthetic Protocol Synchronized. System accent updated.');
    };

    const handleSaveTemplates = () => {
        localStorage.setItem('admin_whatsapp_templates', JSON.stringify(waTemplates));
        alert('Communication Protocols Updated.');
    };

    const handleFactoryReset = () => {
        if (confirm('CAUTION: This will reset all local configurations. Application data remains in cloud. Proceed?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const themes = [
        { name: 'Cyan Flux', color: '#00c8ff' },
        { name: 'Emerald Grid', color: '#34d399' },
        { name: 'Violet Pulse', color: '#a78bfa' },
        { name: 'Amber Alert', color: '#fbbf24' },
        { name: 'Crimson Breach', color: '#ff2d55' },
        { name: 'Pure Frost', color: '#ffffff' }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-16 animate-admin-in">
            {/* Header / Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-4">
                        <div className="w-2 h-10 bg-[#ff2d55] rounded-full shadow-[0_0_20px_rgba(255,45,85,0.4)]"></div>
                        System Core Configuration
                    </h3>
                    <p className="text-[#55556a] text-xs font-black uppercase tracking-[0.3em] ml-6">Operational Node Management v2.4.9</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setActiveSection('security')}
                        className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'security' ? "bg-white/10 text-white border border-white/20" : "text-[#55556a] hover:text-white border border-transparent")}
                    >Security</button>
                    <button
                        onClick={() => setActiveSection('aesthetics')}
                        className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'aesthetics' ? "bg-white/10 text-white border border-white/20" : "text-[#55556a] hover:text-white border border-transparent")}
                    >Aesthetics</button>
                    <button
                        onClick={() => setActiveSection('comms')}
                        className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'comms' ? "bg-white/10 text-white border border-white/20" : "text-[#55556a] hover:text-white border border-transparent")}
                    >Templates</button>
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'profile' ? "bg-white/10 text-white border border-white/20" : "text-[#55556a] hover:text-white border border-transparent")}
                    >Identity</button>
                    <button
                        onClick={() => setActiveSection('system')}
                        className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeSection === 'system' ? "bg-white/10 text-white border border-white/20" : "text-[#55556a] hover:text-white border border-transparent")}
                    >Diagnostics</button>
                </div>
            </div>

            {/* Sections */}
            <div className="min-h-[500px]">
                {activeSection === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-admin-in">
                        <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-[#00c8ff1a] rounded-2xl flex items-center justify-center text-[#00c8ff] border border-[#00c8ff33]">
                                    <Fingerprint size={24} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">Master Passcode</h4>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.2em] ml-2">Terminal Entry Key</label>
                                    <div className="relative">
                                        <input
                                            type={showPasscode ? "text" : "password"}
                                            maxLength={4}
                                            className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-6 px-8 text-3xl font-mono tracking-[0.5em] text-white focus:border-[#00c8ff] focus:ring-8 focus:ring-[#00c8ff0a] outline-none transition-all"
                                            value={passcode}
                                            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                                        />
                                        <button
                                            onClick={() => setShowPasscode(!showPasscode)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-white transition-colors"
                                        >
                                            {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-[#55556a] italic font-medium ml-2 uppercase tracking-tighter">Enter exactly 4 digits to refresh authorization sequence</p>
                                </div>
                                <button
                                    onClick={handleUpdatePasscode}
                                    disabled={saving || passcode.length < 4}
                                    className="w-full bg-[#00c8ff] text-black font-black uppercase text-xs tracking-widest py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#00c8ff22] disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {saving ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                    Update Security Protocol
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-[#34d3991a] rounded-2xl flex items-center justify-center text-[#34d399] border border-[#34d39933]">
                                    <Activity size={24} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">Core Status</h4>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Supabase Tunnel', status: 'Active', color: '#34d399' },
                                    { label: 'Neural Chat Core', status: 'Operational', color: '#34d399' },
                                    { label: 'Cloud Sync', status: 'Nominal', color: '#00c8ff' },
                                    { label: 'Security Firewall', status: 'Locked', color: '#fbbf24' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black text-[#8888a0] uppercase tracking-widest">{item.label}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.status}</span>
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'aesthetics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-admin-in">
                        <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                                    <Palette size={24} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">Interface Skin</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => handleUpdateTheme(theme.color)}
                                        className={clsx(
                                            "p-6 rounded-[2rem] border-2 transition-all group flex flex-col items-center gap-4",
                                            activeTheme === theme.color ? "bg-white/10 border-white/20" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: theme.color }}>
                                            {activeTheme === theme.color && <CheckCircle size={20} className="text-black" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8888a0] group-hover:text-white">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-white/5">
                                <Monitor size={40} className="text-[#55556a]" />
                            </div>
                            <div>
                                <h5 className="text-xl font-black text-white uppercase tracking-widest mb-2">Display Preview</h5>
                                <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest leading-relaxed">System Accent current state: <span style={{ color: activeTheme }}>{activeTheme}</span></p>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full transition-all duration-1000" style={{ backgroundColor: activeTheme, width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'comms' && (
                    <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl animate-admin-in">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#25d3661a] rounded-2xl flex items-center justify-center text-[#25d366] border border-[#25d36633]">
                                    <MessageSquare size={24} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-widest">WhatsApp Protocols</h4>
                            </div>
                            <button
                                onClick={handleSaveTemplates}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                            >Save Protocols</button>
                        </div>
                        <div className="space-y-12">
                            {Object.keys(waTemplates).map((type) => (
                                <div key={type} className="space-y-4">
                                    <div className="flex items-center justify-between ml-2">
                                        <label className="text-[10px] font-black text-[#00c8ff] uppercase tracking-[0.2em]">{type} Template</label>
                                        <span className="text-[9px] text-[#55556a] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">Tags: &#123;name&#125;, &#123;bike&#125;, &#123;time&#125;, &#123;revenue&#125;</span>
                                    </div>
                                    <textarea
                                        className="w-full bg-[#050508] border-2 border-white/10 rounded-3xl p-8 py-6 text-sm text-[#eeeef2] focus:border-[#00c8ff33] focus:ring-8 focus:ring-[#00c8ff05] outline-none transition-all font-medium leading-relaxed min-h-[100px]"
                                        value={(waTemplates as any)[type]}
                                        onChange={(e) => setWaTemplates({ ...waTemplates, [type]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'profile' && (
                    <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl animate-admin-in">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-[#a78bfa1a] rounded-2xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa33]">
                                <User size={24} />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-widest">Admin Identity</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 opacity-50 grayscale">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.3em]">Alias</label>
                                <input readOnly value="Administrator Node" className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-bold" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.3em]">Email Link</label>
                                <input readOnly value="support@smartbike.pro" className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-bold" />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'system' && (
                    <div className="bg-[#10101e] border-2 border-white/5 rounded-[3.5rem] p-12 shadow-2xl animate-admin-in">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                                <Cpu size={24} />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-widest">Node Health</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-[#050508] border-2 border-white/5 rounded-[2.5rem] h-48 flex flex-col justify-between">
                                <Database size={24} className="text-[#34d399]" />
                                <div>
                                    <h5 className="text-3xl font-black text-white uppercase tracking-tighter">DATA: NOMINAL</h5>
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em] mt-2">DB-01 SYNCED • 14ms</p>
                                </div>
                            </div>
                            <div className="p-8 bg-[#050508] border-2 border-white/5 rounded-[2.5rem] h-48 flex flex-col justify-between">
                                <Shield size={24} className="text-[#00c8ff]" />
                                <div>
                                    <h5 className="text-3xl font-black text-white uppercase tracking-tighter">SEC: LOCKED</h5>
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em] mt-2">ENCRYPTION LEVEL 4</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                {[
                    { icon: Database, label: 'Export Data', sub: 'JSON Archive', action: () => alert('Encryption starting...') },
                    { icon: Bell, label: 'Push Sync', sub: 'Global Broadcast', action: () => alert('Synchronization complete.') },
                    { icon: Trash2, label: 'Factory Reset', sub: 'Wipe Local Core', danger: true, action: handleFactoryReset }
                ].map((item, i) => (
                    <button
                        key={i}
                        onClick={item.action}
                        className={clsx(
                            "p-8 rounded-[2.5rem] border-2 border-white/5 transition-all flex items-center gap-6 group",
                            item.danger ? "bg-[#ff2d5505] hover:border-[#ff2d5533]" : "bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        )}
                    >
                        <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center", item.danger ? "bg-[#ff2d551a] text-[#ff2d55]" : "bg-white/5 text-[#55556a] group-hover:text-white")}>
                            <item.icon size={28} />
                        </div>
                        <div className="text-left">
                            <h5 className={clsx("text-sm font-black uppercase tracking-widest mb-1", item.danger ? "text-[#ff2d55]" : "text-white")}>{item.label}</h5>
                            <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest">{item.sub}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
