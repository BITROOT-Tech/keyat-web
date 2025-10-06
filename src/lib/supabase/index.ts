// src/lib/supabase/index.ts
export { createClient as createServerClient } from './server'
export { createClient as createBrowserClient } from './client'

// Remove the direct supabase export to avoid conflicts
// The new pattern is to use createClient() in each component