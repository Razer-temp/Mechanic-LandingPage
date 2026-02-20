import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if it exists
    const { data: { user } } = await supabase.auth.getUser();

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow login and reset-password pages
        if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/reset-password') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return response;
        }

        // Redirect to login if no user
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Check if user has admin role in app_metadata
        const role = user.app_metadata?.role;
        if (role !== 'admin') {
            // Sign out if not admin (security measure)
            await supabase.auth.signOut();
            return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*'],
};
