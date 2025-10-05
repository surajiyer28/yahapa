import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({
        error: 'Not authenticated',
        debug: {
          sessionError: sessionError?.message,
          hasSession: !!session
        }
      }, { status: 401 })
    }

    // Get user data from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      return NextResponse.json({
        error: 'User not found in database',
        authUserId: session.user.id,
        authEmail: session.user.email,
        dbError: userError.message,
      }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      hasGoogleAccessToken: !!user.google_access_token,
      hasGoogleRefreshToken: !!user.google_refresh_token,
      created_at: user.created_at,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
