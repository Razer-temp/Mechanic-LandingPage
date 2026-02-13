'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const isAdmin = sessionStorage.getItem('admin_auth');
        if (isAdmin === 'true') {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Get the custom passcode from settings or default to 8888
        const storedPasscode = localStorage.getItem('admin_passcode') || '8888';

        // Premium simulated delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (passcode === storedPasscode) {
            sessionStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Neural Key Mismatch. Please re-authenticate.');
            setPasscode('');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00c8ff1a] blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a78bfa10] blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-admin-in">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#10101e] border-2 border-[#00c8ff33] rounded-[2rem] rotate-6 mb-8 shadow-2xl shadow-[#00c8ff1a]">
                        <ShieldCheck size={48} className="text-[#00c8ff] -rotate-6" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
                        SmartBike <span className="text-[#00c8ff]">Admin</span>
                    </h1>
                    <p className="text-[#55556a] font-black uppercase text-[10px] tracking-[0.4em]">Secure Auth Terminal</p>
                </div>

                <div className="bg-[#10101e] border-2 border-white/5 rounded-[3rem] p-12 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-10">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-[#8888a0] uppercase tracking-[0.2em] text-center">
                                Enter Authorization Code
                            </label>
                            <input
                                type="password"
                                placeholder="••••"
                                className="w-full bg-[#050508] border-2 border-white/10 rounded-2xl py-6 text-center text-5xl tracking-[0.4em] focus:border-[#00c8ff] focus:ring-8 focus:ring-[#00c8ff0a] outline-none transition-all text-white font-mono placeholder:text-[#1a1a2e]"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                maxLength={4}
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-[#ff2d551a] border border-[#ff2d5533] p-4 rounded-xl">
                                <p className="text-[#ff2d55] text-xs text-center font-bold tracking-wide">
                                    ⚠️ {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || passcode.length < 4}
                            className="w-full bg-[#00c8ff] text-[#050508] font-black text-sm uppercase tracking-[0.2em] py-6 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#00c8ff22] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-4 border-[#050508]/20 border-t-[#050508] rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Verify Integrity <ArrowRight size={20} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <a href="/" className="inline-flex items-center gap-3 text-[#55556a] hover:text-[#00c8ff] text-xs font-black uppercase tracking-widest transition-all group">
                        <span className="group-hover:-translate-x-2 transition-transform">←</span> Return home
                    </a>
                </div>
            </div>
        </div>
    );
}
