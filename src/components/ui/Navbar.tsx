'use client';

import clsx from 'clsx';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getLenis } from './SmoothScroll';
import '../../app/animated-button.css';

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
    const isClosingRef = useRef(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            // Pause Lenis while menu is open
            const lenis = getLenis();
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = '';
            // Resume Lenis when menu closes
            const lenis = getLenis();
            if (lenis) lenis.start();
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

    // Smooth close → scroll for mobile nav links
    const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        if (isClosingRef.current) return;
        isClosingRef.current = true;

        // Close menu first
        setMobileMenuOpen(false);

        // Let the close animation play, then scroll smoothly
        requestAnimationFrame(() => {
            setTimeout(() => {
                const lenis = getLenis();
                const target = document.getElementById(sectionId);
                if (target && lenis) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                isClosingRef.current = false;
            }, 250); // Wait for menu close CSS transition
        });
    }, []);

    const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

    const getLinkClass = (id: string) => clsx('nav-link-card', activeSection === id && 'active-link');

    return (
        <nav className={clsx('navbar', scrolled && 'scrolled')} id="navbar">
            <div className="container nav-container">
                <a href="#" className="nav-logo" onClick={(e) => {
                    e.preventDefault();
                    const lenis = getLenis();
                    if (lenis) {
                        lenis.scrollTo(0, { duration: 1.2 });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}>
                    <span className="logo-icon">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.svg" alt="SmartBike Pro Logo" className="logo-svg w-6 h-6" />
                    </span>
                    <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                </a>

                {/* --- DESKTOP NAVIGATION (Visible > 768px) --- */}
                <ul className="nav-links desktop-only" id="navLinksDesktop">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={clsx(activeSection === item.id && 'active-link')}
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a href="#booking" className="nav-cta animated-gradient-btn bordered" style={{ marginLeft: '12px' }}>
                            Book Service
                        </a>
                    </li>
                </ul>

                {/* --- MOBILE NAVIGATION TOGGLE (Visible < 768px) --- */}
                <button
                    className={clsx('nav-toggle mobile-only', mobileMenuOpen && 'active')}
                    id="navToggle"
                    aria-label="Toggle menu"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>

                {/* --- MOBILE NAVIGATION OVERLAY (v1.0 Pixel-Perfect) --- */}
                <div
                    className={clsx('nav-overlay-v1 mobile-only', mobileMenuOpen && 'active')}
                    onClick={closeMenu}
                    aria-hidden="true"
                >
                    <div className="nav-bloom" />
                </div>

                <div className={clsx('nav-menu-container mobile-only', mobileMenuOpen && 'active')} id="navLinksMobile">
                    <div className="nav-links-inner">
                        {navItems.map((item, index) => (
                            <a
                                key={`mobile-${item.id}`}
                                href={`#${item.id}`}
                                onClick={(e) => handleNavClick(e, item.id)}
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
                            <a href="#booking" className="animated-gradient-btn premium-cta-btn bordered" style={{ width: '100%' }} onClick={(e) => handleNavClick(e, 'booking')}>
                                Book Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
