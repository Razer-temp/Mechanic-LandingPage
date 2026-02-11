'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Shield, Mail, Smartphone, Camera, ChevronRight, Save } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div>
                <div className="section-tag mb-4">
                    <Shield className="w-3 h-3" /> System Preferences
                </div>
                <h1 className="section-title !m-0" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'left' }}>
                    Account <span className="gradient-text">Settings</span>
                </h1>
                <p className="text-text-secondary font-medium mt-3 tracking-wide">Manage your personal information and workshop preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Tabs */}
                <div className="lg:w-72 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black transition-all group relative overflow-hidden uppercase tracking-[0.15em] border",
                                activeTab === tab.id
                                    ? "bg-accent/10 text-accent border-accent/20 shadow-[0_0_20px_rgba(0,200,255,0.05)]"
                                    : "text-text-muted hover:bg-white/[0.03] hover:text-text-primary border-transparent"
                            )}
                        >
                            {activeTab === tab.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-full shadow-[0_0_10px_rgba(0,200,255,0.6)]" />
                            )}
                            <tab.icon className={clsx("w-5 h-5 transition-all duration-500", activeTab === tab.id ? "text-accent" : "text-text-muted group-hover:text-accent group-hover:rotate-6")} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === 'profile' && (
                        <div className="glass-card p-10 animate-in fade-in slide-in-from-right-4 duration-700 relative overflow-hidden">
                            {/* Decorative Shimmer */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full -z-10" />

                            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-white/[0.05]">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[2.5rem] bg-grad-blue flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-accent/20 group-hover:rotate-6 transition-all duration-500 relative">
                                        <div className="absolute inset-0 bg-white/20 blur-md rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10">{profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-bg-elevated border border-white/[0.1] flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-2xl group/cam">
                                        <Camera className="w-5 h-5 group-hover/cam:scale-110 transition-transform" />
                                    </button>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-text-primary font-black text-2xl mb-2 tracking-tight">
                                        {profile?.full_name || 'Rider Profile'}
                                        <span className="ml-3 px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-[9px] uppercase tracking-widest text-accent align-middle">Verified</span>
                                    </h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <p className="text-text-secondary font-bold text-sm flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-accent/50" />
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-8">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Full Identity</label>
                                        <input
                                            type="text"
                                            defaultValue={profile?.full_name || ''}
                                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-4 px-5 text-text-primary outline-none focus:border-accent/30 focus:bg-white/[0.04] transition-all font-bold text-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 00000 00000"
                                            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-4 px-5 text-text-primary outline-none focus:border-accent/30 focus:bg-white/[0.04] transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Rider Bio</label>
                                    <textarea
                                        placeholder="Briefly describe your passion for riding or specific needs for your bike..."
                                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-2xl py-4 px-5 text-text-primary outline-none focus:border-accent/30 focus:bg-white/[0.04] min-h-[120px] resize-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary btn-glow !py-4 !px-10 font-black uppercase tracking-widest text-xs">
                                    <Save className="w-4 h-4" /> Save Profile
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="glass-card p-10 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="mb-10">
                                <h3 className="text-text-primary font-black text-2xl tracking-tight mb-2">Notification Hub</h3>
                                <p className="text-text-secondary text-sm font-medium">Configure how you receive workshop updates.</p>
                            </div>
                            <div className="space-y-5">
                                {[
                                    { title: 'Email Updates', desc: 'Secure breakdown notifications and booking receipts.', icon: Mail },
                                    { title: 'Direct SMS', desc: 'Real-time alerts when your bike is ready for pickup.', icon: Smartphone },
                                    { title: 'Promo Alerts', desc: 'Early access to seasonal service discounts.', icon: Bell },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-accent/10">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-text-primary font-black text-base mb-0.5">{item.title}</h4>
                                                <p className="text-text-muted text-xs font-bold leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-7 rounded-full bg-white/[0.05] border border-white/[0.1] relative cursor-pointer p-1.5 transition-colors hover:border-accent/40">
                                            <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_10px_rgba(0,200,255,0.4)] absolute right-1.5 top-1.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card p-10 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="mb-10">
                                <h3 className="text-text-primary font-black text-2xl tracking-tight mb-2">Security & Access</h3>
                                <p className="text-text-secondary text-sm font-medium">Protect your workshop identity and data.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="p-8 rounded-[2.5rem] bg-accent-red/5 border border-accent-red/10 relative overflow-hidden group">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-red/10 blur-[80px] rounded-full pointer-events-none" />
                                    <h4 className="text-accent-red font-black text-xs uppercase tracking-[0.2em] mb-3">Access Control</h4>
                                    <p className="text-text-primary font-bold text-lg mb-2">Change Account Password</p>
                                    <p className="text-text-muted text-sm font-medium mb-8 max-w-md">Update your password regularly to keep your service history and bike details private.</p>
                                    <button className="px-8 py-3.5 rounded-2xl bg-accent-red/10 text-accent-red text-xs font-black uppercase tracking-widest hover:bg-accent-red/20 transition-all border border-accent-red/20 shadow-lg shadow-accent-red/5">
                                        Secure Update
                                    </button>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] group">
                                    <h4 className="text-text-muted font-black text-[10px] uppercase tracking-[0.2em] mb-3">Strong Auth</h4>
                                    <p className="text-text-primary font-bold text-lg mb-2">Two-Factor Authentication</p>
                                    <p className="text-text-secondary text-sm font-medium mb-8 max-w-md">Add a secondary verification step using your mobile device or email.</p>
                                    <button className="px-8 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-text-primary text-xs font-black uppercase tracking-widest hover:bg-white/[0.1] transition-all">
                                        Configure 2FA
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
