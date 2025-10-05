import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// Ensure user exists in users table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email } = body

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email required' }, { status: 400 })
    }

    console.log('Ensuring user exists:', userId, email)

    // Try to insert user, ignore if already exists
    const { data, error } = await (supabaseServer as any)
      .from('users')
      .upsert(
        {
          id: userId,
          email: email,
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (error && error.code !== '23505') {
      // Ignore duplicate key errors
      console.error('Error creating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('User ensured:', data || 'already exists')
    return NextResponse.json({ success: true, user: data })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
