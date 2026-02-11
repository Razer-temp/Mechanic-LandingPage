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
                    <span className="logo-icon">
                        <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1L8.5 3H4.5V7L2.5 10.5V13.5L4.5 17V21H8.5L12 23L15.5 21H19.5V17L21.5 13.5V10.5L19.5 7V3H15.5L12 1ZM12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5Z" fill="currentColor" />
                            <path d="M12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5Z" fill="currentColor" />
                        </svg>
                    </span>
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
