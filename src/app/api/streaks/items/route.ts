import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all active streak items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('streak_items')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ items: data || [] })
  } catch (error: any) {
    console.error('Error fetching streak items:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch streak items' },
      { status: 500 }
    )
  }
}

// POST - Create a new streak item
export async function POST(request: NextRequest) {
  try {
    const { userId, title } = await request.json()

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'Missing userId or title' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('streak_items')
      .insert({
        user_id: userId,
        title,
        active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error: any) {
    console.error('Error creating streak item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create streak item' },
      { status: 500 }
    )
  }
}

// PUT - Update a streak item
export async function PUT(request: NextRequest) {
  try {
    const { id, title } = await request.json()

    if (!id || !title) {
      return NextResponse.json(
        { error: 'Missing id or title' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('streak_items')
      .update({ title })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error: any) {
    console.error('Error updating streak item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update streak item' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete a streak item (set active to false) and delete all completions
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id' },
        { status: 400 }
      )
    }

    // First, delete all completions associated with this streak item
    const { error: completionsError } = await supabase
      .from('streak_completions')
      .delete()
      .eq('streak_item_id', id)

    if (completionsError) throw completionsError

    // Then, soft delete the streak item
    const { error } = await supabase
      .from('streak_items')
      .update({ active: false })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting streak item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete streak item' },
      { status: 500 }
    )
  }
}
