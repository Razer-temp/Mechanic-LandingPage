import React, { useState } from 'react';
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
    Cpu
} from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPanel() {
    const [activeSubTab, setActiveSubTab] = useState('profile');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('Security configurations synchronized successfully.');
        }, 1500);
    };

    const navItems = [
        { id: 'profile', label: 'Admin Profile', icon: User },
        { id: 'security', label: 'Security & Access', icon: Lock },
        { id: 'notifications', label: 'Global Notifications', icon: Bell },
        { id: 'system', label: 'System Health', icon: Cpu },
    ];

    return (
        <div className="bg-[#10101e] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-admin-in flex flex-col xl:flex-row min-h-[700px]">
            {/* Settings Navigation */}
            <aside className="w-full xl:w-80 bg-white/[0.02] border-b xl:border-b-0 xl:border-r border-white/5 p-8 xl:p-10 flex flex-col gap-8">
                <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Configuration</h3>
                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-[0.2em] mt-2">Adjust system parameters</p>
                </div>

                <nav className="flex-1 space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSubTab(item.id)}
                            className={clsx(
                                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group",
                                activeSubTab === item.id ? "bg-[#00c8ff1a] text-[#00c8ff] shadow-sm border border-[#00c8ff22]" : "text-[#55556a] hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} className={activeSubTab === item.id ? "text-[#00c8ff]" : ""} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Settings Content */}
            <main className="flex-1 p-8 xl:p-16 space-y-12">
                {activeSubTab === 'profile' && (
                    <div className="space-y-10 animate-admin-in">
                        <div className="pb-8 border-b border-white/5">
                            <h4 className="text-2xl font-black text-white tracking-tight mb-2">Primary Administrator</h4>
                            <p className="text-[#8888a0] text-sm font-medium">Manage your identity and public profile within the terminal.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">Terminal Alias</label>
                                <input
                                    type="text"
                                    defaultValue="Senior Administrator"
                                    className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:border-[#00c8ff] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.2em] ml-1">Contact Beacon</label>
                                <input
                                    type="email"
                                    defaultValue="admin@smartbike.pro"
                                    className="w-full bg-[#050508] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:border-[#00c8ff] outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'security' && (
                    <div className="space-y-10 animate-admin-in">
                        <div className="pb-8 border-b border-white/5">
                            <h4 className="text-2xl font-black text-white tracking-tight mb-2">Access Protocols</h4>
                            <p className="text-[#8888a0] text-sm font-medium">Configure security keys and 2FA authentication methods.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#00c8ff33] transition-all cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#00c8ff1a] rounded-2xl flex items-center justify-center text-[#00c8ff]">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">Encrypted Passcode</p>
                                        <p className="text-[10px] text-[#55556a] font-bold uppercase tracking-wider mt-1">Currently set to: 8 8 8 8</p>
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-[#8888a0] rounded-xl transition-all">Update Key</button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl opacity-50">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#a78bfa1a] rounded-2xl flex items-center justify-center text-[#a78bfa]">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">Biometric Uplink</p>
                                        <p className="text-[10px] text-[#55556a] font-bold uppercase tracking-wider mt-1">Requires Enterprise Module</p>
                                    </div>
                                </div>
                                <Lock size={18} className="text-[#55556a]" />
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'system' && (
                    <div className="space-y-10 animate-admin-in">
                        <div className="pb-8 border-b border-white/5">
                            <h4 className="text-2xl font-black text-white tracking-tight mb-2">Terminal Integrity</h4>
                            <p className="text-[#8888a0] text-sm font-medium">Real-time diagnostics of the SmartBike Pro Command Center.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-[#050508] border border-white/5 rounded-3xl flex flex-col justify-between h-48">
                                <p className="text-[10px] text-[#8888a0] font-black uppercase tracking-widest">Database Sync</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-[#34d399] rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-2xl font-black text-white tracking-tighter">Connected</span>
                                </div>
                                <p className="text-[10px] text-[#55556a] font-bold">Latency: 24ms</p>
                            </div>

                            <div className="p-8 bg-[#050508] border border-white/5 rounded-3xl flex flex-col justify-between h-48 text-[#a78bfa]">
                                <p className="text-[10px] text-[#a78bfa] font-black uppercase tracking-widest">AI Core</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-[#a78bfa] rounded-full animate-pulse shadow-[0_0_15px_rgba(167,139,250,0.5)]"></div>
                                    <span className="text-2xl font-black text-white tracking-tighter">Online</span>
                                </div>
                                <p className="text-[10px] text-[#55556a] font-bold">Neural Engine: Active</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-8 py-4 bg-[#00c8ff] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,200,255,0.2)] disabled:opacity-50"
                        >
                            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            Deploy Changes
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                            Discard
                        </button>
                    </div>
                    <p className="text-[10px] text-[#55556a] font-black uppercase tracking-widest hidden md:block">
                        Build Ver: 1.0.4 rDX
                    </p>
                </div>
            </main>
        </div>
    );
}
