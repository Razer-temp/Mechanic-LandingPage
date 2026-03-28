'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { getLenis } from './SmoothScroll';
import { BrainCircuit, Wrench, Sparkles, MessageSquareText, CalendarCheck } from 'lucide-react';
import '../../app/animated-button.css';

const navItems = [
    { id: 'diagnosis', title: 'Diagnosis', subtitle: 'Identify issues with precision', icon: BrainCircuit },
    { id: 'services', title: 'Services', subtitle: 'Comprehensive bike care', icon: Wrench },
    { id: 'how-it-works', title: 'How It Works', subtitle: 'Our seamless process', icon: Sparkles },
    { id: 'reviews', title: 'Reviews', subtitle: 'What our riders say', icon: MessageSquareText }
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
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
        }, {
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        });

        const sections = document.querySelectorAll('section[id], header[id]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const lenis = getLenis();
        const target = document.getElementById(sectionId);
        
        if (sectionId === 'top') {
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (target) {
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            {/* --- DESKTOP NAVBAR --- */}
            <nav className={clsx('navbar', scrolled && 'scrolled')} id="navbar">
                <div className="container nav-container">
                    <a href="#" className="nav-logo" onClick={(e) => scrollToSection(e, 'top')}>
                        <span className="logo-icon">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.svg" alt="SmartBike Pro — AI Powered Bike Service Center" className="logo-svg w-6 h-6" width={24} height={24} />
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
                                    onClick={(e) => scrollToSection(e, item.id)}
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a href="#booking" className="nav-cta animated-gradient-btn bordered" style={{ marginLeft: '12px' }} onClick={(e) => scrollToSection(e, 'booking')}>
                                Book Service
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* --- MOBILE DYNAMIC ISLAND BOTTOM BAR (Visible < 768px) --- */}
            <div className={clsx('mobile-bottom-nav', scrolled && 'visible')}>
                <div className="mobile-nav-inner">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <a 
                                key={`mob-${item.id}`} 
                                href={`#${item.id}`} 
                                className={clsx('mobile-nav-item', isActive && 'active')}
                                onClick={(e) => scrollToSection(e, item.id)}
                                aria-label={item.title}
                            >
                                <Icon className="mobile-nav-icon" />
                                {isActive && <span className="mobile-nav-label">{item.title}</span>}
                            </a>
                        );
                    })}
                    <div className="mobile-nav-divider"></div>
                    <a 
                        href="#booking"
                        className={clsx('mobile-nav-item mobile-nav-cta', activeSection === 'booking' && 'active')}
                        onClick={(e) => scrollToSection(e, 'booking')}
                        aria-label="Book Service"
                    >
                        <CalendarCheck className="mobile-nav-icon" />
                    </a>
                </div>
            </div>
        </>
    );
}
