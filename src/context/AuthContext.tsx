'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Memoize supabase client to prevent unnecessary re-renders
    const supabase = useMemo(() => createClient(), []);

    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }
            setProfile(data);
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        }
    }, [supabase]);

    const refreshProfile = useCallback(async () => {
        if (user) await fetchProfile(user.id);
    }, [user, fetchProfile]);

    useEffect(() => {
        let mounted = true;

        // Fallback: Ensure loading screen disappears quickly (3 seconds max)
        const loadingFallback = setTimeout(() => {
            if (mounted) {
                console.log('Auth loading fallback triggered');
                setLoading(false);
            }
        }, 3000);

        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    }
                }
            } catch (error) {
                console.error('Auth error in getSession:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                    clearTimeout(loadingFallback);
                }
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;

                console.log('Auth state change:', event);

                try {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    } else {
                        setProfile(null);
                    }
                } catch (error) {
                    console.error('Auth handler failed:', error);
                } finally {
                    setLoading(false);
                    clearTimeout(loadingFallback);
                }
            }
        );

        return () => {
            mounted = false;
            clearTimeout(loadingFallback);
            subscription.unsubscribe();
        };
    }, [supabase, fetchProfile]);

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        return { error: error?.message ?? null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    };

    const signOut = async () => {
        console.log('Initiating aggressive sign out...');
        try {
            // 1. Trigger Supabase sign out (background)
            supabase.auth.signOut().catch(err => console.error('Supabase signOut request failed:', err));

            // 2. Clear React state immediately
            setUser(null);
            setProfile(null);

            // 3. Aggressively scrub browser storage
            if (typeof window !== 'undefined') {
                const scrubStorage = (storage: Storage) => {
                    try {
                        for (let i = 0; i < storage.length; i++) {
                            const key = storage.key(i);
                            if (key && (key.includes('supabase') || key.includes('sb-'))) {
                                storage.removeItem(key);
                                i--; // Adjust index after removal
                            }
                        }
                    } catch (e) {
                        console.error('Storage scrub failed:', e);
                    }
                };
                scrubStorage(localStorage);
                scrubStorage(sessionStorage);
            }

            // 4. Force a tiny buffer (500ms) to ensure storage writes are committed
            // then hard redirect to clear everything
            setTimeout(() => {
                console.log('Redirecting to clean landing page...');
                window.location.href = '/?logout=' + Date.now();
            }, 500);

        } catch (error) {
            console.error('Aggressive sign out failed:', error);
            window.location.replace('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
