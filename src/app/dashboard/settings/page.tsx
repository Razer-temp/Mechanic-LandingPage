'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-accent" />
            </div>
            <h1 className="section-title" style={{ fontSize: '2rem' }}>Account <span className="gradient-text">Settings</span></h1>
            <p className="text-text-secondary text-sm max-w-xs">
                Settings are coming soon! You'll be able to update your profile, change your password, and manage notification preferences.
            </p>
        </div>
    );
}
