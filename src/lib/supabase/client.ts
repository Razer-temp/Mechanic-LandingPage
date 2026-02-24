import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createClient() {
    const isBrowser = typeof window !== 'undefined';
    const actualUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseInstance) {
        if (isBrowser) {
            console.log('Initializing Supabase through Proxy fetch override');
            supabaseInstance = createBrowserClient<Database>(
                actualUrl,
                supabaseKey,
                {
                    global: {
                        fetch: (url, options) => {
                            const urlStr = url.toString();
                            // Only proxy if it's a supabase request
                            const finalUrl = urlStr.startsWith(actualUrl)
                                ? urlStr.replace(actualUrl, `${window.location.origin}/supabase-api`)
                                : urlStr;

                            return fetch(finalUrl, options);
                        }
                    }
                }
            );
        } else {
            supabaseInstance = createBrowserClient<Database>(
                actualUrl,
                supabaseKey
            );
        }
    }

    return supabaseInstance;
}

