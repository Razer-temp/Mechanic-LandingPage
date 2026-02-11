'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export function UserMenu() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="user-menu-container" ref={menuRef}>
            <button
                className={clsx('user-menu-trigger', isOpen && 'active')}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
            >
                <div className="user-avatar">
                    <User className="w-4 h-4" />
                </div>
                <span className="user-name-wrapper">
                    <span className="user-name">{user.email?.split('@')[0]}</span>
                    <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform duration-300', isOpen && 'rotate-180')} />
                </span>
            </button>

            <div className={clsx('user-dropdown glass-card', isOpen && 'open')}>
                <div className="dropdown-header">
                    <p className="dropdown-user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <ul className="dropdown-list">
                    <li>
                        <Link href="/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                        <button
                            className="dropdown-item logout"
                            onClick={() => { signOut(); setIsOpen(false); }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
