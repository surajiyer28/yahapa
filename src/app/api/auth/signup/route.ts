import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password required' },
      { status: 400 }
    )
  }

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    )
  }

  // Sign up with Supabase Auth, include name in user metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name.trim(),
      }
    }
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  if (authData.user) {
    // Create user profile in users table
    const { error: profileError } = await supabaseServer.from('users').insert({
      id: authData.user.id,
      email: authData.user.email!,
    })

    if (profileError && profileError.code !== '23505') {
      // Ignore duplicate key errors
      console.error('Profile creation error:', profileError)
    }
  }

  return NextResponse.json({ success: true, user: authData.user })
}
