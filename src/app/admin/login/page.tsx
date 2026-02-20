'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.app_metadata?.role === 'admin') {
                router.push('/admin/dashboard');
            }
        };
        checkAuth();

        if (searchParams.get('error') === 'unauthorized') {
            setError('Access Denied. Admin privileges required.');
        }
    }, [router, supabase, searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) {
                setError(loginError.message);
                setIsSubmitting(false);
                return;
            }

            if (data.user?.app_metadata?.role !== 'admin') {
                await supabase.auth.signOut();
                setError('Neural Key Mismatch. Admin access only.');
                setIsSubmitting(false);
                return;
            }

            // Success
            router.push('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection failure. Protocol aborted.');
            setIsSubmitting(false);
        }
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
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-[#55556a] uppercase tracking-widest ml-1">
                                    Admin Email
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="admin@smartbikepro.com"
                                        className="w-full bg-[#050508] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[#00c8ff33] outline-none transition-all text-white font-bold text-sm placeholder:text-[#1a1a2e]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-[#55556a] uppercase tracking-widest ml-1">
                                    Access Key
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#050508] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-[#00c8ff33] outline-none transition-all text-white font-bold text-sm placeholder:text-[#1a1a2e]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#ff2d551a] border border-[#ff2d5533] p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle size={16} className="text-[#ff2d55] shrink-0" />
                                <p className="text-[#ff2d55] text-[10px] font-bold tracking-wide">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !email || !password}
                            className="w-full bg-[#00c8ff] text-[#050508] font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#00c8ff22] disabled:opacity-50 mt-4"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-3 border-[#050508]/20 border-t-[#050508] rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Verify Integrity <ArrowRight size={18} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <a href="/" className="inline-flex items-center gap-3 text-[#55556a] hover:text-[#00c8ff] text-[10px] font-black uppercase tracking-widest transition-all group">
                        <span className="group-hover:-translate-x-2 transition-transform">←</span> Return home
                    </a>
                </div>
            </div>
        </div>
    );
}
