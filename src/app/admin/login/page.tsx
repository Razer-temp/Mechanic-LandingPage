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

        // Simulate network delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        if (passcode === '8888') {
            sessionStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid Access Key');
            setPasscode('');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,#0c0c1e_0%,#050508_100%)]">
            <div className="w-full max-w-md animate-admin-in">
                {/* Logo/Brand Area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-[#00c8ff] to-[#a78bfa] rounded-3xl rotate-12 mb-6 shadow-[0_0_40px_rgba(0,200,255,0.2)]">
                        <ShieldCheck size={40} className="text-black -rotate-12" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                        SMARTBIKE<span className="text-[#00c8ff]">PRO</span>
                    </h1>
                    <p className="text-[#8888a0] font-medium tracking-wide uppercase text-xs">Command Center</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0c0c16]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
                    {/* Subtle Glow Effect */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00c8ff]/10 blur-[80px] rounded-full group-hover:bg-[#00c8ff]/20 transition-all duration-700"></div>

                    <form onSubmit={handleLogin} className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold text-[#8888a0] uppercase tracking-[0.2em] ml-1">
                                Security Passcode
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="password"
                                    placeholder="••••"
                                    className={`w-full bg-black/40 border ${error ? 'border-[#ff2d55]/50' : 'border-white/10'} group-hover/input:border-white/20 rounded-2xl px-6 py-5 text-center text-3xl tracking-[0.5em] focus:border-[#00c8ff] focus:ring-4 focus:ring-[#00c8ff0a] outline-none transition-all placeholder:text-white/5 text-white font-mono`}
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    maxLength={4}
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-[#00c8ff] transition-colors" size={20} />
                            </div>
                        </div>

                        {error && (
                            <p className="text-[#ff2d55] text-xs text-center font-bold tracking-wide animate-bounce">
                                ⚠️ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || passcode.length < 4}
                            className="w-full relative group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#00c8ff] to-[#a78bfa] rounded-2xl blur opacity-25 group-hover/btn:opacity-60 transition-all duration-500"></div>
                            <div className="relative bg-[#00c8ff] text-black font-black text-sm uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Authorize Access <ArrowRight size={18} />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-[#55556a] text-[10px] uppercase font-bold tracking-[0.3em]">
                        Restricted Access • Monitoring Active
                    </p>
                    <a href="/" className="inline-flex items-center gap-2 text-[#8888a0] hover:text-white text-xs font-semibold transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Terminal
                    </a>
                </div>
            </div>
        </div>
    );
}
