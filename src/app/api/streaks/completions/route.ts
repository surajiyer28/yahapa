import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch completions for a user (optionally filtered by date range)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('streak_completions')
      .select('*')
      .eq('user_id', userId)

    if (startDate) {
      query = query.gte('completion_date', startDate)
    }
    if (endDate) {
      query = query.lte('completion_date', endDate)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ completions: data || [] })
  } catch (error: any) {
    console.error('Error fetching streak completions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch streak completions' },
      { status: 500 }
    )
  }
}

// POST - Toggle a streak completion (add if not exists, remove if exists)
export async function POST(request: NextRequest) {
  try {
    const { userId, streakItemId, completionDate } = await request.json()

    if (!userId || !streakItemId || !completionDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if completion already exists
    const { data: existing, error: fetchError } = await supabase
      .from('streak_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_item_id', streakItemId)
      .eq('completion_date', completionDate)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existing) {
      // Remove completion (toggle off)
      const { error: deleteError } = await supabase
        .from('streak_completions')
        .delete()
        .eq('id', existing.id)

      if (deleteError) throw deleteError

      return NextResponse.json({ completed: false })
    } else {
      // Add completion (toggle on)
      const { error: insertError } = await supabase
        .from('streak_completions')
        .insert({
          user_id: userId,
          streak_item_id: streakItemId,
          completion_date: completionDate,
        })

      if (insertError) throw insertError

      return NextResponse.json({ completed: true })
    }
  } catch (error: any) {
    console.error('Error toggling streak completion:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to toggle streak completion' },
      { status: 500 }
    )
  }
}
