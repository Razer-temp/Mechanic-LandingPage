import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('--- Supabase Client Init ---');
    console.log('URL Present:', !!supabaseUrl);
    console.log('Key Present:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
        console.error('CRITICAL: Supabase Environment Variables are missing!', { supabaseUrl, supabaseKey });
        // Alert to UI if possible (Client only)
        if (typeof window !== 'undefined') {
            alert('Supabase configuration missing! Check environment variables.');
        }
    }

    if (!supabaseInstance) {
        console.log('Creating new Supabase instance...');
        supabaseInstance = createBrowserClient<Database>(
            supabaseUrl ?? '',
            supabaseKey ?? ''
        );
    } else {
        console.log('Returning existing Supabase instance');
    }

    return supabaseInstance;
}

