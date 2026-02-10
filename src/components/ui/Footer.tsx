import Link from 'next/link';
import { Wrench, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="pt-20 pb-10 bg-bg-void border-t border-white/5 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 text-text-primary font-heading font-black text-2xl tracking-tighter">
                            <Wrench className="w-8 h-8 text-accent-base" />
                            <span>Smart<span className="text-accent-base">Bike</span> Pro</span>
                        </Link>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                            AI-powered two-wheeler service center trusted by 15,000+ riders. Fast diagnostics, expert repairs, transparent pricing.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-text-muted hover:bg-accent-base hover:text-bg-void hover:border-accent-base transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-xs uppercase tracking-widest mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Services', 'AI Diagnosis', 'Book Service', 'Cost Estimator', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-muted hover:text-accent-base transition-colors font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-xs uppercase tracking-widest mb-6">Services</h4>
                        <ul className="space-y-3">
                            {['Engine Repair', 'Full Servicing', 'Brake Fix', 'Oil Change', 'Emergency Repair'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-muted hover:text-accent-base transition-colors font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-heading font-bold text-text-primary text-xs uppercase tracking-widest mb-6">Workshop Hours</h4>
                        <ul className="space-y-3 mb-8">
                            <li className="flex justify-between text-sm text-text-secondary font-medium"><span>Mon – Fri</span> <span>9 AM – 7 PM</span></li>
                            <li className="flex justify-between text-sm text-text-secondary font-medium"><span>Saturday</span> <span>9 AM – 7 PM</span></li>
                            <li className="flex justify-between text-sm text-text-secondary font-medium"><span>Sunday</span> <span className="text-accent-red font-bold">Closed</span></li>
                        </ul>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-accent-green bg-accent-green/5 px-3 py-1.5 rounded-lg border border-accent-green/10">✅ Verified business</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-accent-base bg-accent-base/5 px-3 py-1.5 rounded-lg border border-accent-base/10">🛡️ 6-Month Warranty</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-text-muted">
                    <p>&copy; 2026 SmartBike Pro. All rights reserved.</p>
                    <p className="flex items-center gap-2">Powered by <span className="text-accent-base">AI Technology</span></p>
                </div>
            </div>
        </footer>
    );
}
