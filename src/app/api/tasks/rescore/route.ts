import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { scoreBulkTasks } from '@/lib/claude/client'

// Re-score all tasks for a user (called daily)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Get all incomplete tasks
  const { data: tasks, error: fetchError } = await supabaseServer
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ message: 'No tasks to score' })
  }

  // Score all tasks
  try {
    const scores = await scoreBulkTasks(
      tasks.map((t) => ({ id: t.id, title: t.title, notes: t.notes || undefined }))
    )

    // Update all tasks with new scores
    const updates = Object.entries(scores).map(([taskId, score]) =>
      supabaseServer.from('tasks').update({ effort_score: score }).eq('id', taskId)
    )

    await Promise.all(updates)

    return NextResponse.json({
      message: 'Tasks rescored successfully',
      tasksScored: tasks.length,
    })
  } catch (error: any) {
    console.error('Error rescoring tasks:', error)
    return NextResponse.json(
      { error: 'Failed to rescore tasks: ' + error.message },
      { status: 500 }
    )
  }
}
