'use client';

import React from 'react';

const brands = [
    { name: 'Honda', src: '/logos/Honda_Logo.svg.png', color: '#CC0000', alt: 'Honda two-wheeler bike service and repair', width: 120, height: 67 },
    { name: 'Hero', src: '/logos/hero.png', color: '#E6233ba', alt: 'Hero motorcycle service center', width: 120, height: 67 },
    { name: 'Royal Enfield', src: '/logos/RE.png', color: '#ffD700', alt: 'Royal Enfield bike servicing and repair', width: 120, height: 67 },
    { name: 'TVS', src: '/logos/TVS-Motor-Company-640x240.png', color: '#183e9d', alt: 'TVS scooter and bike service', width: 120, height: 45 },
    { name: 'Bajaj', src: '/logos/Bajaj-Logo-640x360.png', color: '#005a96', alt: 'Bajaj motorcycle repair and service', width: 120, height: 67 },
    { name: 'Suzuki', src: '/logos/Suzuki_logo_2025_(vertical).svg.png', color: '#E31A35', alt: 'Suzuki bike repair center', width: 120, height: 67 },
    { name: 'KTM', src: '/logos/KTM-logo-768x432.png', color: '#FF6600', alt: 'KTM sports bike service and repair', width: 120, height: 67 },
    { name: 'Jawa', src: '/logos/java.png', color: '#C01007', alt: 'Jawa bike servicing', width: 120, height: 67 },
    { name: 'Kawasaki', src: '/logos/Kawasaki-Logo-640x360.png', color: '#66cc33', alt: 'Kawasaki motorcycle service center', width: 120, height: 67 },
    { name: 'Harley-Davidson', src: '/logos/Harley-Davidson-Logo-640x400.png', color: '#ff9900', alt: 'Harley-Davidson motorcycle repair India', width: 120, height: 75 }
];

export function BrandMarquee() {
    return (
        <div className="brand-marquee" role="region" aria-label="Trusted two-wheeler brands we service">
            <div className="marquee-track">
                {/* Quadruple list for seamless scrolling with -25% animation */}
                {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
                    <div
                        key={`${brand.name}-${index}`}
                        className="brand-item"
                        style={{ '--hover-color': brand.color } as React.CSSProperties}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={brand.src}
                            alt={brand.alt}
                            className="brand-logo-img"
                            width={brand.width}
                            height={brand.height}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('text-fallback');
                                if (e.currentTarget.nextElementSibling) {
                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                                }
                            }}
                        />
                        <span className="brand-text-fallback" style={{ display: 'none' }}>{brand.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
