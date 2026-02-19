import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import '../legal.css';

export const metadata = {
    title: 'Terms of Service | SmartBike Pro',
    description: 'Understanding the terms of our service agreement.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#050510]">
            <div className="legal-container">
                <header className="legal-header">
                    <p>Standard Operating Procedure</p>
                    <h1>Terms of Service</h1>
                </header>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2>Service Agreement</h2>
                        <p>By booking a service with SmartBike Pro, you agree to the following terms:</p>
                        <ul>
                            <li>All services are performed by certified mechanics using genuine or high-quality parts as selected.</li>
                            <li>Initial estimates provided via the AI diagnostic tool are subject to physical inspection.</li>
                            <li>Additional repairs discovered during service will be communicated and require your approval.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Bookings & Cancellations</h2>
                        <p>We value your time and our mechanics' schedules:</p>
                        <ul>
                            <li>Rescheduling is permitted up to 2 hours before the appointment time.</li>
                            <li>Cancellations should be made as early as possible via the booking link.</li>
                            <li>Pick-up timings are approximate and may be delayed due to traffic or weather.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Warranty & Liability</h2>
                        <p>We stand behind our work:</p>
                        <ul>
                            <li>All general services carry a 7-day labor warranty.</li>
                            <li>Spare parts warranties are provided as per the manufacturer's terms.</li>
                            <li>SmartBike Pro is not liable for existing internal engine damages not related to the service performed.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Payments</h2>
                        <p>Full payment is due upon delivery of the serviced vehicle. We accept UPI, Cash, and all major Digital Wallets. Detailed digital invoices will be provided for all transactions.</p>
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
