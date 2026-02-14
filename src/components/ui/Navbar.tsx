'use client';

import clsx from 'clsx';

import { useState, useEffect } from 'react';
import Link from 'next/link';
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.6 });

        const sections = document.querySelectorAll('section[id], header[id]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const closeMenu = () => setMobileMenuOpen(false);

    const getLinkClass = (id: string) => clsx('', activeSection === id && 'active-link');

    return (
        <nav className={clsx('navbar', scrolled && 'scrolled')} id="navbar">
            <div className="container nav-container">
                <a href="#" className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <span className="logo-icon">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.svg" alt="SmartBike Pro Logo" className="logo-svg w-6 h-6" />
                    </span>
                    <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                </a>

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
                    <li><a href="#services" onClick={closeMenu} className={getLinkClass('services')}>Services</a></li>
                    <li><a href="#diagnosis" onClick={closeMenu} className={getLinkClass('diagnosis')}>AI Diagnosis</a></li>
                    <li><a href="#how-it-works" onClick={closeMenu} className={getLinkClass('how-it-works')}>How It Works</a></li>
                    <li><a href="#reviews" onClick={closeMenu} className={getLinkClass('reviews')}>Reviews</a></li>

                    <li><a href="#booking" className="nav-cta" onClick={closeMenu}>Book Service</a></li>
                </ul>
            </div>
        </nav>
    );
}
