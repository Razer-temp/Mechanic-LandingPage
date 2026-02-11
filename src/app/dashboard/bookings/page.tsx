'use client';

import { Calendar } from 'lucide-react';

export default function BookingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-accent" />
            </div>
            <h1 className="section-title" style={{ fontSize: '2rem' }}>My <span className="gradient-text">Bookings</span></h1>
            <p className="text-text-secondary text-sm max-w-xs">
                This section is currently under construction. You'll soon be able to manage all your past and upcoming service appointments here.
            </p>
        </div>
    );
}
