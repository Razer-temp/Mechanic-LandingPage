'use client';

import clsx from 'clsx';

import { useState, useEffect } from 'react';
import Link from 'next/link';
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
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

                <div
                    className={clsx('nav-overlay', mobileMenuOpen && 'active')}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />

                <ul className={clsx('nav-links', mobileMenuOpen && 'active')} id="navLinks">
                    <li><a href="#services" onClick={closeMenu}>Services</a></li>
                    <li><a href="#diagnosis" onClick={closeMenu}>AI Diagnosis</a></li>
                    <li><a href="#how-it-works" onClick={closeMenu}>How It Works</a></li>
                    <li><a href="#reviews" onClick={closeMenu}>Reviews</a></li>
                    <li><a href="#contact" onClick={closeMenu}>Contact</a></li>


                    <li><a href="#booking" className="nav-cta" onClick={closeMenu}>Book Service</a></li>
                </ul>
            </div>
        </nav>
    );
}
