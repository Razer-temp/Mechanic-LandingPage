'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, Wrench } from 'lucide-react';
import clsx from 'clsx';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4',
                scrolled
                    ? 'bg-bg-void/80 backdrop-blur-md border-b border-border-subtle py-3'
                    : 'bg-transparent'
            )}
        >
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-text-primary font-heading font-extrabold text-xl tracking-tight group">
                    <Wrench className="w-6 h-6 text-accent-base group-hover:rotate-12 transition-transform" />
                    <span>Smart<span className="text-accent-base">Bike</span> Pro</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#services" className="nav-link text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Services</Link>
                    <Link href="#diagnosis" className="nav-link text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">AI Diagnosis</Link>
                    <Link href="#how-it-works" className="nav-link text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">How It Works</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="text-sm font-medium text-text-primary hover:text-accent-base transition-colors flex items-center gap-2">
                                <UserIcon className="w-4 h-4" /> Dashboard
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Log In</Link>
                            <Link
                                href="/signup"
                                className="px-5 py-2 rounded-xl bg-accent-base text-white text-sm font-semibold hover:bg-accent-dim transition-all shadow-lg shadow-accent-base/20 hover:shadow-accent-base/35 hover:-translate-y-0.5"
                            >
                                Book Service
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-text-primary hover:text-accent-base transition-colors"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-[60px] bg-bg-void/95 backdrop-blur-xl z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-right-10 duration-300">
                    <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">Services</Link>
                    <Link href="#diagnosis" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">AI Diagnosis</Link>
                    <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">How It Works</Link>
                    <hr className="border-border-subtle" />
                    {user ? (
                        <>
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-primary flex items-center gap-2">
                                <UserIcon className="w-5 h-5" /> Dashboard
                            </Link>
                            <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-lg font-medium text-text-muted flex items-center gap-2 text-left">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary">Log In</Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 rounded-xl bg-accent-base text-white text-center font-semibold text-lg shadow-lg shadow-accent-base/20">
                                Book Service
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
