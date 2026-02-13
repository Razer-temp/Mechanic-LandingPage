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
                <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">
                        <img src="/logo.svg" alt="SmartBike Pro Logo" className="logo-svg w-6 h-6" />
                    </span>
                    <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                </div>

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
