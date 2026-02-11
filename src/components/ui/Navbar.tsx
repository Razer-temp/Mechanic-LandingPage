'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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

    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <nav className={clsx('navbar', scrolled && 'scrolled')} id="navbar">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    <span className="logo-icon">⚙️</span>
                    <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                </Link>

                <button
                    className={clsx('nav-toggle', mobileMenuOpen && 'active')}
                    id="navToggle"
                    aria-label="Toggle menu"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>

                <ul className={clsx('nav-links', mobileMenuOpen && 'active')} id="navLinks">
                    <li><a href="#services" onClick={closeMenu}>Services</a></li>
                    <li><a href="#diagnosis" onClick={closeMenu}>AI Diagnosis</a></li>
                    <li><a href="#how-it-works" onClick={closeMenu}>How It Works</a></li>
                    <li><a href="#reviews" onClick={closeMenu}>Reviews</a></li>
                    <li><a href="#contact" onClick={closeMenu}>Contact</a></li>

                    {user ? (
                        <>
                            <li><Link href="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                            <li><button onClick={() => { signOut(); closeMenu(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>Sign Out</button></li>
                        </>
                    ) : (
                        <li><Link href="/signup" className="nav-cta" onClick={closeMenu}>Book Service</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
