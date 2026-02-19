'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    MessageSquare,
    Building2,
    MapPin,
    Clock,
    Phone,
    Mail,
    Download,
    Upload,
    Wrench,
    Plus,
    X,
    AlertTriangle,
    FileText,
    IndianRupee
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

type SettingsSection = 'business' | 'security' | 'aesthetics' | 'comms' | 'mechanics' | 'data';

export default function SettingsPanel() {
    const supabase = createClient();
    const [activeSection, setActiveSection] = useState<SettingsSection>('business');
    const [passcode, setPasscode] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState('');

    // Theme State
    const [activeTheme, setActiveTheme] = useState('#00c8ff');

    // Business Info State
    const [businessInfo, setBusinessInfo] = useState({
        shop_name: 'SmartBike Pro Service Center',
        owner_name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        gst_number: '',
        working_hours: '9:00 AM - 7:00 PM',
        working_days: 'Monday - Saturday',
        upi_id: ''
    });

    // WhatsApp Templates
    const [waTemplates, setWaTemplates] = useState({
        confirmation: "Hello {name}, your booking for {bike} is confirmed! We'll see you at {time}.",
        completion: "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
        reminder: "Hello {name}, just a reminder about your appointment today for {bike}.",
        cancellation: "Hello {name}, we have received your request to cancel the booking for {bike}. We hope to see you again soon!"
    });

    // Mechanics State
    const [mechanics, setMechanics] = useState<string[]>([]);
    const [newMechanic, setNewMechanic] = useState('');

    // Data stats
    const [dataStats, setDataStats] = useState({ bookings: 0, customers: 0, expenses: 0, serviceHistory: 0 });

    useEffect(() => {
        fetchSettings();
        fetchDataStats();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('admin_settings').select('*');
            if (error) throw error;

            data?.forEach((setting: any) => {
                if (setting.key === 'passcode') {
                    localStorage.setItem('admin_passcode', setting.value);
                }
                if (setting.key === 'theme_color') {
                    setActiveTheme(setting.value);
                    localStorage.setItem('admin_theme_color', setting.value);
                    document.documentElement.style.setProperty('--admin-accent', setting.value);
                }
                if (setting.key === 'whatsapp_templates') {
                    setWaTemplates(setting.value);
                }
                if (setting.key === 'business_info') {
                    setBusinessInfo(prev => ({ ...prev, ...setting.value }));
                }
                if (setting.key === 'mechanics_list') {
                    setMechanics(Array.isArray(setting.value) ? setting.value : []);
                }
            });
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
        setLoading(false);
    };

    const fetchDataStats = async () => {
        try {
            const [bRes, eRes, shRes] = await Promise.all([
                supabase.from('bookings').select('id, phone', { count: 'exact' }),
                supabase.from('daily_expenses').select('id', { count: 'exact' }),
                supabase.from('service_history').select('id', { count: 'exact' }),
            ]);
            const uniquePhones = new Set((bRes.data || []).map((b: any) => b.phone));
            setDataStats({
                bookings: bRes.count || 0,
                customers: uniquePhones.size,
                expenses: eRes.count || 0,
                serviceHistory: shRes.count || 0
            });
        } catch { /* silent */ }
    };

    const showSaveSuccess = (msg: string) => {
        setSaveSuccess(msg);
        setTimeout(() => setSaveSuccess(''), 3000);
    };

    const handleSaveSetting = async (key: string, value: any, successMsg: string) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('admin_settings')
                .upsert({ key, value });
            if (error) throw error;
            showSaveSuccess(successMsg);
        } catch (err) {
            console.error(`Error saving ${key}:`, err);
            alert(`Failed to save ${key}.`);
        }
        setSaving(false);
    };

    const handleUpdatePasscode = async () => {
        if (passcode.length !== 4) {
            alert('Passcode must be exactly 4 digits.');
            return;
        }
        await handleSaveSetting('passcode', passcode, 'Passcode updated successfully');
        localStorage.setItem('admin_passcode', passcode);
        setPasscode('');
    };

    const handleUpdateTheme = async (color: string) => {
        setActiveTheme(color);
        document.documentElement.style.setProperty('--admin-accent', color);
        localStorage.setItem('admin_theme_color', color);
        await handleSaveSetting('theme_color', color, 'Theme updated');
    };

    const handleSaveBusinessInfo = async () => {
        await handleSaveSetting('business_info', businessInfo, 'Business info saved');
    };

    const handleSaveTemplates = async () => {
        localStorage.setItem('admin_whatsapp_templates', JSON.stringify(waTemplates));
        await handleSaveSetting('whatsapp_templates', waTemplates, 'WhatsApp templates saved');
    };

    const handleAddMechanic = async () => {
        if (!newMechanic.trim()) return;
        const updated = [...mechanics, newMechanic.trim()];
        setMechanics(updated);
        setNewMechanic('');
        await handleSaveSetting('mechanics_list', updated, `${newMechanic.trim()} added`);
    };

    const handleRemoveMechanic = async (name: string) => {
        const updated = mechanics.filter(m => m !== name);
        setMechanics(updated);
        await handleSaveSetting('mechanics_list', updated, `${name} removed`);
    };

    const handleExportData = async () => {
        try {
            const [bRes, eRes, shRes] = await Promise.all([
                supabase.from('bookings').select('*'),
                supabase.from('daily_expenses').select('*'),
                supabase.from('service_history').select('*'),
            ]);

            const exportData = {
                exported_at: new Date().toISOString(),
                business_info: businessInfo,
                bookings: bRes.data || [],
                daily_expenses: eRes.data || [],
                service_history: shRes.data || [],
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smartbike-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showSaveSuccess('Data exported successfully');
        } catch (err) {
            console.error('Export error:', err);
            alert('Export failed.');
        }
    };

    const handleFactoryReset = () => {
        if (confirm('WARNING: This will clear all local settings and cached data. Your cloud data will remain intact. Continue?')) {
            localStorage.clear();
            window.location.reload();
        }
    };


    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-admin-in">
            {/* Save Success Toast */}
            {saveSuccess && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#34d399] text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl animate-admin-in">
                    <CheckCircle size={16} />
                    {saveSuccess}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-4">
                        <div className="w-2 h-10 bg-[#ff2d55] rounded-full shadow-[0_0_20px_rgba(255,45,85,0.4)]"></div>
                        Settings
                    </h3>
                    <p className="text-[#8888a0] text-xs font-bold ml-6">Configure your workshop, team, and preferences</p>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2">
                {sections.map(s => (
                    <button
                        key={s.key}
                        onClick={() => setActiveSection(s.key)}
                        className={clsx(
                            "flex items-center gap-2.5 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                            activeSection === s.key
                                ? "bg-white/10 text-white border-white/20 shadow-lg"
                                : "text-[#8888a0] border-transparent hover:text-white hover:bg-white/5"
                        )}
                    >
                        <s.icon size={14} style={activeSection === s.key ? { color: s.color } : undefined} />
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {/* ─── BUSINESS INFO ─── */}
                {activeSection === 'business' && (
                    <div className="space-y-8 animate-admin-in">
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10 space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-[#34d3991a] rounded-2xl flex items-center justify-center text-[#34d399] border border-[#34d39933]">
                                    <Building2 size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Workshop Details</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">This info is used for WhatsApp messages and invoicing</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Shop Name" icon={Building2} value={businessInfo.shop_name} onChange={(e: any) => setBusinessInfo(p => ({ ...p, shop_name: e.target.value }))} placeholder="e.g. SmartBike Pro Service Center" />
                                <InputField label="Owner Name" icon={User} value={businessInfo.owner_name} onChange={(e: any) => setBusinessInfo(p => ({ ...p, owner_name: e.target.value }))} placeholder="Your full name" />
                                <InputField label="Contact Phone" icon={Phone} value={businessInfo.phone} onChange={(e: any) => setBusinessInfo(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                                <InputField label="Email" icon={Mail} value={businessInfo.email} onChange={(e: any) => setBusinessInfo(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" type="email" />
                                <InputField label="Address" icon={MapPin} value={businessInfo.address} onChange={(e: any) => setBusinessInfo(p => ({ ...p, address: e.target.value }))} placeholder="Full workshop address" />
                                <InputField label="City" icon={Globe} value={businessInfo.city} onChange={(e: any) => setBusinessInfo(p => ({ ...p, city: e.target.value }))} placeholder="City name" />
                                <InputField label="GST Number (Optional)" icon={FileText} value={businessInfo.gst_number} onChange={(e: any) => setBusinessInfo(p => ({ ...p, gst_number: e.target.value }))} placeholder="22AAAAA0000A1Z5" />
                                <InputField label="UPI ID (Optional)" icon={IndianRupee} value={businessInfo.upi_id} onChange={(e: any) => setBusinessInfo(p => ({ ...p, upi_id: e.target.value }))} placeholder="yourname@upi" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Working Hours" icon={Clock} value={businessInfo.working_hours} onChange={(e: any) => setBusinessInfo(p => ({ ...p, working_hours: e.target.value }))} placeholder="9:00 AM - 7:00 PM" />
                                <InputField label="Working Days" icon={Clock} value={businessInfo.working_days} onChange={(e: any) => setBusinessInfo(p => ({ ...p, working_days: e.target.value }))} placeholder="Monday - Saturday" />
                            </div>

                            <button
                                onClick={handleSaveBusinessInfo}
                                disabled={saving}
                                className="w-full md:w-auto px-10 py-4 bg-[#34d399] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#34d39922] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Business Info
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── SECURITY ─── */}
                {activeSection === 'security' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-admin-in">
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-150 rotate-12">
                                <ShieldCheck size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#00c8ff1a] rounded-2xl flex items-center justify-center text-[#00c8ff] border border-[#00c8ff33]">
                                    <Fingerprint size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Admin Passcode</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">4-digit PIN to access this dashboard</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="relative">
                                    <input
                                        type={showPasscode ? "text" : "password"}
                                        maxLength={4}
                                        className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-5 px-6 text-2xl font-mono tracking-[0.5em] text-white focus:border-[#00c8ff] focus:border-opacity-50 focus:ring-4 focus:ring-[#00c8ff0a] outline-none transition-all placeholder:text-[#55556a]"
                                        placeholder="••••"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <button
                                        onClick={() => setShowPasscode(!showPasscode)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8888a0] hover:text-white transition-colors"
                                    >
                                        {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-[#8888a0] font-bold ml-1">Enter exactly 4 digits to set a new passcode</p>
                                <button
                                    onClick={handleUpdatePasscode}
                                    disabled={saving || passcode.length < 4}
                                    className="w-full bg-[#00c8ff] text-black font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#00c8ff22] disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {saving ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                                    Update Passcode
                                </button>
                            </div>
                        </div>

                        {/* Security Status */}
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#34d3991a] rounded-2xl flex items-center justify-center text-[#34d399] border border-[#34d39933]">
                                    <Activity size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">System Status</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Live connection status of all services</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Database Connection', status: 'Connected', color: '#34d399' },
                                    { label: 'AI Chat Engine', status: 'Ready', color: '#34d399' },
                                    { label: 'Real-time Sync', status: 'Active', color: '#00c8ff' },
                                    { label: 'Admin Auth', status: 'Secured', color: '#fbbf24' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <span className="text-xs font-bold text-[#eeeef2]">{item.label}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.status}</span>
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── THEME ─── */}
                {activeSection === 'aesthetics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-admin-in">
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#a78bfa1a] rounded-2xl flex items-center justify-center text-[#a78bfa] border border-[#a78bfa33]">
                                    <Palette size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Accent Color</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Choose a theme for your dashboard</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => handleUpdateTheme(theme.color)}
                                        className={clsx(
                                            "p-5 rounded-2xl border-2 transition-all group flex flex-col items-center gap-3",
                                            activeTheme === theme.color ? "bg-white/10 border-white/20 shadow-lg" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: theme.color }}>
                                            {activeTheme === theme.color && <CheckCircle size={18} className="text-black" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8888a0] group-hover:text-white">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Card */}
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-center items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-dashed transition-colors" style={{ borderColor: `${activeTheme}33` }}>
                                <Monitor size={36} style={{ color: activeTheme }} />
                            </div>
                            <div>
                                <h5 className="text-lg font-black text-white uppercase tracking-wider mb-2">Live Preview</h5>
                                <p className="text-xs text-[#8888a0] font-bold">
                                    Active: <span className="font-black" style={{ color: activeTheme }}>{themes.find(t => t.color === activeTheme)?.name || activeTheme}</span>
                                </p>
                            </div>
                            <div className="w-full space-y-3">
                                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full transition-all duration-700 rounded-full" style={{ backgroundColor: activeTheme, width: '100%' }}></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1 h-10 rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-black transition-colors" style={{ backgroundColor: activeTheme }}>
                                        Primary
                                    </div>
                                    <div className="flex-1 h-10 rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest border transition-colors" style={{ borderColor: `${activeTheme}55`, color: activeTheme }}>
                                        Outline
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── WHATSAPP TEMPLATES ─── */}
                {activeSection === 'comms' && (
                    <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10 animate-admin-in">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#25d3661a] rounded-2xl flex items-center justify-center text-[#25d366] border border-[#25d36633]">
                                    <MessageSquare size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">WhatsApp Templates</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Customize auto-messages sent to customers</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (confirm('Reset all templates to defaults?')) {
                                            setWaTemplates({
                                                confirmation: "Hello {name}, your booking for {bike} is confirmed! We'll see you at {time}.",
                                                completion: "Hi {name}, your {bike} is ready for pickup! Total: {revenue}.",
                                                reminder: "Hello {name}, just a reminder about your appointment today for {bike}.",
                                                cancellation: "Hello {name}, we have received your request to cancel the booking for {bike}. We hope to see you again soon!"
                                            });
                                        }
                                    }}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8888a0] hover:text-white transition-all"
                                >Reset Defaults</button>
                                <button
                                    onClick={handleSaveTemplates}
                                    disabled={saving}
                                    className="bg-[#25d366] text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save size={14} />
                                    {saving ? 'Saving...' : 'Save All'}
                                </button>
                            </div>
                        </div>

                        {/* Available Tags */}
                        <div className="mb-8 p-4 bg-[#050508] rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-[#8888a0] uppercase tracking-widest mb-2">Available Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {['{name}', '{bike}', '{time}', '{revenue}'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-bold text-[#fbbf24]">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {Object.entries(waTemplates).map(([type, value]) => (
                                <div key={type} className="space-y-3">
                                    <label className="text-xs font-black text-white uppercase tracking-widest ml-1 capitalize">{type}</label>
                                    <textarea
                                        className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl p-5 text-sm text-[#eeeef2] focus:border-[#25d36644] outline-none transition-all font-medium leading-relaxed min-h-[90px] placeholder:text-[#55556a]"
                                        value={value}
                                        onChange={(e) => setWaTemplates(prev => ({ ...prev, [type]: e.target.value }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── MECHANICS / TEAM ─── */}
                {activeSection === 'mechanics' && (
                    <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10 animate-admin-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#fbbf241a] rounded-2xl flex items-center justify-center text-[#fbbf24] border border-[#fbbf2433]">
                                <Wrench size={22} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-white uppercase tracking-wider">Mechanic Team</h4>
                                <p className="text-[10px] text-[#8888a0] font-bold">Manage mechanics for booking assignment</p>
                            </div>
                        </div>

                        {/* Add Mechanic */}
                        <div className="flex gap-3 mb-8">
                            <input
                                type="text"
                                placeholder="Enter mechanic name..."
                                className="flex-1 bg-[#050508] border-2 border-white/10 rounded-xl py-3 px-5 text-sm text-white font-bold outline-none focus:border-[#fbbf2444] transition-all placeholder:text-[#55556a]"
                                value={newMechanic}
                                onChange={e => setNewMechanic(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddMechanic()}
                            />
                            <button
                                onClick={handleAddMechanic}
                                disabled={!newMechanic.trim()}
                                className="px-6 py-3 bg-[#fbbf24] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30 flex items-center gap-2"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>

                        {/* Mechanic List */}
                        {mechanics.length > 0 ? (
                            <div className="space-y-3">
                                {mechanics.map((name, i) => (
                                    <div key={name + i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#fbbf241a] flex items-center justify-center text-[#fbbf24] font-black text-sm">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{name}</p>
                                                <p className="text-[9px] text-[#8888a0] font-bold uppercase tracking-widest">Mechanic #{i + 1}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMechanic(name)}
                                            className="p-2 text-[#55556a] hover:text-[#ff2d55] opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#050508] rounded-2xl border border-dashed border-white/10">
                                <Wrench size={32} className="mx-auto text-[#55556a] mb-3" />
                                <p className="text-[#8888a0] text-sm font-bold">No mechanics added yet</p>
                                <p className="text-[#55556a] text-xs mt-1">Add your team to assign them to bookings</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── DATA MANAGEMENT ─── */}
                {activeSection === 'data' && (
                    <div className="space-y-8 animate-admin-in">
                        {/* Data Overview */}
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 lg:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#ff2d551a] rounded-2xl flex items-center justify-center text-[#ff2d55] border border-[#ff2d5533]">
                                    <Database size={22} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-wider">Data Overview</h4>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Records stored in your database</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Bookings', value: dataStats.bookings, color: '#00c8ff' },
                                    { label: 'Customers', value: dataStats.customers, color: '#34d399' },
                                    { label: 'Expenses', value: dataStats.expenses, color: '#ff2d55' },
                                    { label: 'Service Logs', value: dataStats.serviceHistory, color: '#fbbf24' },
                                ].map(stat => (
                                    <div key={stat.label} className="bg-[#050508] p-5 rounded-2xl border border-white/5 text-center">
                                        <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: stat.color }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={handleExportData}
                                className="p-6 bg-[#10101e] border border-white/10 rounded-2xl transition-all hover:border-[#34d39944] hover:bg-white/[0.03] flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#34d3991a] flex items-center justify-center text-[#34d399]">
                                    <Download size={22} />
                                </div>
                                <div className="text-left">
                                    <h5 className="text-sm font-black text-white uppercase tracking-widest mb-0.5">Export Backup</h5>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Download all data as JSON</p>
                                </div>
                            </button>

                            <button
                                onClick={fetchDataStats}
                                className="p-6 bg-[#10101e] border border-white/10 rounded-2xl transition-all hover:border-[#00c8ff44] hover:bg-white/[0.03] flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00c8ff1a] flex items-center justify-center text-[#00c8ff]">
                                    <RefreshCw size={22} />
                                </div>
                                <div className="text-left">
                                    <h5 className="text-sm font-black text-white uppercase tracking-widest mb-0.5">Refresh Stats</h5>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Re-sync data counts</p>
                                </div>
                            </button>

                            <button
                                onClick={handleFactoryReset}
                                className="p-6 bg-[#10101e] border border-[#ff2d5522] rounded-2xl transition-all hover:border-[#ff2d5544] hover:bg-[#ff2d5508] flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#ff2d551a] flex items-center justify-center text-[#ff2d55]">
                                    <AlertTriangle size={22} />
                                </div>
                                <div className="text-left">
                                    <h5 className="text-sm font-black text-[#ff2d55] uppercase tracking-widest mb-0.5">Factory Reset</h5>
                                    <p className="text-[10px] text-[#8888a0] font-bold">Clear local cache only</p>
                                </div>
                            </button>
                        </div>

                        {/* Version Info */}
                        <div className="flex items-center justify-between p-5 bg-[#10101e] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <Cpu size={16} className="text-[#55556a]" />
                                <span className="text-xs font-bold text-[#8888a0]">SmartBike Pro Dashboard</span>
                            </div>
                            <span className="text-[10px] font-black text-[#55556a] uppercase tracking-widest">v2.5.0 • Production</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const themes = [
    { name: 'Cyan', color: '#00c8ff' },
    { name: 'Emerald', color: '#34d399' },
    { name: 'Violet', color: '#a78bfa' },
    { name: 'Amber', color: '#fbbf24' },
    { name: 'Rose', color: '#ff2d55' },
    { name: 'Frost', color: '#ffffff' }
];

const sections = [
    { key: 'business' as const, label: 'Business', icon: Building2, color: '#34d399' },
    { key: 'security' as const, label: 'Security', icon: Shield, color: '#00c8ff' },
    { key: 'aesthetics' as const, label: 'Theme', icon: Palette, color: '#a78bfa' },
    { key: 'comms' as const, label: 'WhatsApp', icon: MessageSquare, color: '#25d366' },
    { key: 'mechanics' as const, label: 'Team', icon: Wrench, color: '#fbbf24' },
    { key: 'data' as const, label: 'Data', icon: Database, color: '#ff2d55' },
];

const InputField = ({ label, value, onChange, placeholder, type = 'text', icon: Icon }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-[#8888a0] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
            {Icon && <Icon size={10} className="text-[#55556a]" />}
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-4 px-5 text-sm text-white font-bold outline-none focus:border-[var(--admin-accent)] focus:border-opacity-40 transition-all placeholder:text-[#55556a]"
        />
    </div>
);
