'use client';

import React from 'react';

/**
 * Admin Layout
 * Provides a contained environment for admin pages to prevent style leakage
 * and manage admin-specific global states or styles.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen bg-[#050508] text-[#eeeef2] font-sans selection:bg-[#00c8ff33] selection:text-white">
      {children}

      {/* Admin Specific Global Styles */}
      <style jsx global>{`
        /* Reset any conflicting landing page styles if necessary */
        .admin-root {
          --admin-accent: #00c8ff;
          --admin-accent-glow: rgba(0, 200, 255, 0.15);
          --admin-bg-surface: #0c0c16;
          --admin-border: rgba(255, 255, 255, 0.05);
          --admin-text-secondary: #8888a0;
        }

        .admin-root input, 
        .admin-root select, 
        .admin-root textarea {
          font-family: inherit;
        }

        /* High contrast scrollbars for admin */
        .admin-root *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .admin-root *::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .admin-root *::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .admin-root *::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes adminFadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-admin-in {
          animation: adminFadeInUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
