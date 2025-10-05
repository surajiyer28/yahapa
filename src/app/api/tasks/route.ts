import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { scoreTaskEffort } from '@/lib/claude/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  let query = supabaseServer
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (date) {
    query = query.eq('due_date', date)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, notes, dueDate } = body

    console.log('Creating task:', { userId, title, notes, dueDate })

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'User ID and title required' },
        { status: 400 }
      )
    }

    // Score the task using Claude API
    let effortScore = 5 // Default score
    try {
      effortScore = await scoreTaskEffort(title, notes)
      console.log('Task scored:', effortScore)
    } catch (scoreError: any) {
      console.error('Error scoring task:', scoreError)
      // Continue with default score if Claude API fails
    }

    const { data, error } = await supabaseServer
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        notes,
        due_date: dueDate,
        effort_score: effortScore,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Task created successfully:', data)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Unexpected error in POST /api/tasks:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { taskId, ...updates } = body

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
  }

  const { data, error } = await supabaseServer
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
  }

  const { error } = await supabaseServer.from('tasks').delete().eq('id', taskId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
