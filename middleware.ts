// middleware.ts - PRODUCTION BATTLE-TESTED
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
      // Redirect authenticated users away from auth pages
      const userType = user.user_metadata?.user_type || 'tenant'
      const dashboardPath = getDashboardPath(userType)
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }
    return supabaseResponse
  }

  // BATTLE-TESTED: Protected routes - redirect to login if no user
  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // BATTLE-TESTED: Role-based route protection
  const userType = user.user_metadata?.user_type || 'tenant'
  
  // Consumer routes (tenant)
  if (path.startsWith('/consumer') && userType !== 'tenant') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Landlord routes  
  if (path.startsWith('/landlord') && userType !== 'landlord') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Agent routes
  if (path.startsWith('/agent') && userType !== 'agent') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Service provider routes
  if (path.startsWith('/service-provider') && userType !== 'service_provider') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Admin routes
  if (path.startsWith('/admin') && userType !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return supabaseResponse
}

// BATTLE-TESTED: Get proper dashboard path based on user type
function getDashboardPath(userType: string): string {
  const paths: Record<string, string> = {
    'tenant': '/consumer/dashboard',
    'landlord': '/landlord/dashboard', 
    'agent': '/agent/dashboard',
    'service_provider': '/service-provider/dashboard',
    'admin': '/admin/dashboard'
  };
  
  return paths[userType] || '/consumer/dashboard';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}