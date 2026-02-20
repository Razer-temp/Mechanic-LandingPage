'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Lock, AlertCircle, RefreshCw, ArrowRight, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            // Give Supabase a moment to parse the hash/recovery session
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Wait for potential auth state change if session isn't immediately available
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (session) {
                        setIsCheckingSession(false);
                        subscription.unsubscribe();
                    }
                });

                // Fail after 5 seconds if no session appears
                setTimeout(() => {
                    if (isCheckingSession) {
                        setError('Recovery session not detected. Please request a new link.');
                        setIsCheckingSession(false);
                        subscription.unsubscribe();
                    }
                }, 5000);
            } else {
                setIsCheckingSession(false);
            }
        };
        checkSession();
    }, [supabase]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Neural keys do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Key must be at least 6 characters.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
                setIsSubmitting(false);
            } else {
                setSuccess('Neural key recalibrated. Redirecting...');
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 2000);
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('System failure. Integrity check failed.');
            setIsSubmitting(false);
        }
    };

    if (isCheckingSession) {
        return (
            <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6">
                <div className="text-center">
                    <RefreshCw className="text-[#00c8ff] animate-spin mx-auto mb-4" size={32} />
                    <p className="text-[10px] font-black text-[#55556a] uppercase tracking-[0.4em]">Initializing Security Protocol...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00c8ff1a] blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a78bfa10] blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-admin-in">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#10101e] border-2 border-[#00c8ff33] rounded-[2rem] rotate-6 mb-8 shadow-2xl shadow-[#00c8ff1a]">
                        <Lock size={48} className="text-[#00c8ff] -rotate-6" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
                        Reset <span className="text-[#00c8ff]">Vault</span>
                    </h1>
                    <p className="text-[#55556a] font-black uppercase text-[10px] tracking-[0.4em]">Establish New Neural Key</p>
                </div>

                <div className="bg-[#10101e] border-2 border-white/5 rounded-[3rem] p-12 shadow-2xl">
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-[#55556a] uppercase tracking-widest ml-1">
                                    New Access Key
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[#050508] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:border-[#00c8ff33] outline-none transition-all text-white font-bold text-sm placeholder:text-[#1a1a2e]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#00c8ff] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[9px] font-black text-[#55556a] uppercase tracking-widest ml-1">
                                    Confirm New Key
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] group-focus-within:text-[#00c8ff] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-[#050508] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:border-[#00c8ff33] outline-none transition-all text-white font-bold text-sm placeholder:text-[#1a1a2e]"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#ff2d551a] border border-[#ff2d5533] p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle size={16} className="text-[#ff2d55] shrink-0" />
                                <p className="text-[#ff2d55] text-[10px] font-bold tracking-wide text-left">
                                    {error}
                                </p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-[#34d3991a] border border-[#34d39933] p-4 rounded-xl flex items-center gap-3">
                                <ShieldCheck size={16} className="text-[#34d399] shrink-0" />
                                <p className="text-[#34d399] text-[10px] font-bold tracking-wide">
                                    {success}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !password || !confirmPassword || !!error.includes('session')}
                            className="w-full bg-[#00c8ff] text-[#050508] font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-[#00c8ff22] disabled:opacity-50 mt-4"
                        >
                            {isSubmitting ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Update Terminal <ArrowRight size={18} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050508] flex items-center justify-center">
                <RefreshCw className="text-[#00c8ff] animate-spin" size={32} />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
