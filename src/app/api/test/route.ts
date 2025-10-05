import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { data: users, error } = await supabaseServer
      .from('users')
      .select('id, email')
      .limit(5)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'API and database are working',
      userCount: users?.length || 0,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasGoogleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      },
    })
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      message: err.message,
    })
  }
}
