'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight, Globe, Clock, ShieldCheck, Star, MessageSquare, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function Footer() {
    const supabase = createClient();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showHours, setShowHours] = useState(false);
    const [businessInfo, setBusinessInfo] = useState({
        working_hours: '9:00 AM - 8:00 PM',
        working_days: 'Monday - Sunday',
        schedule: null as any
    });

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [discountCode, setDiscountCode] = useState('BIKEPRO10');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        fetchBusinessInfo();
        return () => clearInterval(timer);
    }, []);

    const fetchBusinessInfo = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('value')
                .eq('key', 'business_info')
                .single();

            if (data?.value) {
                setBusinessInfo(data.value as any);
            }
        } catch (err) {
            console.error('Error fetching workshop hours:', err);
        }
    };

    // Helper to parse "09:00" or "9:00 AM" into minutes from midnight
    const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;

        // Handle 24h format "09:00"
        if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + (minutes || 0);
        }

        // Handle 12h format "9:00 AM"
        const [time, modifier] = timeStr.trim().split(' ');
        let [hours, minutes] = (time || "").split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
    };

    // Check if workshop is online
    const getStatus = () => {
        const now = currentTime;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const day = now.getDay(); // 0 = Sunday

        const [startStr, endStr] = businessInfo.working_hours.split(' - ');

        let isOpenToday = true;
        let startMinutes = parseTime(startStr);
        let endMinutes = parseTime(endStr);

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayName = days[day];

        // Use structured schedule if available
        if (businessInfo.schedule && businessInfo.schedule[currentDayName]) {
            const daySched = businessInfo.schedule[currentDayName];
            isOpenToday = daySched.isOpen;
            startMinutes = parseTime(daySched.open);
            endMinutes = parseTime(daySched.close);
        } else {
            // Fallback to legacy string parsing
            const workingDaysRange = businessInfo.working_days.split(' - ');
            if (workingDaysRange.length === 2) {
                const startDayIdx = days.indexOf(workingDaysRange[0]);
                const endDayIdx = days.indexOf(workingDaysRange[1]);
                if (startDayIdx <= endDayIdx) {
                    isOpenToday = day >= startDayIdx && day <= endDayIdx;
                } else {
                    isOpenToday = day >= startDayIdx || day <= endDayIdx;
                }
            }
        }

        const isOnline = isOpenToday && currentMinutes >= startMinutes && currentMinutes < endMinutes;

        // Calculate Last Order (30 mins before closing)
        const lastOrderMinutes = endMinutes - 30;
        const lastOrderHours = Math.floor(lastOrderMinutes / 60);
        const lastOrderMins = lastOrderMinutes % 60;
        const lastOrderAmPm = lastOrderHours >= 12 ? 'PM' : 'AM';
        const lastOrderDisplay = `${lastOrderHours % 12 || 12}:${lastOrderMins.toString().padStart(2, '0')} ${lastOrderAmPm}`;

        return { isOnline, lastOrderDisplay, isOpenToday };
    };

    const { isOnline, lastOrderDisplay, isOpenToday } = getStatus();

    const daysOrdered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = daysOrdered.map(day => {
        if (businessInfo.schedule && businessInfo.schedule[day]) {
            const s = businessInfo.schedule[day];
            if (!s.isOpen) return { day, hours: 'Closed' };

            // Format 24h to 12h for display
            const formatTime = (t: string) => {
                const [h, m] = t.split(':').map(Number);
                const ampm = h >= 12 ? 'PM' : 'AM';
                return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
            };
            return { day, hours: `${formatTime(s.open)} - ${formatTime(s.close)}` };
        }

        // Legacy fallback
        return {
            day,
            hours: day === 'Sunday' && !businessInfo.working_days.includes('Sunday') ? 'Closed' : businessInfo.working_hours
        };
    });

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('subscribers')
                .insert([
                    {
                        email,
                        phone,
                        status: 'active',
                        assigned_coupon: discountCode
                    }
                ]);

            if (error) {
                if (error.code === '23505') {
                    alert('This email is already subscribed!');
                } else {
                    throw error;
                }
            } else {
                setShowSuccessModal(true);
                setEmail('');
                setPhone('');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

                        <div
                            className={`footer-status-compact transition-all duration-500 ${isOnline ? 'online' : 'offline'}`}
                            onMouseEnter={() => setShowHours(true)}
                            onMouseLeave={() => setShowHours(false)}
                            onClick={() => setShowHours(!showHours)}
                        >
                            <div className="status-indicator">
                                <span className="status-dot"></span>
                                <span className="status-pulse"></span>
                            </div>
                            <span className="status-text">
                                {isOnline ? 'Workshop Open' : 'Workshop Closed'}
                            </span>
                            <ChevronDown className={`size-3 transition-transform ${showHours ? 'rotate-180' : ''}`} />

                            {/* Business Hours Popover */}
                            <div className={`business-hours-popover ${showHours ? 'show' : ''}`}>
                                <div className="hours-header">Weekly Schedule</div>
                                <div className="hours-list">
                                    {schedule.map((item, idx) => {
                                        const dayNum = currentTime.getDay();
                                        const normalizedDay = (dayNum + 6) % 7;
                                        return (
                                            <div key={idx} className={`hours-row ${normalizedDay === idx ? 'current' : ''}`}>
                                                <span className="day">{item.day}</span>
                                                <span className="time">{item.hours}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="hours-footer">Last Order: {lastOrderDisplay}</div>
                            </div>
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
                            <form className="newsletter-form-premium" onSubmit={handleSubscribe}>
                                <div className="form-inputs-group">
                                    <div className="input-wrap">
                                        <Mail className="size-3.5 icon" />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-wrap">
                                        <div className="phone-prefix">+91</div>
                                        <input
                                            type="tel"
                                            placeholder="Phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            pattern="[0-9]{10}"
                                            title="10-digit phone number"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className={`btn-send-premium magnetic-btn ${isSubmitting ? 'loading' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Joining...' : 'Get Updates'}
                                </button>
                            </form>
                        </div>

                        <div className="footer-trust-badges mt-8 flex gap-4">
                            <div className="trust-badge authentic">
                                <ShieldCheck className="size-3 icon" />
                                <span>AUTHENTIC</span>
                            </div>
                            <div className="trust-badge rated">
                                <Star className="size-3 icon" />
                                <span>4.9 RATED</span>
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
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="https://wa.me/919811530780" target="_blank" rel="noopener noreferrer" className="social-link whatsapp magnetic-btn" aria-label="WhatsApp">
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="https://x.com" className="social-link x-twitter magnetic-btn" aria-label="X (Twitter)">
                            <svg className="size-4.5" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M714.163 519.284L1160.89 0H1055.03L664.877 453.553L355.139 0H0L468.492 681.821L0 1226.37H105.866L517.749 747.453L844.861 1226.37H1200L714.137 519.284H714.163ZM571.491 685.043L524.004 617.078L144.113 73.197H306.721L613.061 511.905L660.548 579.87L1055.08 1144.82H892.476L571.491 685.07V685.043Z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="#" className="social-link facebook magnetic-btn" aria-label="Facebook">
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="#" className="social-link email magnetic-btn" aria-label="Email">
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor" />
                            </svg>
                        </a>
                    </div>

                    <div className="flex gap-6 text-[11px] font-medium text-white/30">
                        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
                        <div className="flex items-center gap-1"><Globe className="size-3" /> India (EN)</div>
                    </div>
                </div>
            </div>

            {/* Subscription Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <button className="close-btn" onClick={() => setShowSuccessModal(false)}>
                            <X className="size-5" />
                        </button>

                        <div className="success-icon-wrap">
                            <CheckCircle2 className="size-12 icon" />
                        </div>

                        <h3>Welcome to the Club!</h3>
                        <p>You're now subscribed to Smart<span className="accent">Bike</span> Pro. As a token of appreciation, here is your welcome gift:</p>

                        <div className="coupon-card">
                            <div className="coupon-label">10% DISCOUNT CODE</div>
                            <div className="coupon-code">{discountCode}</div>
                            <div className="coupon-desc">Valid on your first service appointment</div>
                        </div>

                        <div className="modal-actions">
                            <a
                                href="https://wa.me/919811530780"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whatsapp-join-btn"
                            >
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Join WhatsApp Community
                            </a>
                            <button className="done-btn" onClick={() => setShowSuccessModal(false)}>Awesome!</button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
