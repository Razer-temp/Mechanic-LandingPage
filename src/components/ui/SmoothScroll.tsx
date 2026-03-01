'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Global Lenis instance for other components (e.g. Navbar) to use
let globalLenis: Lenis | null = null;
export function getLenis(): Lenis | null {
    return globalLenis;
}

export function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Skip Lenis on mobile — native momentum scroll is smoother & more performant
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        if (isTouchDevice) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            infinite: false,
        });

        lenisRef.current = lenis;
        globalLenis = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Handle anchor-link clicks globally so Lenis drives all scrolls
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
            if (!anchor) return;

            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;

            const el = document.querySelector(hash);
            if (el) {
                e.preventDefault();
                lenis.scrollTo(el as HTMLElement, {
                    offset: -80, // Account for fixed navbar
                    duration: 1.2,
                });
            }
        };

        document.addEventListener('click', handleAnchorClick, { passive: false });

        return () => {
            document.removeEventListener('click', handleAnchorClick);
            lenis.destroy();
            globalLenis = null;
        };
    }, []);

    return null;
}
