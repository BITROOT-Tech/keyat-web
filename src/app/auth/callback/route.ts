// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=oauth_failed&message=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=no_code`
    )
  }

  const supabase = await createClient()
  
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Session exchange error:', sessionError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=session_failed&message=${encodeURIComponent(sessionError.message)}`
      )
    }

    if (!sessionData?.session) {
      console.error('No session data returned')
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=no_session`
      )
    }

    console.log('✅ Auth successful for user:', sessionData.session.user.email)

    // Successful authentication - redirect to dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)

  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=unexpected_error`
    )
  }
}