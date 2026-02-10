import Link from 'next/link';
import { Wrench, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="pt-16 pb-6 bg-bg-dark border-t border-border-subtle">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-text-primary font-heading font-extrabold text-xl tracking-tight">
                            <Wrench className="w-6 h-6 text-accent-base" />
                            <span>Smart<span className="text-accent-base">Bike</span> Pro</span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            AI-powered two-wheeler service center trusted by 15,000+ riders. Fast diagnostics, expert repairs, transparent pricing.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-border-subtle text-text-muted hover:bg-accent-base hover:text-white hover:border-accent-base hover:-translate-y-1 transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-sm tracking-wide mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Services', 'AI Diagnosis', 'Book Service', 'Cost Estimator', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-muted hover:text-accent-base transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-sm tracking-wide mb-4">Services</h4>
                        <ul className="space-y-2">
                            {['Engine Repair', 'Full Servicing', 'Brake Fix', 'Oil Change', 'Emergency Repair'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-muted hover:text-accent-base transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-sm tracking-wide mb-4">Workshop Hours</h4>
                        <ul className="space-y-2 mb-6">
                            <li className="flex justify-between text-sm text-text-secondary"><span>Mon – Fri</span> <span>9 AM – 7 PM</span></li>
                            <li className="flex justify-between text-sm text-text-secondary"><span>Saturday</span> <span>9 AM – 7 PM</span></li>
                            <li className="flex justify-between text-sm text-text-secondary"><span>Sunday</span> <span>10 AM – 4 PM</span></li>
                        </ul>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-accent-green bg-accent-green/10 px-3 py-1 rounded-full w-fit border border-accent-green/20">✅ Verified Business</span>
                            <span className="text-xs font-semibold text-accent-green bg-accent-green/10 px-3 py-1 rounded-full w-fit border border-accent-green/20">🛡️ 6-Month Warranty</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
                    <p>&copy; 2026 SmartBike Pro. All rights reserved.</p>
                    <p>Powered by AI for smarter bike care.</p>
                </div>
            </div>
        </footer>
    );
}
