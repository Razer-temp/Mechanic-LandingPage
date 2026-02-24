import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createClient() {
    const isBrowser = typeof window !== 'undefined';

    // When in browser, we use the proxy path to bypass ISP blocks
    // When on server (middleware/SSR/ServerActions), we use the direct URL
    const supabaseUrl = isBrowser
        ? `${window.location.origin}/supabase-api`
        : process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase environment variables are missing!');
        if (isBrowser) {
            alert('DIAGNOSTIC: Supabase Env Vars Missing! Proxy: ' + supabaseUrl);
        }
    }

    if (!supabaseInstance) {
        // Only log this once to avoid noise
        if (isBrowser) console.log('Initializing Supabase through Proxy:', supabaseUrl);

        supabaseInstance = createBrowserClient<Database>(
            supabaseUrl ?? '',
            supabaseKey ?? ''
        );
    }

    return supabaseInstance;
}

