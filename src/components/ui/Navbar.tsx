'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';

const navItems = [
    { id: 'diagnosis', title: 'Diagnosis', subtitle: 'Identify issues with precision' },
    { id: 'services', title: 'Services', subtitle: 'Comprehensive bike care' },
    { id: 'how-it-works', title: 'How It Works', subtitle: 'Our seamless process' },
    { id: 'reviews', title: 'Reviews', subtitle: 'What our riders say' }
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

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
        }, {
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        });

        const sections = document.querySelectorAll('section[id], header[id]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const closeMenu = () => setMobileMenuOpen(false);

    const getLinkClass = (id: string) => clsx('nav-link-card', activeSection === id && 'active-link');

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
                    className={clsx('nav-overlay-v1', mobileMenuOpen && 'active')}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                >
                    <div className="nav-bloom" />
                </div>

                <div className={clsx('nav-menu-container', mobileMenuOpen && 'active')} id="navLinks">
                    <div className="nav-links-inner">
                        {navItems.map((item, index) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={closeMenu}
                                className={clsx('nav-link-v1', activeSection === item.id && 'active')}
                                style={{ '--idx': index } as React.CSSProperties}
                            >
                                <div className="nav-link-content">
                                    <span className="nav-link-title">{item.title}</span>
                                    <span className="nav-link-subtitle">{item.subtitle}</span>
                                </div>
                                <div className="nav-link-glow" />
                            </a>
                        ))}
                    </div>

                    <div className="nav-spacer" />

                    <div className="nav-cta-wrapper">
                        <div className="premium-cta-block">
                            <a href="#booking" className="premium-cta-btn" onClick={closeMenu}>
                                Book Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
