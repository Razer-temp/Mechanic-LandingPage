'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);

        const handleHoverStart = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactable = target.closest('a, button, input, textarea, [role="button"]') as HTMLElement;

            if (interactable || window.getComputedStyle(target).cursor === 'pointer') {
                setIsHovering(true);
                // Capture the exact size and position of the element we are hovering over
                if (interactable) {
                    setTargetRect(interactable.getBoundingClientRect());
                } else {
                    setTargetRect(target.getBoundingClientRect());
                }
            }
        };

        const handleHoverEnd = () => {
            setIsHovering(false);
            setTargetRect(null);
        };

        window.addEventListener('mouseover', handleHoverStart);
        window.addEventListener('mouseout', handleHoverEnd);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseover', handleHoverStart);
            window.removeEventListener('mouseout', handleHoverEnd);
        };
    }, [isVisible]);

    // Don't render on mobile devices as they don't have cursors
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
        return null;
    }

    if (!isVisible) return null;

    return (
        <>
            {/* Cinematic Focus Spotlight (Concept 3) */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(0, 200, 255, 0.06) 0%, transparent 60%)',
                    mixBlendMode: 'screen'
                }}
                animate={{
                    x: mousePosition.x - 250, // Center the 500px light
                    y: mousePosition.y - 250,
                    scale: isHovering ? 0.6 : 1,   // Tightens the light beam when hovering
                    opacity: isHovering ? 1 : 0.6, // Intensifies when focused
                }}
                transition={{
                    type: "spring",
                    stiffness: 100, // Smooth, slightly lazy cinematic follow
                    damping: 25,
                    mass: 1,
                }}
            />

            {/* Morphing Highlight Backdrop (The Glass/Glow Effect) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center mix-blend-screen"
                animate={{
                    // When not hovering, it centers on the mouse position.
                    // When hovering, it moves to the center of the target element.
                    x: (isHovering && targetRect ? targetRect.x + targetRect.width / 2 : mousePosition.x) - (isHovering && targetRect ? (targetRect.width + 16) / 2 : 20),
                    y: (isHovering && targetRect ? targetRect.y + targetRect.height / 2 : mousePosition.y) - (isHovering && targetRect ? (targetRect.height + 16) / 2 : 20),
                    // Morph width and height to cover the target
                    width: isHovering && targetRect ? targetRect.width + 16 : 40, // +16px padding
                    height: isHovering && targetRect ? targetRect.height + 16 : 40,
                    // Morph shape: rounded-full default -> rounded-lg over buttons
                    borderRadius: isHovering ? '12px' : '50%',
                    opacity: isHovering ? 1 : 0.5,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150, // lower stiffness = smoother, fluid morphing
                    damping: 15,    // higher damping = less bouncy
                    mass: 0.8,
                }}
            >
                {/*
                  The actual glowing/glass box inside the animated wrapper.
                  We separate this so the wrapper can handle positioning/sizing perfectly.
                */}
                <motion.div
                    className="w-full h-full"
                    animate={{
                        backgroundColor: isHovering ? 'rgba(0, 200, 255, 0.15)' : 'rgba(0, 200, 255, 0.05)',
                        backdropFilter: isHovering ? 'blur(8px)' : 'blur(4px)',
                        boxShadow: isHovering
                            ? '0 0 30px rgba(0, 200, 255, 0.2), inset 0 0 20px rgba(0, 200, 255, 0.1)'
                            : '0 0 10px rgba(0, 200, 255, 0.1)',
                        border: isHovering ? '1px solid rgba(0, 200, 255, 0.3)' : '1px solid rgba(0, 200, 255, 0.1)',
                        borderRadius: "inherit"
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            {/* Core Pointer Dot (Disappears on hover to let the morphing highlight shine) */}
            <motion.div
                className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full pointer-events-none z-[9999]"
                style={{
                    x: mousePosition.x - 3,
                    y: mousePosition.y - 3,
                    backgroundColor: '#00c8ff',
                    boxShadow: '0 0 10px rgba(0, 200, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)',
                }}
                animate={{
                    scale: isHovering ? 0 : 1, // Shrink away smoothly
                    opacity: isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
            />
        </>
    );
}
