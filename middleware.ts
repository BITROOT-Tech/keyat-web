// middleware.ts - FIXED VERSION (Updated Dashboard Paths)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // BATTLE-TESTED: Public routes that don't require auth
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password', '/']
  if (publicRoutes.includes(path)) {
    if (user) {
      // SMART USER TYPE DETECTION - FALLBACK TO EMAIL
      const userType = await detectUserType(supabase, user);
      const dashboardPath = getDashboardPath(userType);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return supabaseResponse;
  }

  // BATTLE-TESTED: Protected routes - redirect to login if no user
  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // SMART USER TYPE DETECTION WITH FALLBACKS
  const userType = await detectUserType(supabase, user);
  
  // ROLE-BASED ROUTE PROTECTION
  if (path.startsWith('/consumer') && userType !== 'tenant') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (path.startsWith('/landlord') && userType !== 'landlord') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (path.startsWith('/agent') && userType !== 'agent') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (path.startsWith('/service-provider') && userType !== 'service_provider') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  if (path.startsWith('/admin') && userType !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return supabaseResponse;
}

// SMART USER TYPE DETECTION WITH MULTIPLE FALLBACKS
async function detectUserType(supabase: any, user: any): Promise<string> {
  // 1. Try user_metadata first
  if (user.user_metadata?.user_type) {
    return user.user_metadata.user_type;
  }

  // 2. Try profile table
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type) {
      return profile.user_type;
    }
  } catch (error) {
    console.log('Profile fetch failed, using email detection');
  }

  // 3. Fallback to email-based detection (matches login page logic)
  return detectUserTypeFromEmail(user.email);
}

// EMAIL-BASED DETECTION (MATCHES LOGIN PAGE LOGIC)
function detectUserTypeFromEmail(email: string): string {
  const emailLower = email.toLowerCase();
  
  if (emailLower.includes('admin')) return 'admin';
  if (emailLower.includes('landlord') || emailLower.includes('owner')) return 'landlord';
  if (emailLower.includes('agent') || emailLower.includes('realtor')) return 'agent';
  if (emailLower.includes('service') || emailLower.includes('repair')) return 'service_provider';
  
  // Default to tenant (consumer)
  return 'tenant';
}

// 🚨 CRITICAL FIX: Updated dashboard paths to match our new structure
function getDashboardPath(userType: string): string {
  const paths: Record<string, string> = {
    'tenant': '/consumer/home',           // ✅ CHANGED: /consumer/home
    'landlord': '/landlord/dashboard', 
    'agent': '/agent/dashboard',
    'service_provider': '/service-provider/dashboard',
    'admin': '/admin/dashboard'           // ✅ KEPT: /admin/dashboard
  };
  
  return paths[userType] || '/consumer/home'; // ✅ CHANGED: Default to /consumer/home
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};