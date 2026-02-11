'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);
        if (error) {
            setError(error);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="landing-page-wrapper min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6 mt-20">
                <div className="booking-card glass-card">
                    <div className="section-header" style={{ marginBottom: '32px' }}>
                        <span className="section-tag">Welcome Back</span>
                        <h1 className="section-title" style={{ fontSize: '2.4rem' }}>User <span className="gradient-text">Login</span></h1>
                        <p className="section-desc">Sign in to manage your bookings and profile</p>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        {error && (
                            <div className="glass-card animate-in fade-in slide-in-from-top-4 duration-300"
                                style={{
                                    padding: '16px',
                                    marginBottom: '24px',
                                    background: 'rgba(255, 45, 85, 0.08)',
                                    border: '1px solid rgba(255, 45, 85, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 45, 85, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent-red)' }} />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: '2px' }}>Authentication Error</strong>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center mb-1">
                                <label style={{ marginBottom: 0 }}>Password</label>
                                <a href="#" className="gradient-text text-xs font-bold hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>

                        <div className="form-actions" style={{ marginTop: '24px' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-glow btn-full"
                            >
                                {loading ? (
                                    <span style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <><span>🔑</span> Sign In</>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link href="/signup" className="gradient-text font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
