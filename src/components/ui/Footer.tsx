'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, Globe, Clock, ShieldCheck, Star, MessageSquare } from 'lucide-react';

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
                        <Link href="/" className="nav-logo footer-logo-wrap">
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

                        <div className={`footer-status-compact transition-all duration-500 ${isOnline ? 'online' : 'offline'}`}>
                            <div className="status-indicator">
                                <span className="status-dot"></span>
                                <span className="status-pulse"></span>
                            </div>
                            <span className="status-text">
                                {isOnline ? 'Workshop Open' : 'Workshop Closed'}
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
                        <a href="#" className="social-link instagram magnetic-btn" aria-label="Instagram">
                            <Instagram className="size-4" />
                        </a>
                        <a href="https://wa.me/919811530780" target="_blank" rel="noopener noreferrer" className="social-link whatsapp magnetic-btn" aria-label="WhatsApp">
                            <MessageSquare className="size-4" />
                        </a>
                        <a href="https://x.com" className="social-link x-twitter magnetic-btn" aria-label="X (Twitter)">
                            <svg className="size-3.5" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M714.163 519.284L1160.89 0H1055.03L664.877 453.553L355.139 0H0L468.492 681.821L0 1226.37H105.866L517.749 747.453L844.861 1226.37H1200L714.137 519.284H714.163ZM571.491 685.043L524.004 617.078L144.113 73.197H306.721L613.061 511.905L660.548 579.87L1055.08 1144.82H892.476L571.491 685.07V685.043Z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="#" className="social-link facebook magnetic-btn" aria-label="Facebook">
                            <Facebook className="size-4" />
                        </a>
                        <a href="#" className="social-link email magnetic-btn" aria-label="Email">
                            <Mail className="size-4" />
                        </a>
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
