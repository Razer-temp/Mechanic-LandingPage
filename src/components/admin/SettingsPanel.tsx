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
    EyeOff
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPanel() {
    const [activeSubTab, setActiveSubTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [showPasscode, setShowPasscode] = useState(false);
    const [newPasscode, setNewPasscode] = useState('');
    const [currentPasscode, setCurrentPasscode] = useState('8888');

    useEffect(() => {
        const savedPasscode = localStorage.getItem('admin_passcode');
        if (savedPasscode) {
            setCurrentPasscode(savedPasscode);
        }
    }, []);

    const handleUpdatePasscode = () => {
        if (newPasscode.length !== 4 || isNaN(Number(newPasscode))) {
            alert('Security Protocol Error: Passcode must be exactly 4 digits.');
            return;
        }
        setSaving(true);
        setTimeout(() => {
            localStorage.setItem('admin_passcode', newPasscode);
            setCurrentPasscode(newPasscode);
            setNewPasscode('');
            setSaving(false);
            alert('Security Key updated successfully. New protocols deployed.');
        }, 1200);
    };

    const handleFactoryReset = () => {
        if (confirm('CAUTION: This will reset all local configurations. Application data remains in cloud. Proceed?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const navItems = [
        { id: 'profile', label: 'Admin Identity', icon: User },
        { id: 'security', label: 'Access Control', icon: Lock },
        { id: 'themes', label: 'Terminal Aesthetics', icon: Palette },
        { id: 'notifications', label: 'Alert Protocols', icon: Bell },
        { id: 'system', label: 'Core Diagnostics', icon: Cpu },
    ];

    return (
        <div className="bg-[#10101e] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-admin-in flex flex-col xl:flex-row min-h-[750px]">
            {/* Settings Navigation */}
            <aside className="w-full xl:w-80 bg-white/[0.02] border-b xl:border-b-0 xl:border-r border-white/5 p-8 xl:p-10 flex flex-col gap-6 xl:gap-10">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Configuration</h3>
                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.3em] mt-2">Adjust system nodes</p>
                </div>

                <nav className="flex-1 space-y-3 xl:space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSubTab(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group border",
                                activeSubTab === item.id ? "bg-[#00c8ff1a] text-[#00c8ff] border-[#00c8ff22] shadow-lg shadow-[#00c8ff0a]" : "text-[#55556a] border-transparent hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} className={activeSubTab === item.id ? "text-[#00c8ff]" : ""} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-white/5">
                    <button
                        onClick={handleFactoryReset}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[#ff2d55] hover:bg-[#ff2d550a] transition-all group"
                    >
                        <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-sm">Factory Reset</span>
                    </button>
                </div>
            </aside>

            {/* Settings Content */}
            <main className="flex-1 p-8 xl:p-16 space-y-12 overflow-y-auto">
                {activeSubTab === 'profile' && (
                    <div className="space-y-12 animate-admin-in">
                        <div className="pb-8 border-b border-white/5 flex justify-between items-end">
                            <div>
                                <h4 className="text-3xl font-black text-white tracking-tight mb-2">Terminal Identity</h4>
                                <p className="text-[#8888a0] text-sm font-medium">Configure administrator credentials and presence.</p>
                            </div>
                            <div className="w-16 h-16 bg-[#a78bfa1a] rounded-2xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa33]">
                                <User size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.3em] ml-1">Administrator Alias</label>
                                <input
                                    type="text"
                                    defaultValue="Primary Admin"
                                    className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-base focus:border-[#00c8ff] outline-none transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.3em] ml-1">Communication Link</label>
                                <input
                                    type="email"
                                    defaultValue="support@smartbike.pro"
                                    className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-base focus:border-[#00c8ff] outline-none transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#00c8ff1a] rounded-xl flex items-center justify-center text-[#00c8ff]">
                                <Globe size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white uppercase tracking-tight">Geo-Location: New Delhi Hub</p>
                                <p className="text-xs text-[#55556a] font-medium mt-1">SmartBike Regional Service Center 01</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'security' && (
                    <div className="space-y-12 animate-admin-in">
                        <div className="pb-8 border-b border-white/5">
                            <h4 className="text-3xl font-black text-white tracking-tight mb-2">Security Override</h4>
                            <p className="text-[#8888a0] text-sm font-medium">Manage terminal access codes and authentication protocols.</p>
                        </div>

                        <div className="grid gap-8">
                            <div className="bg-[#050508] p-10 rounded-[2.5rem] border-2 border-white/5 space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4 text-[#fbbf24]">
                                    <Key size={24} />
                                    <h5 className="text-lg font-black uppercase tracking-widest">Master Passcode</h5>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">Active Security Key</label>
                                        <div className="relative">
                                            <input
                                                type={showPasscode ? "text" : "password"}
                                                readOnly
                                                value={currentPasscode}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-xl tracking-[0.4em] outline-none"
                                            />
                                            <button
                                                onClick={() => setShowPasscode(!showPasscode)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-white"
                                            >
                                                {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">New 4-Digit Passcode</label>
                                        <input
                                            type="text"
                                            maxLength={4}
                                            value={newPasscode}
                                            onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Ex: 1234"
                                            className="w-full bg-[#0c0c16] border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-xl tracking-[0.4em] focus:border-[#fbbf24] outline-none transition-all placeholder:text-[#1a1a2e]"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpdatePasscode}
                                    disabled={saving || newPasscode.length < 4}
                                    className="w-full md:w-fit px-10 py-5 bg-[#fbbf24] text-black font-black text-xs uppercase tracking-widest rounded-2zl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#fbbf2422] disabled:opacity-50"
                                >
                                    {saving ? <RefreshCw size={20} className="animate-spin" /> : "Deploy Security Key"}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] opacity-40 grayscale">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#00c8ff1a] rounded-2xl flex items-center justify-center text-[#00c8ff]">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-widest">Two-Factor Auth</p>
                                        <p className="text-[10px] text-[#55556a] font-bold mt-1">LOCKED: Requires Pro Subscription</p>
                                    </div>
                                </div>
                                <Lock size={20} className="text-[#55556a]" />
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'themes' && (
                    <div className="space-y-12 animate-admin-in">
                        <div className="pb-8 border-b border-white/5">
                            <h4 className="text-3xl font-black text-white tracking-tight mb-2">Visual Core</h4>
                            <p className="text-[#8888a0] text-sm font-medium">Customize the terminal aesthetics and atmospheric layers.</p>
                        </div>

                        <div className="grid gap-10">
                            <div className="space-y-6">
                                <h5 className="text-xs font-black text-[#55556a] uppercase tracking-[0.3em] ml-1">Primary Accents</h5>
                                <div className="flex gap-4">
                                    {['#00c8ff', '#a78bfa', '#34d399', '#ff2d55', '#fbbf24'].map((color) => (
                                        <button
                                            key={color}
                                            className="w-12 h-12 rounded-2xl border-2 border-white/5 transition-transform hover:scale-110 shadow-lg"
                                            style={{ backgroundColor: color }}
                                        ></button>
                                    ))}
                                    <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-[#55556a]">
                                        <Palette size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-[#050508] border-2 border-white/5 rounded-[2.5rem] space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-black text-white">Advanced Glassmorphism</p>
                                        <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest mt-1">Level 4 Cinematic Transparency</p>
                                    </div>
                                    <div className="w-14 h-7 bg-[#00c8ff] rounded-full relative p-1 cursor-pointer">
                                        <div className="w-5 h-5 bg-white rounded-full absolute right-1"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between opacity-50">
                                    <div>
                                        <p className="text-sm font-black text-white">Dynamic Background Gradients</p>
                                        <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest mt-1">CPU Intensive Effects</p>
                                    </div>
                                    <div className="w-14 h-7 bg-white/10 rounded-full relative p-1 cursor-not-allowed">
                                        <div className="w-5 h-5 bg-[#55556a] rounded-full absolute left-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'system' && (
                    <div className="space-y-12 animate-admin-in">
                        <div className="pb-8 border-b border-white/5 flex justify-between items-end">
                            <div>
                                <h4 className="text-3xl font-black text-white tracking-tight mb-2">Core Health</h4>
                                <p className="text-[#8888a0] text-sm font-medium">Real-time status of the SmartBike Command Center infrastructure.</p>
                            </div>
                            <div className="p-4 bg-[#34d3991a] text-[#34d399] border border-[#34d39933] rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                System: Nominal
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 xl:p-10 bg-[#050508] border-2 border-white/5 rounded-[2.5rem] flex flex-col justify-between h-56 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#34d39908] blur-3xl"></div>
                                <div className="flex justify-between items-start">
                                    <Database size={24} className="text-[#34d399] transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.2em]">DB Cluster</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 bg-[#34d399] rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                                        <span className="text-3xl font-black text-white tracking-widest">SYNCED</span>
                                    </div>
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em]">Response: 18ms • AWS Region 01</p>
                                </div>
                            </div>

                            <div className="p-8 xl:p-10 bg-[#050508] border-2 border-white/5 rounded-[2.5rem] flex flex-col justify-between h-56 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#a78bfa08] blur-3xl"></div>
                                <div className="flex justify-between items-start">
                                    <Cpu size={24} className="text-[#a78bfa] transition-transform group-hover:scale-110" />
                                    <span className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.2em]">Neural Engine</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 bg-[#a78bfa] rounded-full animate-pulse shadow-[0_0_15px_rgba(167,139,250,0.5)]"></div>
                                        <span className="text-3xl font-black text-white tracking-widest">ACTIVE</span>
                                    </div>
                                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em]">Load: 4.2% • GPT-4o Gateway</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Smartphone size={20} className="text-[#55556a]" />
                                <p className="text-xs font-bold text-[#8888a0]">Admin Interface: Web Mobile Responsive</p>
                            </div>
                            <div className="text-[9px] text-[#55556a] font-black uppercase tracking-[0.3em]">Runtime Version 1.2.0-Stable</div>
                        </div>
                    </div>
                )}

                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setSaving(true);
                                setTimeout(() => {
                                    setSaving(false);
                                    alert('Global terminal parameters synchronized.');
                                }, 1000);
                            }}
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-5 bg-[#00c8ff] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00c8ff22] disabled:opacity-50"
                        >
                            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            Apply Configuration
                        </button>
                        <button className="px-10 py-5 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                            Abort Tasks
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.3em] mb-1">Last Update Check</p>
                        <p className="text-[10px] text-white font-black uppercase tracking-widest">13 FEB 2026 • 11:45:00 UTC</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
