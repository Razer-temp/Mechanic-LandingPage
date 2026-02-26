'use client';

import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Use more stars on desktop, fewer on mobile for performance
        const isMobile = window.innerWidth <= 768;
        const count = isMobile ? 50 : 120;

        // We only create elements once
        if (container.children.length > 0) return;

        const stars: { el: HTMLDivElement; initialY: number; speed: number; }[] = [];

        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'warp-star';

            const x = Math.random() * 100;
            const y = Math.random() * 120; // initial offset

            // 30% chance to be completely static (distant stars)
            const isStatic = Math.random() < 0.3;
            // Closer stars move faster (speed up to 0.8)
            const z = isStatic ? 0 : 0.2 + Math.random() * 0.6;
            // Closer stars are bigger
            const size = isStatic ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1;

            s.style.left = `${x}%`;
            s.style.top = `0px`; // Base is 0, we translate it
            s.style.width = `${size}px`;
            s.style.height = `${size}px`;

            // Twinkle animation timing
            s.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
            s.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(s);

            // Store relative initial position based on window height
            stars.push({
                el: s,
                initialY: Math.random() * window.innerHeight,
                speed: z
            });
        }

        let lastScrollY = window.scrollY;
        let currentVelocity = 0;
        let animationFrameId: number;

        const render = () => {
            const scrollY = window.scrollY;
            const targetVelocity = scrollY - lastScrollY;
            lastScrollY = scrollY;

            // Lerp for smooth velocity transition (prevents jerky stretching on mobile)
            currentVelocity += (targetVelocity - currentVelocity) * 0.1;

            // Stretch factor: max 4x height based on scroll speed
            const stretch = Math.max(1, Math.min(1 + Math.abs(currentVelocity) * 0.15, 6));

            // Add a slight extra stretch if it's moving fast
            const height = window.innerHeight;

            stars.forEach(star => {
                if (star.speed === 0) {
                    // Static stars just twinkle, no parallax
                    star.el.style.transform = `translate3d(0, ${star.initialY}px, 0) scaleY(1)`;
                    return;
                }

                // Calculate infinite scroll position
                // We move stars UP relative to scroll (subtracting)
                let pos = (star.initialY - (scrollY * star.speed * 0.5)) % height;
                // Wrap around
                if (pos < -20) pos += height + 40;

                // Use translate3d for hardware acceleration (GPU)
                star.el.style.transform = `translate3d(0, ${pos}px, 0) scaleY(${stretch})`;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Handle resize
        const handleResize = () => {
            const newHeight = window.innerHeight;
            stars.forEach(star => {
                // Redistribute initial Y on resize to prevent clustering
                if (star.initialY > newHeight) {
                    star.initialY = Math.random() * newHeight;
                }
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="animated-bg-container">
            {/* The base gradient is defined in globals.css now, but we can add ambient glow layers here */}
            <div
                ref={containerRef}
                className="warp-star-layer"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 0,
                    overflow: 'hidden'
                }}
            />
        </div>
    );
}
