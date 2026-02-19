import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import '../legal.css';

export const metadata = {
    title: 'Privacy Policy | SmartBike Pro',
    description: 'How we handle your data with care and transparency.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#050510]">
            <div className="legal-container">
                <header className="legal-header">
                    <p>Last Updated: February 2026</p>
                    <h1>Privacy Policy</h1>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2>Data Collection</h2>
                        <p>We collect information to provide better services to all our customers. The types of personal information we collect include:</p>
                        <ul>
                            <li><strong>Contact Details:</strong> Your name, phone number, and email address provided during booking.</li>
                            <li><strong>Vehicle Information:</strong> Make, model, and registration details of your two-wheeler.</li>
                            <li><strong>Service History:</strong> Records of repairs, maintenance, and diagnostics performed.</li>
                            <li><strong>Location Data:</strong> Address details for doorstep pickup and delivery services.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>How We Use Data</h2>
                        <p>Our commitment is to use your information only for purposes related to your vehicle care:</p>
                        <ul>
                            <li>To confirm and manage your service bookings.</li>
                            <li>To send automated status updates via WhatsApp.</li>
                            <li>To generate accurate invoices and service reports.</li>
                            <li>To improve our AI-powered diagnostic engine.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Information Sharing</h2>
                        <p>Your data is private. We do not sell, trade, or rent your personal identification information to third parties. We may share information with certified service partners only as necessary to perform repairs you have authorized.</p>
                    </section>

                    <section className="legal-section">
                        <h2>Data Security</h2>
                        <p>We implement robust security measures to protect against unauthorized access, alteration, or disclosure of your personal information stored on our secure cloud-based systems.</p>
                    </section>

                    <footer className="legal-footer">
                        <Link href="/" className="btn-back">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </footer>
                </div>
            </div>
        </main>
    );
}
