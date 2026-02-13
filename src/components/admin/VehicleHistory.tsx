'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Bike,
    Calendar,
    Wrench,
    Gauge,
    FileText,
    IndianRupee,
    Plus,
    ChevronDown,
    Clock,
    User,
    MapPin,
    Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import clsx from 'clsx';

interface VehicleHistoryProps {
    bookings: any[];
    serviceHistory: any[];
    onHistoryChange: () => void;
}

export default function VehicleHistory({ bookings, serviceHistory, onHistoryChange }: VehicleHistoryProps) {
    const supabase = createClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
    const [showAddEntry, setShowAddEntry] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newEntry, setNewEntry] = useState({
        vehicle_number: '',
        bike_model: '',
        customer_phone: '',
        customer_name: '',
        service_type: '',
        mileage_at_service: '',
        notes: '',
        cost: ''
    });

    // Build unique vehicle list from BOTH bookings and service_history
    const vehicles = useMemo(() => {
        const map: Record<string, { vehicle_number: string; bike_model: string; customer_name: string; customer_phone: string; totalServices: number; lastService: string; totalSpent: number }> = {};

        // From bookings
        bookings.filter(b => b.vehicle_number).forEach((b: any) => {
            const vn = b.vehicle_number.toUpperCase();
            if (!map[vn]) {
                map[vn] = { vehicle_number: vn, bike_model: b.bike_model, customer_name: b.name, customer_phone: b.phone, totalServices: 0, lastService: b.created_at, totalSpent: 0 };
            }
            map[vn].totalServices++;
            map[vn].totalSpent += (b.final_cost || 0);
            if (new Date(b.created_at) > new Date(map[vn].lastService)) map[vn].lastService = b.created_at;
        });

        // From service_history  
        serviceHistory.forEach((s: any) => {
            const vn = s.vehicle_number.toUpperCase();
            if (!map[vn]) {
                map[vn] = { vehicle_number: vn, bike_model: s.bike_model, customer_name: s.customer_name, customer_phone: s.customer_phone, totalServices: 0, lastService: s.date, totalSpent: 0 };
            }
            map[vn].totalServices++;
            map[vn].totalSpent += (s.cost || 0);
            if (new Date(s.date) > new Date(map[vn].lastService)) map[vn].lastService = s.date;
        });

        return Object.values(map)
            .filter(v =>
                v.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.bike_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => new Date(b.lastService).getTime() - new Date(a.lastService).getTime());
    }, [bookings, serviceHistory, searchQuery]);

    // Timeline for selected vehicle
    const timeline = useMemo(() => {
        if (!selectedVehicle) return [];

        const entries: any[] = [];

        // From service_history
        serviceHistory
            .filter(s => s.vehicle_number.toUpperCase() === selectedVehicle)
            .forEach(s => entries.push({
                id: s.id,
                type: 'history',
                date: s.date,
                service_type: s.service_type,
                mileage: s.mileage_at_service,
                notes: s.notes,
                cost: s.cost,
                customer_name: s.customer_name,
            }));

        // From bookings
        bookings
            .filter(b => b.vehicle_number?.toUpperCase() === selectedVehicle)
            .forEach(b => {
                // Avoid duplicates if already in history
                const exists = entries.some(e => e.service_type === b.service_type && e.date === b.preferred_date);
                if (!exists) {
                    entries.push({
                        id: b.id,
                        type: 'booking',
                        date: b.preferred_date || b.created_at?.split('T')[0],
                        service_type: b.service_type,
                        mileage: null,
                        notes: b.notes,
                        cost: b.final_cost || b.estimated_cost,
                        customer_name: b.name,
                        status: b.status,
                    });
                }
            });

        return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedVehicle, serviceHistory, bookings]);

    // Next service recommendation
    const latestMileage = timeline.find(t => t.mileage)?.mileage || 0;
    const nextServiceMileage = latestMileage > 0 ? Math.ceil(latestMileage / 5000) * 5000 : null;

    const handleAddEntry = async () => {
        if (!newEntry.vehicle_number || !newEntry.service_type || !newEntry.customer_name) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('service_history').insert({
                vehicle_number: newEntry.vehicle_number.toUpperCase(),
                bike_model: newEntry.bike_model,
                customer_phone: newEntry.customer_phone,
                customer_name: newEntry.customer_name,
                service_type: newEntry.service_type,
                mileage_at_service: newEntry.mileage_at_service ? parseFloat(newEntry.mileage_at_service) : null,
                notes: newEntry.notes || null,
                cost: newEntry.cost ? parseFloat(newEntry.cost) : 0,
                date: new Date().toISOString().split('T')[0]
            });
            if (error) throw error;
            setNewEntry({ vehicle_number: '', bike_model: '', customer_phone: '', customer_name: '', service_type: '', mileage_at_service: '', notes: '', cost: '' });
            setShowAddEntry(false);
            onHistoryChange();
        } catch (err) {
            console.error('Error adding entry:', err);
            alert('Failed to add service entry');
        }
        setSaving(false);
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('Are you sure you want to delete this history record?')) return;
        try {
            const { error } = await supabase.from('service_history').delete().eq('id', id);
            if (error) throw error;
            onHistoryChange();
        } catch (err) {
            console.error('Error deleting entry:', err);
            alert('Failed to delete entry');
        }
    };

    return (
        <div className="space-y-10 animate-admin-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#fbbf24] rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)]"></div>
                    Garage Hub
                </h3>
                <button
                    onClick={() => setShowAddEntry(!showAddEntry)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#fbbf241a] text-[#fbbf24] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#fbbf2433] transition-all border border-[#fbbf2433]"
                >
                    <Plus size={14} />
                    Log Service Entry
                </button>
            </div>

            {/* Add Entry Form */}
            {showAddEntry && (
                <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 space-y-4">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">New Service Log</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Vehicle Number (e.g. DL-01-AB-1234)" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.vehicle_number} onChange={e => setNewEntry(p => ({ ...p, vehicle_number: e.target.value }))} />
                        <input type="text" placeholder="Bike Model" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.bike_model} onChange={e => setNewEntry(p => ({ ...p, bike_model: e.target.value }))} />
                        <input type="text" placeholder="Customer Name" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.customer_name} onChange={e => setNewEntry(p => ({ ...p, customer_name: e.target.value }))} />
                        <input type="text" placeholder="Customer Phone" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.customer_phone} onChange={e => setNewEntry(p => ({ ...p, customer_phone: e.target.value }))} />
                        <input type="text" placeholder="Service Type" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.service_type} onChange={e => setNewEntry(p => ({ ...p, service_type: e.target.value }))} />
                        <input type="number" placeholder="Mileage (km)" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.mileage_at_service} onChange={e => setNewEntry(p => ({ ...p, mileage_at_service: e.target.value }))} />
                        <input type="number" placeholder="Cost ₹" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.cost} onChange={e => setNewEntry(p => ({ ...p, cost: e.target.value }))} />
                        <input type="text" placeholder="Notes (optional)" className="bg-[#050508] border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold outline-none focus:border-[#fbbf2433]" value={newEntry.notes} onChange={e => setNewEntry(p => ({ ...p, notes: e.target.value }))} />
                    </div>
                    <button onClick={handleAddEntry} disabled={saving} className="px-6 py-3 bg-[#fbbf24] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            )}

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#fbbf24] transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by vehicle number, model, or owner..."
                    className="w-full bg-[#10101e] border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-sm focus:border-[#fbbf2433] focus:ring-4 focus:ring-[#fbbf2405] outline-none transition-all placeholder:text-[#55556a]"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Vehicle Grid + Detail Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Vehicle List */}
                <div className="lg:col-span-2 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar-minimal">
                    {vehicles.length === 0 ? (
                        <div className="text-center py-20 bg-[#10101e] rounded-3xl border border-dashed border-white/10">
                            <Bike size={40} className="mx-auto text-[#55556a] mb-4" />
                            <p className="text-[#55556a] font-bold text-sm">No vehicles found</p>
                        </div>
                    ) : vehicles.map(v => (
                        <div
                            key={v.vehicle_number}
                            onClick={() => setSelectedVehicle(v.vehicle_number)}
                            className={clsx(
                                "bg-[#10101e] border-2 rounded-2xl p-6 cursor-pointer transition-all hover:border-[#fbbf2433]",
                                selectedVehicle === v.vehicle_number ? "border-[#fbbf24] shadow-lg shadow-[#fbbf2411]" : "border-white/5"
                            )}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-black text-[#fbbf24] uppercase tracking-wider">{v.vehicle_number}</span>
                                <span className="text-[9px] font-bold text-[#55556a] uppercase tracking-widest">{v.totalServices} services</span>
                            </div>
                            <p className="text-white font-bold text-base mb-1">{v.bike_model}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-[#55556a] text-xs font-bold flex items-center gap-1"><User size={10} /> {v.customer_name}</p>
                                <p className="text-[#34d399] text-xs font-black">₹{v.totalSpent.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-3">
                    {selectedVehicle ? (
                        <div className="bg-[#10101e] border border-white/10 rounded-3xl p-8 space-y-6">
                            {/* Vehicle Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-2xl font-black text-[#fbbf24] uppercase tracking-wider">{selectedVehicle}</h4>
                                    <p className="text-white font-bold text-lg mt-1">{vehicles.find(v => v.vehicle_number === selectedVehicle)?.bike_model}</p>
                                    <p className="text-[#55556a] text-sm font-bold mt-1 flex items-center gap-1">
                                        <User size={12} /> {vehicles.find(v => v.vehicle_number === selectedVehicle)?.customer_name}
                                    </p>
                                </div>
                                {nextServiceMileage && latestMileage > 0 && (
                                    <div className="bg-[#fbbf241a] border border-[#fbbf2433] rounded-2xl p-4 text-center">
                                        <p className="text-[8px] font-black text-[#fbbf24] uppercase tracking-widest mb-1">Next Service</p>
                                        <p className="text-xl font-black text-white">{nextServiceMileage.toLocaleString()} km</p>
                                        <p className="text-[8px] text-[#55556a] font-bold mt-1">{(nextServiceMileage - latestMileage).toLocaleString()} km remaining</p>
                                    </div>
                                )}
                            </div>

                            {/* Timeline */}
                            <div className="space-y-1">
                                <h5 className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <Clock size={12} className="text-[#fbbf24]" /> Service Timeline
                                </h5>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar-minimal">
                                    {timeline.map((entry, i) => (
                                        <div key={entry.id + i} className="flex gap-4">
                                            {/* Timeline dot + line */}
                                            <div className="flex flex-col items-center">
                                                <div className={clsx(
                                                    "w-3 h-3 rounded-full flex-shrink-0",
                                                    i === 0 ? "bg-[#fbbf24]" : "bg-white/20"
                                                )}></div>
                                                {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1"></div>}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 pb-6">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-sm font-black text-white">{entry.service_type}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[#34d399] text-sm font-black">₹{(entry.cost || 0).toLocaleString('en-IN')}</span>
                                                        {entry.type === 'history' && (
                                                            <button
                                                                onClick={() => handleDeleteEntry(entry.id)}
                                                                className="text-[#55556a] hover:text-[#ff2d55] transition-colors"
                                                                title="Delete Entry"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-[#55556a] uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    {entry.mileage && <span className="flex items-center gap-1"><Gauge size={10} /> {entry.mileage.toLocaleString()} km</span>}
                                                    {entry.status && (
                                                        <span className={clsx(
                                                            "px-2 py-0.5 rounded",
                                                            entry.status === 'completed' ? "bg-[#34d3991a] text-[#34d399]" :
                                                                entry.status === 'pending' ? "bg-[#fbbf241a] text-[#fbbf24]" :
                                                                    "bg-[#00c8ff1a] text-[#00c8ff]"
                                                        )}>{entry.status}</span>
                                                    )}
                                                </div>
                                                {entry.notes && (
                                                    <p className="text-xs text-[#8888a0] mt-2 italic leading-relaxed">&ldquo;{entry.notes}&rdquo;</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#10101e] border border-dashed border-white/10 rounded-3xl p-16 text-center">
                            <Bike size={48} className="mx-auto text-[#55556a] mb-4" />
                            <p className="text-[#55556a] font-bold text-sm">Select a vehicle to view service history</p>
                            <p className="text-[#55556a] text-xs mt-2">Click any vehicle card on the left</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
