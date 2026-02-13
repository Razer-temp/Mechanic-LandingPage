'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const isAdmin = sessionStorage.getItem('admin_auth');
        if (isAdmin === 'true') {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this should be an env variable or server action
        // For "simpler way" as requested:
        if (passcode === '8888') {
            sessionStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid passcode. Access denied.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#0c0c16] border border-[#ffffff0a] rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🔓</div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00c8ff] to-[#a78bfa] bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                    <p className="text-gray-400 mt-2">Enter passcode to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter 4-digit passcode"
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] focus:border-[#00c8ff] outline-none transition-all"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            maxLength={4}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-[#ff2d55] text-sm text-center font-medium animate-pulse">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#00c8ff] to-[#0090c0] text-white font-bold py-3 rounded-xl hover:translate-y-[-2px] transition-all shadow-lg shadow-[#00c8ff1a]"
                    >
                        Access Dashboard
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <a href="/" className="text-gray-500 hover:text-[#00c8ff] text-sm transition-colors">
                        ← Back to Landing Page
                    </a>
                </div>
            </div>
        </div>
    );
}
