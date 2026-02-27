import React from 'react';

type IconProps = { className?: string; style?: React.CSSProperties };

/* Engine Repair — Clean piston with cylinder block */
export const KineticPiston = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Cylinder walls */}
        <path d="M7 4v16M17 4v16" opacity="0.3" />
        <line x1="7" y1="4" x2="17" y2="4" opacity="0.3" />
        {/* Piston head — animates up/down */}
        <g className="kinetic-piston-assembly">
            <rect x="8" y="9" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
            {/* Connecting rod */}
            <line x1="12" y1="13" x2="12" y2="20" />
            {/* Crankshaft circle */}
            <circle cx="12" cy="20" r="1.5" fill="currentColor" fillOpacity="0.2" />
        </g>
    </svg>
);

/* Full Servicing — Two meshing gears */
export const KineticGears = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Large gear */}
        <g className="kinetic-gear-large" style={{ transformOrigin: '10px 10px' }}>
            <circle cx="10" cy="10" r="4" fill="currentColor" fillOpacity="0.08" />
            <circle cx="10" cy="10" r="1.5" />
            {/* Gear teeth */}
            <line x1="10" y1="3" x2="10" y2="5" />
            <line x1="10" y1="15" x2="10" y2="17" />
            <line x1="3" y1="10" x2="5" y2="10" />
            <line x1="15" y1="10" x2="17" y2="10" />
            <line x1="5.1" y1="5.1" x2="6.5" y2="6.5" />
            <line x1="13.5" y1="13.5" x2="14.9" y2="14.9" />
            <line x1="5.1" y1="14.9" x2="6.5" y2="13.5" />
            <line x1="13.5" y1="6.5" x2="14.9" y2="5.1" />
        </g>
        {/* Small gear */}
        <g className="kinetic-gear-small" style={{ transformOrigin: '18px 18px' }}>
            <circle cx="18" cy="18" r="2.5" fill="currentColor" fillOpacity="0.08" />
            <circle cx="18" cy="18" r="1" />
            <line x1="18" y1="14" x2="18" y2="15" />
            <line x1="18" y1="21" x2="18" y2="22" />
            <line x1="14" y1="18" x2="15" y2="18" />
            <line x1="21" y1="18" x2="22" y2="18" />
        </g>
    </svg>
);

/* Brake Fix — Disc rotor with brake pad */
export const KineticDisc = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Rotor disc */}
        <g className="kinetic-brake-disc" style={{ transformOrigin: '12px 12px' }}>
            <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.05" />
            <circle cx="12" cy="12" r="6" opacity="0.4" />
            <circle cx="12" cy="12" r="2" />
            {/* Ventilation holes */}
            <circle cx="12" cy="7" r="0.6" fill="currentColor" />
            <circle cx="12" cy="17" r="0.6" fill="currentColor" />
            <circle cx="7" cy="12" r="0.6" fill="currentColor" />
            <circle cx="17" cy="12" r="0.6" fill="currentColor" />
            <circle cx="8.5" cy="8.5" r="0.6" fill="currentColor" />
            <circle cx="15.5" cy="15.5" r="0.6" fill="currentColor" />
        </g>
    </svg>
);

/* Oil Change — Clean oil drop with drip */
export const KineticDroplet = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Main droplet shape */}
        <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12z" fill="currentColor" fillOpacity="0.08" />
        {/* Oil level rising inside — animates */}
        <path className="kinetic-oil-pool" d="M7.5 16c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4" fill="currentColor" fillOpacity="0.2" style={{ transformOrigin: '12px 20px' }} />
        {/* Drip from top */}
        <line className="kinetic-oil-drip" x1="12" y1="2" x2="12" y2="5" strokeWidth="2" />
    </svg>
);

/* Emergency Repair — Warning triangle with beacon flashes */
export const KineticWarning = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Triangle body */}
        <path d="M10.3 3.5L1.7 18.5a2 2 0 0 0 1.7 3h17.2a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0z" fill="currentColor" fillOpacity="0.06" />
        {/* Exclamation */}
        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        {/* Beacon flashes — animate on hover */}
        <path className="kinetic-beacon-flash-1" d="M4 4l-2-1" opacity="0" strokeWidth="2" />
        <path className="kinetic-beacon-flash-2" d="M20 4l2-1" opacity="0" strokeWidth="2" />
        <path className="kinetic-beacon-flash-3" d="M2 10l-2 0" opacity="0" strokeWidth="2" />
        <path className="kinetic-beacon-flash-4" d="M22 10l2 0" opacity="0" strokeWidth="2" />
    </svg>
);

/* Electrical Work — Battery with lightning bolt */
export const KineticLightning = ({ className, style }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        {/* Battery body */}
        <rect x="5" y="7" width="14" height="14" rx="2" fill="currentColor" fillOpacity="0.05" />
        {/* Battery terminals */}
        <line x1="9" y1="5" x2="9" y2="7" strokeWidth="2" />
        <line x1="15" y1="5" x2="15" y2="7" strokeWidth="2" />
        {/* Lightning bolt — animates */}
        <path className="kinetic-bolt" d="M13 9l-3 5h4l-2 5" strokeWidth="2" fill="none" style={{ transformOrigin: '12px 14px' }} />
    </svg>
);
