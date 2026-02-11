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
                                    <path d="M12 1L8.5 3H4.5V7L2.5 10.5V13.5L4.5 17V21H8.5L12 23L15.5 21H19.5V17L21.5 13.5V10.5L19.5 7V3H15.5L12 1ZM12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12C15.5 13.933 13.933 15.5 12 15.5Z" fill="currentColor" />
                                    <path d="M12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5Z" fill="currentColor" />
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
