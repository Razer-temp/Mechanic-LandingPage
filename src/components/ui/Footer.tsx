'use client';

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link href="/" className="nav-logo">
                            <span className="logo-icon">
                                <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="logo-text">Smart<span className="accent">Bike</span> Pro</span>
                        </Link>
                        <p>AI-powered two-wheeler service center trusted by 15,000+ riders. Fast diagnostics, expert repairs, transparent pricing.</p>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook" className="social-link">FB</a>
                            <a href="#" aria-label="Instagram" className="social-link">IG</a>
                            <a href="#" aria-label="YouTube" className="social-link">YT</a>
                            <a href="#" aria-label="Twitter" className="social-link">X</a>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#diagnosis">AI Diagnosis</a></li>
                            <li><a href="#booking">Book Service</a></li>
                            <li><a href="#estimator">Cost Estimator</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Engine Repair</a></li>
                            <li><a href="#">Full Servicing</a></li>
                            <li><a href="#">Brake Fix</a></li>
                            <li><a href="#">Oil Change</a></li>
                            <li><a href="#">Emergency Repair</a></li>
                        </ul>
                    </div>
                    <div className="footer-hours">
                        <h4>Workshop Hours</h4>
                        <ul>
                            <li><span>Mon – Fri</span> <span>9 AM – 7 PM</span></li>
                            <li><span>Saturday</span> <span>9 AM – 7 PM</span></li>
                            <li><span>Sunday</span> <span>10 AM – 4 PM</span></li>
                        </ul>
                        <div className="trust-badges">
                            <span className="badge">✅ Verified Business</span>
                            <span className="badge">🛡️ 6-Month Warranty</span>
                            <span className="badge">🏆 4.9★ Rated</span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 SmartBike Pro. All rights reserved.</p>
                    <p>Powered by AI for smarter bike care.</p>
                </div>
            </div>
        </footer>
    );
}
