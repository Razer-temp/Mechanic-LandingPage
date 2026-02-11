'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signUp(email, password, fullName);
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
                <div className="booking-card glass-card animate-on-scroll">
                    <div className="section-header" style={{ marginBottom: '32px' }}>
                        <span className="section-tag">Start Your Journey</span>
                        <h1 className="section-title" style={{ fontSize: '2.4rem' }}>Create <span className="gradient-text">Account</span></h1>
                        <p className="section-desc">Join SmartBike Pro for AI-powered care</p>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        {error && (
                            <div className="p-4 rounded-xl mb-6 bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                        </div>

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
                            <label>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
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
                                    <><span>✅</span> Create Account</>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link href="/login" className="gradient-text font-bold hover:underline">
                            Sign in
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
