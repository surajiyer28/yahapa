import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Check if user has Google Fit tokens
  const { data: user, error } = await supabaseServer
    .from('users')
    .select('google_access_token, google_refresh_token')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return NextResponse.json({ connected: false })
  }

  const connected = !!(user.google_access_token && user.google_refresh_token)

  return NextResponse.json({ connected })
}
