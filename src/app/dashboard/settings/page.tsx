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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="section-title" style={{ fontSize: '2.4rem', textAlign: 'left', marginBottom: '4px' }}>Account <span className="gradient-text">Settings</span></h1>
                <p className="text-text-secondary text-sm font-medium">Manage your personal information and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                                activeTab === tab.id
                                    ? "bg-accent/10 text-accent border border-accent/20"
                                    : "text-text-muted hover:bg-white/[0.04] hover:text-text-primary border border-transparent"
                            )}
                        >
                            <tab.icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-accent" : "text-text-muted group-hover:text-text-primary")} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="glass-card animate-in fade-in slide-in-from-right-4 duration-500" style={{ padding: '32px' }}>
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/[0.05]">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-3xl bg-grad-blue flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-accent/30 group-hover:scale-105 transition-transform cursor-pointer">
                                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-bg-surface border border-white/[0.1] flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all shadow-xl">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-text-primary font-black text-xl mb-1">{profile?.full_name || 'My Account'}</h2>
                                    <p className="text-text-muted text-sm font-medium">{user?.email}</p>
                                </div>
                            </div>

                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={profile?.full_name || ''}
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 99999 99999"
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself or your bike..."
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-text-primary outline-none focus:border-accent/40 focus:bg-white/[0.05] min-h-[100px] resize-none transition-all font-medium"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary btn-glow" style={{ padding: '12px 24px' }}>
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="glass-card animate-in fade-in slide-in-from-right-4 duration-500" style={{ padding: '32px' }}>
                            <h3 className="text-text-primary font-black text-xl mb-6">Notification Preferences</h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Email Notifications', desc: 'Receive updates about your bookings via email.', icon: Mail },
                                    { title: 'SMS Alerts', desc: 'Get real-time service updates on your phone.', icon: Smartphone },
                                    { title: 'Marketing Communications', desc: 'Stay updated on our latest offers and services.', icon: Bell },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-text-primary font-bold text-sm mb-0.5">{item.title}</h4>
                                                <p className="text-text-muted text-xs font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-white/[0.05] border border-white/[0.1] relative cursor-pointer p-1">
                                            <div className="w-4 h-4 rounded-full bg-white/20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card animate-in fade-in slide-in-from-right-4 duration-500" style={{ padding: '32px' }}>
                            <h3 className="text-text-primary font-black text-xl mb-6">Security Settings</h3>
                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-accent-red/5 border border-accent-red/10">
                                    <h4 className="text-accent-red font-bold text-sm mb-2 uppercase tracking-wider">Change Password</h4>
                                    <p className="text-text-secondary text-xs font-medium mb-4">Ensure your account is protected with a strong password.</p>
                                    <button className="px-4 py-2 rounded-xl bg-accent-red/20 text-accent-red text-xs font-black hover:bg-accent-red/30 transition-all">
                                        Update Password
                                    </button>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                    <h4 className="text-text-primary font-bold text-sm mb-2 uppercase tracking-wider">Two-Factor Authentication</h4>
                                    <p className="text-text-muted text-xs font-medium mb-4">Add an extra layer of security to your workshop account.</p>
                                    <button className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-text-primary text-xs font-black hover:bg-white/[0.1] transition-all">
                                        Enable 2FA
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
