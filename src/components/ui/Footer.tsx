'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, Globe, Clock, ShieldCheck, Star } from 'lucide-react';

export function Footer() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Simple business hours check (9 AM - 8 PM)
    const hours = currentTime.getHours();
    const isOnline = hours >= 9 && hours < 20;

    return (
        <footer className="footer-premium">
            <div className="footer-bg-effects">
                <div className="footer-orb footer-orb--1"></div>
                <div className="footer-orb footer-orb--2"></div>
                <div className="footer-grid-overlay"></div>
            </div>

            <div className="container footer-container">
                <div className="footer-main-grid">
                    {/* Brand Section */}
                    <div className="footer-col footer-brand-premium animate-on-scroll">
                        <Link href="/" className="nav-logo">
                            <span className="logo-icon">
                                <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                        </Link>
                        <p>
                            Revolutionizing two-wheeler care with AI-powered diagnostics and precision engineering.
                            Trusted by 15,000+ riders across India.
                        </p>

                        <div className="footer-status">
                            <span className={`status-dot ${isOnline ? 'online' : ''}`}></span>
                            <span className="text-xs font-semibold tracking-wider">
                                {isOnline ? 'WORKSHOP LIVE — WE ARE OPEN' : 'WORKSHOP CLOSED — OPENS AT 9 AM'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col animate-on-scroll delay-100">
                        <h4>Explore</h4>
                        <ul className="footer-links-list">
                            <li><a href="#services" className="footer-link-item"><ArrowUpRight className="size-3" /> Services</a></li>
                            <li><a href="#diagnosis" className="footer-link-item"><ArrowUpRight className="size-3" /> AI Diagnosis</a></li>
                            <li><a href="#estimator" className="footer-link-item"><ArrowUpRight className="size-3" /> Cost Estimator</a></li>
                            <li><a href="#reviews" className="footer-link-item"><ArrowUpRight className="size-3" /> Testimonials</a></li>
                            <li><Link href="/login" className="footer-link-item"><ArrowUpRight className="size-3" /> Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col animate-on-scroll delay-200">
                        <h4>Solutions</h4>
                        <ul className="footer-links-list">
                            <li><a href="#services" className="footer-link-item">Engine Diagnostics</a></li>
                            <li><a href="#services" className="footer-link-item">Full Performance Tuning</a></li>
                            <li><a href="#services" className="footer-link-item">Electronic Repairs</a></li>
                            <li><a href="#services" className="footer-link-item">Brake System Overhaul</a></li>
                            <li><a href="#services" className="footer-link-item">Doorstep Pickup</a></li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="footer-col animate-on-scroll delay-300">
                        <h4>Stay Updated</h4>
                        <div className="footer-newsletter">
                            <p className="text-xs text-[#55556a] mb-4">Subscribe to get maintenance tips and exclusive offers.</p>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Email address" />
                                <button className="btn-send magnetic-btn">Join</button>
                            </div>
                        </div>

                        <div className="footer-trust-badges mt-8 flex gap-4">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                <ShieldCheck className="size-3 text-emerald-400" /> AUTHENTIC
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                <Star className="size-3 text-amber-400" /> 4.9 RATED
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom-premium">
                    <div className="copyright-text">
                        &copy; 2026 SmartBike Pro. Engineered for excellence.
                    </div>

                    <div className="footer-socials">
                        <a href="#" className="social-link magnetic-btn"><Instagram className="size-4" /></a>
                        <a href="#" className="social-link magnetic-btn"><Twitter className="size-4" /></a>
                        <a href="#" className="social-link magnetic-btn"><Facebook className="size-4" /></a>
                        <a href="#" className="social-link magnetic-btn"><Mail className="size-4" /></a>
                    </div>

                    <div className="flex gap-6 text-[11px] font-medium text-white/30">
                        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                        <div className="flex items-center gap-1"><Globe className="size-3" /> India (EN)</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
