import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('CRITICAL: Supabase Environment Variables are missing!', { supabaseUrl, supabaseKey });
    }

    return createBrowserClient<Database>(
        supabaseUrl ?? '',
        supabaseKey ?? ''
    );
}

