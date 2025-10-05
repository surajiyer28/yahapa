import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, date } = await request.json()

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing userId or date' },
        { status: 400 }
      )
    }

    // Check if a record exists for this user and date
    const { data: existing, error: fetchError } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected
      throw fetchError
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('pomodoro_sessions')
        .update({ completed_count: existing.completed_count + 1 })
        .eq('user_id', userId)
        .eq('date', date)

      if (updateError) throw updateError
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('pomodoro_sessions')
        .insert({
          user_id: userId,
          date,
          completed_count: 1,
        })

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error completing pomodoro:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to record pomodoro completion' },
      { status: 500 }
    )
  }
}
