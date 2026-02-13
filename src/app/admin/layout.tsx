'use client';

import React from 'react';
import './admin-globals.css';

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
    <div className="admin-root min-h-screen selection:bg-[#00c8ff33] selection:text-white">
      {children}
    </div>
  );
}
