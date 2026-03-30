'use client';

import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getLenis } from './SmoothScroll';
import {
  BrainCircuit, Wrench, Sparkles, MessageSquareText, CalendarCheck,
  ChevronDown, MoreHorizontal, Calculator, Award, MapPin,
  ShieldCheck, BadgeCheck, HelpCircle, X
} from 'lucide-react';
import '../../app/animated-button.css';

/* ────────── DATA ────────── */

// Desktop top-level items rendered BEFORE the Services dropdown
const preDropdownItems = [
    { id: 'diagnosis', title: 'Diagnosis', icon: BrainCircuit },
];

// Desktop top-level items rendered BETWEEN the two dropdowns (in page sequence)
const midNavItems = [
    { id: 'how-it-works', title: 'How It Works', icon: Sparkles },
    { id: 'reviews', title: 'Reviews', icon: MessageSquareText },
];

const servicesDropdown = {
    trigger: { title: 'Services', icon: Wrench },
    items: [
        { id: 'services', title: 'All Services', subtitle: 'Engine, brakes, electrical & more', icon: Wrench },
        { id: 'why-us', title: 'Why Choose Us', subtitle: 'Trust, warranty & expertise', icon: ShieldCheck },
        { id: 'estimator', title: 'Cost Estimator', subtitle: 'AI-powered instant pricing', icon: Calculator },
    ]
};

const moreDropdown = {
    trigger: { title: 'More', icon: MoreHorizontal },
    items: [
        { id: 'brand-services', title: 'Brand Experts', subtitle: 'Honda, Hero, RE, KTM & more', icon: Award },
        { id: 'faq', title: 'FAQ', subtitle: 'Common questions answered', icon: HelpCircle },
        { id: 'trust-signals', title: 'Trust & Certs', subtitle: 'OEM parts, certified mechanics', icon: BadgeCheck },
        { id: 'contact', title: 'Contact & Location', subtitle: 'Visit us or get directions', icon: MapPin },
    ]
};

// All section IDs that should be tracked for active state
const allSectionIds = [
    'diagnosis', 'services', 'why-us', 'how-it-works', 'estimator',
    'reviews', 'booking', 'brand-services', 'faq', 'trust-signals', 'contact'
];

// Map section IDs to their parent dropdown for active indicator
const dropdownSectionMap: Record<string, 'services' | 'more'> = {
    'services': 'services', 'why-us': 'services', 'estimator': 'services',
    'brand-services': 'more', 'faq': 'more',
    'trust-signals': 'more', 'contact': 'more',
};

// Mobile bottom bar primary items (icons-only layout — in page sequence)
const mobileNavItems = [
    { id: 'diagnosis', title: 'Diagnosis', icon: BrainCircuit },
    { id: 'services', title: 'Services', icon: Wrench },
    { id: 'how-it-works', title: 'Process', icon: Sparkles },
    { id: 'reviews', title: 'Reviews', icon: MessageSquareText },
];

// Mobile "More" sheet items (in page sequence)
const mobileMoreItems = [
    { id: 'why-us', title: 'Why Choose Us', subtitle: 'Trust, warranty & expertise', icon: ShieldCheck },
    { id: 'estimator', title: 'Cost Estimator', subtitle: 'AI-powered instant pricing', icon: Calculator },
    { id: 'brand-services', title: 'Brand Experts', subtitle: 'Honda, Hero, RE, KTM & more', icon: Award },
    { id: 'faq', title: 'FAQ', subtitle: 'Common questions answered', icon: HelpCircle },
    { id: 'trust-signals', title: 'Trust & Certs', subtitle: 'OEM parts, certified mechanics', icon: BadgeCheck },
    { id: 'contact', title: 'Contact & Map', subtitle: 'Visit us or get directions', icon: MapPin },
];


export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [openDropdown, setOpenDropdown] = useState<'services' | 'more' | null>(null);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

    const servicesRef = useRef<HTMLLIElement>(null);
    const moreRef = useRef<HTMLLIElement>(null);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active section tracking
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

    // Close desktop dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                openDropdown &&
                servicesRef.current && !servicesRef.current.contains(e.target as Node) &&
                moreRef.current && !moreRef.current.contains(e.target as Node)
            ) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdown]);

    // Close mobile sheet on ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileSheetOpen(false);
                setOpenDropdown(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Prevent body scroll when mobile sheet is open
    useEffect(() => {
        if (mobileSheetOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileSheetOpen]);

    const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
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

        // Close menus after navigation
        setOpenDropdown(null);
        setMobileSheetOpen(false);
    }, []);

    // Dropdown hover handlers with delay for better UX
    const handleDropdownEnter = (dropdown: 'services' | 'more') => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setOpenDropdown(dropdown);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
    };

    const toggleDropdown = (dropdown: 'services' | 'more') => {
        setOpenDropdown(prev => prev === dropdown ? null : dropdown);
    };

    // Check if the active section belongs to a dropdown
    const activeParentDropdown = dropdownSectionMap[activeSection] || null;

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
                    {/* Sequence: Diagnosis → Services▾ → How It Works → Reviews → More▾ → [Book Service] */}
                    <ul className="nav-links desktop-only" id="navLinksDesktop">
                        {/* 1. Diagnosis (top-level) */}
                        {preDropdownItems.map((item) => (
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

                        {/* 2. Services Dropdown (All Services, Why Choose Us, Cost Estimator) */}
                        <li
                            ref={servicesRef}
                            className="nav-dropdown-wrapper"
                            onMouseEnter={() => handleDropdownEnter('services')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button
                                className={clsx(
                                    'nav-dropdown-trigger',
                                    activeParentDropdown === 'services' && 'active-link'
                                )}
                                onClick={() => toggleDropdown('services')}
                                aria-expanded={openDropdown === 'services'}
                                aria-haspopup="true"
                            >
                                <span>{servicesDropdown.trigger.title}</span>
                                <ChevronDown className={clsx('nav-chevron', openDropdown === 'services' && 'rotated')} />
                            </button>
                            <div className={clsx('nav-dropdown-panel', openDropdown === 'services' && 'open')}>
                                {servicesDropdown.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={clsx('nav-dropdown-item', activeSection === item.id && 'active')}
                                            onClick={(e) => scrollToSection(e, item.id)}
                                        >
                                            <span className="nav-dropdown-icon"><Icon /></span>
                                            <div className="nav-dropdown-text">
                                                <span className="nav-dropdown-title">{item.title}</span>
                                                <span className="nav-dropdown-subtitle">{item.subtitle}</span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </li>

                        {/* 3. How It Works + Reviews (top-level, in page sequence) */}
                        {midNavItems.map((item) => (
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

                        {/* 4. More Dropdown (Brand Experts, FAQ, Trust, Contact) */}
                        <li
                            ref={moreRef}
                            className="nav-dropdown-wrapper"
                            onMouseEnter={() => handleDropdownEnter('more')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button
                                className={clsx(
                                    'nav-dropdown-trigger',
                                    activeParentDropdown === 'more' && 'active-link'
                                )}
                                onClick={() => toggleDropdown('more')}
                                aria-expanded={openDropdown === 'more'}
                                aria-haspopup="true"
                            >
                                <span>{moreDropdown.trigger.title}</span>
                                <ChevronDown className={clsx('nav-chevron', openDropdown === 'more' && 'rotated')} />
                            </button>
                            <div className={clsx('nav-dropdown-panel nav-dropdown-panel--wide', openDropdown === 'more' && 'open')}>
                                {moreDropdown.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className={clsx('nav-dropdown-item', activeSection === item.id && 'active')}
                                            onClick={(e) => scrollToSection(e, item.id)}
                                        >
                                            <span className="nav-dropdown-icon"><Icon /></span>
                                            <div className="nav-dropdown-text">
                                                <span className="nav-dropdown-title">{item.title}</span>
                                                <span className="nav-dropdown-subtitle">{item.subtitle}</span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </li>

                        {/* 5. Book Service CTA */}
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
                    {mobileNavItems.map((item) => {
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

                    {/* More Button */}
                    <button
                        className={clsx(
                            'mobile-nav-item mobile-nav-more-btn',
                            mobileSheetOpen && 'active'
                        )}
                        onClick={() => setMobileSheetOpen(prev => !prev)}
                        aria-label="More sections"
                    >
                        <MoreHorizontal className="mobile-nav-icon" />
                    </button>

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

            {/* --- MOBILE BOTTOM SHEET --- */}
            <div
                className={clsx('mobile-sheet-backdrop', mobileSheetOpen && 'open')}
                onClick={() => setMobileSheetOpen(false)}
            />
            <div className={clsx('mobile-more-sheet', mobileSheetOpen && 'open')}>
                <div className="mobile-sheet-handle-area" onClick={() => setMobileSheetOpen(false)}>
                    <div className="mobile-sheet-handle" />
                </div>
                <div className="mobile-sheet-header">
                    <span className="mobile-sheet-title">More Sections</span>
                    <button
                        className="mobile-sheet-close"
                        onClick={() => setMobileSheetOpen(false)}
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="mobile-sheet-items">
                    {mobileMoreItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <a
                                key={`sheet-${item.id}`}
                                href={`#${item.id}`}
                                className={clsx('mobile-sheet-item', isActive && 'active')}
                                onClick={(e) => scrollToSection(e, item.id)}
                            >
                                <span className="mobile-sheet-item-icon">
                                    <Icon className="w-5 h-5" />
                                </span>
                                <div className="mobile-sheet-item-text">
                                    <span className="mobile-sheet-item-title">{item.title}</span>
                                    <span className="mobile-sheet-item-subtitle">{item.subtitle}</span>
                                </div>
                                <ChevronDown className="mobile-sheet-item-arrow" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
