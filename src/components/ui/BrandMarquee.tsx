'use client';

import React from 'react';

const brands = [
    { name: 'Honda', src: '/logos/Honda_Logo.svg.png', color: '#CC0000' },
    { name: 'Hero', src: '/logos/hero.png', color: '#E6233ba' },
    { name: 'Royal Enfield', src: '/logos/RE.png', color: '#ffD700' },
    { name: 'TVS', src: '/logos/TVS-Motor-Company-640x240.png', color: '#183e9d' },
    { name: 'Bajaj', src: '/logos/Bajaj-Logo-640x360.png', color: '#005a96' },
    { name: 'Suzuki', src: '/logos/Suzuki_logo_2025_(vertical).svg.png', color: '#E31A35' },
    { name: 'KTM', src: '/logos/KTM-logo-768x432.png', color: '#FF6600' },
    { name: 'Jawa', src: '/logos/java.png', color: '#C01007' },
    { name: 'Kawasaki', src: '/logos/Kawasaki-Logo-640x360.png', color: '#66cc33' },
    { name: 'Harley-Davidson', src: '/logos/Harley-Davidson-Logo-640x400.png', color: '#ff9900' }
];

export function BrandMarquee() {
    return (
        <div className="brand-marquee">
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
                            alt={`${brand.name} Logo`}
                            className="brand-logo-img"
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
