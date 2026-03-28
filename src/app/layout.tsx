import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'SmartBike Pro | AI-Powered Bike Service & Repair Center',
  description: 'SmartBike Pro offers AI-powered two-wheeler service, bike repair, and instant diagnosis for Honda, Hero, Royal Enfield, KTM & more. Book online. Fast. Transparent.',
  keywords: 'bike repair near me, two wheeler service center, bike mechanic near me, Honda bike service, Royal Enfield service center, AI bike diagnosis, motorcycle repair shop, scooter service near me, bike engine repair, bike servicing online booking, two wheeler mechanic near me, emergency bike repair, doorstep bike service, bike oil change near me',
  authors: [{ name: 'SmartBike Pro' }],
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://smartbikepro.vercel.app/',
  },
  openGraph: {
    type: 'website',
    title: 'SmartBike Pro — AI Bike Service',
    description: 'AI-powered two-wheeler diagnostics & repair. Book your service online. Expert mechanics. Transparent pricing.',
    url: 'https://smartbikepro.vercel.app/',
    siteName: 'SmartBike Pro',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartBike Pro — AI Bike Service',
    description: 'AI-powered bike repair & diagnostics. Book online. Expert mechanics. Transparent pricing.',
  },
  other: {
    'geo.region': 'IN',
    'geo.placename': 'India',
    'language': 'English',
    'revisit-after': '7 days',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { CustomCursor } from '@/components/ui/CustomCursor';
import Script from 'next/script';

// JSON-LD Structured Data
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "name": "SmartBike Pro",
  "description": "AI-powered two-wheeler service and repair center. Expert mechanics, instant AI diagnosis, transparent pricing.",
  "url": "https://smartbikepro.vercel.app/",
  "telephone": "+919811530780",
  "priceRange": "₹299 - ₹15,000",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, UPI, Credit Card, Debit Card",
  "openingHours": "Mo-Su 08:00-20:00",
  "areaServed": ["India", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "D-1C, Shah Alam Bandh Marg, near Sai Baba Mandir, Block D, Adarsh Nagar Extension",
    "addressLocality": "Delhi",
    "addressRegion": "Delhi",
    "postalCode": "110033",
    "addressCountry": "IN"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Two-Wheeler Services",
    "itemListElement": [
      { "@type": "Offer", "name": "Engine Repair", "price": "1500", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Full Servicing", "price": "799", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Brake Fix", "price": "500", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Oil Change", "price": "350", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Emergency Repair", "price": "299", "priceCurrency": "INR" },
      { "@type": "Offer", "name": "Electrical Work", "price": "400", "priceCurrency": "INR" }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": []
};

const serviceSchemas = [
  { name: "Engine Repair Service", desc: "Complete engine overhaul, timing chain, piston repair, and head gasket replacement for all two-wheeler brands.", price: "1500" },
  { name: "Full Bike Servicing Package", desc: "Oil change, filter replacement, chain adjustment, spark plug — complete two-wheeler care package.", price: "799" },
  { name: "Brake Repair & Replacement", desc: "Disc & drum brake pads, brake fluid change, ABS diagnostics, and caliper servicing for bikes and scooters.", price: "500" },
  { name: "Engine Oil Change Service", desc: "Premium synthetic & semi-synthetic engine oil with filter replacement for all motorcycle models.", price: "350" },
  { name: "Emergency Bike Repair & Roadside Assistance", desc: "24/7 roadside assistance, flat tire repair, towing service, and emergency breakdown support for two-wheelers.", price: "299" },
  { name: "Electrical Diagnostics & Repair", desc: "Wiring repair, headlight upgrade, battery replacement, ECU diagnostics for bikes and scooters.", price: "400" }
].map(s => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": s.name,
  "description": s.desc,
  "provider": {
    "@type": "AutoRepair",
    "name": "SmartBike Pro",
    "url": "https://smartbikepro.vercel.app/"
  },
  "areaServed": { "@type": "Country", "name": "India" },
  "offers": {
    "@type": "Offer",
    "price": s.price,
    "priceCurrency": "INR"
  }
}));

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI bike diagnosis work?",
      "acceptedAnswer": { "@type": "Answer", "text": "SmartBike Pro's AI analyzes 1000+ bike symptoms from your description to diagnose issues, estimate repair costs, and recommend urgency level — all before your visit." }
    },
    {
      "@type": "Question",
      "name": "What two-wheeler brands do you service?",
      "acceptedAnswer": { "@type": "Answer", "text": "We service all major brands including Honda, Hero, Royal Enfield, TVS, Bajaj, Suzuki, KTM, Kawasaki, Yamaha, Jawa, and Harley-Davidson." }
    },
    {
      "@type": "Question",
      "name": "How much does a bike service cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Services start from ₹299 for emergency repair, ₹350 for oil change, ₹500 for brake fix, ₹799 for full servicing, and ₹1,500 for engine repair. Use our AI cost estimator for exact pricing." }
    },
    {
      "@type": "Question",
      "name": "Do you offer pickup and drop for bike service?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer free pickup and drop within a 10km radius. Book online and our team will collect and return your bike." }
    },
    {
      "@type": "Question",
      "name": "How long does a bike service take?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most services are completed within 2-4 hours. Same-day service is available for standard maintenance. Emergency repairs are prioritized for fastest turnaround." }
    },
    {
      "@type": "Question",
      "name": "Is there a warranty on bike repairs?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. All repairs at SmartBike Pro come with a 6-month warranty. We use only genuine parts from certified suppliers." }
    },
    {
      "@type": "Question",
      "name": "Can I book bike service online?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Use our online booking form to schedule your service, select your bike model, describe the issue, and choose your preferred slot." }
    },
    {
      "@type": "Question",
      "name": "What is the contact number for SmartBike Pro?",
      "acceptedAnswer": { "@type": "Answer", "text": "You can call us at +91-9811530780. We're available 7 days a week." }
    },
    {
      "@type": "Question",
      "name": "Do you repair electric scooters?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We service all electric two-wheelers including Ather, Ola, TVS iQube, Bajaj Chetak, and Hero Vida." }
    },
    {
      "@type": "Question",
      "name": "How does the AI cost estimator work?",
      "acceptedAnswer": { "@type": "Answer", "text": "Select your bike type and service type, and our AI instantly generates a price estimate range based on real repair data, with no obligation to proceed." }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartbikepro.vercel.app/" }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SmartBike Pro",
  "url": "https://smartbikepro.vercel.app/",
  "description": "AI-powered two-wheeler service and repair center"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <Script
          id="schema-localbusiness"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {serviceSchemas.map((schema, i) => (
          <Script
            key={`service-schema-${i}`}
            id={`schema-service-${i}`}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Script
          id="schema-faq"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Script
          id="schema-breadcrumb"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-accent/20 selection:text-white md:cursor-none">
        <CustomCursor />
        <SmoothScroll />
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
