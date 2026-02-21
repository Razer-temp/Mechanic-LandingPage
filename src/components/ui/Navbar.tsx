'use client';

import clsx from 'clsx';

import { useState, useEffect } from 'react';

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
                    onMouseMove={(e) => {
                        const btn = e.currentTarget;
                        const rect = btn.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) rotate(${mobileMenuOpen ? '90deg' : '0deg'})`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = mobileMenuOpen ? 'rotate(90deg)' : '';
                    }}
                >
                    <span></span><span></span><span></span>
                </button>

                <div
                    className={clsx('nav-overlay', mobileMenuOpen && 'active')}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                    onMouseMove={(e) => {
                        const overlay = e.currentTarget;
                        const { clientX, clientY } = e;
                        const { width, height } = overlay.getBoundingClientRect();
                        const x = (clientX / width - 0.5) * 20;
                        const y = (clientY / height - 0.5) * 20;
                        overlay.style.setProperty('--px', `${x}px`);
                        overlay.style.setProperty('--py', `${y}px`);
                    }}
                />

                <ul className={clsx('nav-links', mobileMenuOpen && 'active')} id="navLinks">
                    {['diagnosis', 'services', 'how-it-works', 'reviews'].map((target) => (
                        <li key={target} className="nav-item">
                            <a
                                href={`#${target}`}
                                onClick={(e) => {
                                    const targetEl = e.currentTarget;
                                    targetEl.classList.add('clicked');
                                    setTimeout(() => {
                                        targetEl.classList.remove('clicked');
                                        closeMenu();
                                    }, 400);
                                }}
                                className={getLinkClass(target)}
                            >
                                <span className="link-text">
                                    {target.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                                <div className="link-glow" />
                            </a>
                        </li>
                    ))}
                    <li className="nav-item">
                        <a
                            href="#booking"
                            className="nav-cta-premium"
                            onClick={(e) => {
                                e.currentTarget.classList.add('clicked');
                                setTimeout(closeMenu, 400);
                            }}
                        >
                            Book Service
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
