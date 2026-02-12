'use client';

import React from 'react';

const brands = [
    'Honda',
    'Hero',
    'Royal Enfield',
    'TVS',
    'Bajaj',
    'Yamaha',
    'Suzuki',
    'KTM',
    'Jawa',
    'Ather'
];

export function BrandMarquee() {
    return (
        <div className="brand-marquee">
            <div className="marquee-track">
                {/* We need to duplicate the content to ensure seamless scrolling */}
                {[...brands, ...brands, ...brands].map((brand, index) => (
                    <div key={`${brand}-${index}`} className="brand-item">
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    );
}
