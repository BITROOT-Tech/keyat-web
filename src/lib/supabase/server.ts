// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Use regular environment variables for server-side (without NEXT_PUBLIC_ prefix)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase environment variables are missing. Please check your .env.local file and Vercel environment variables.'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll()
        },
        async setAll(cookiesToSet) {
          try {
            const cookieStore = await cookies()
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  )
}