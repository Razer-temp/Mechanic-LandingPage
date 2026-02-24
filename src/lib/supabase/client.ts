import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase environment variables are missing!');
        if (typeof window !== 'undefined') {
            alert('DIAGNOSTIC: Supabase Env Vars Missing! URL: ' + !!supabaseUrl + ' Key: ' + !!supabaseKey);
        }
    }

    if (!supabaseInstance) {
        supabaseInstance = createBrowserClient<Database>(
            supabaseUrl ?? '',
            supabaseKey ?? ''
        );
    }

    return supabaseInstance;
}

