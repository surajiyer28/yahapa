import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/google-fit/client'
import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // userId passed as state

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_code`)
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/google-fit/callback`

  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri)

    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Get user ID from state parameter
    const userId = state

    if (!userId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_user`)
    }

    // Save tokens to user profile
    const { error } = await (supabaseServer as any).from('users').update({
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token,
    }).eq('id', userId)

    if (error) {
      throw error
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?google_fit=connected`
    )
  } catch (error: any) {
    console.error('Google Fit callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=google_fit_failed`
    )
  }
}
