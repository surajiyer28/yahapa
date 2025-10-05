import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    console.log('🗑️ Deleting account for user:', userId)

    // Delete user data in order (due to foreign key constraints)

    // 1. Delete health data
    const { error: healthError } = await supabaseServer
      .from('health_data')
      .delete()
      .eq('user_id', userId)

    if (healthError) {
      console.error('Error deleting health data:', healthError)
    }

    // 2. Delete tasks
    const { error: tasksError } = await supabaseServer
      .from('tasks')
      .delete()
      .eq('user_id', userId)

    if (tasksError) {
      console.error('Error deleting tasks:', tasksError)
    }

    // 3. Delete user profile
    const { error: userError } = await supabaseServer
      .from('users')
      .delete()
      .eq('id', userId)

    if (userError) {
      console.error('Error deleting user profile:', userError)
    }

    // 4. Delete auth user using service role
    const { error: authError } = await supabaseServer.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return NextResponse.json(
        { error: 'Failed to delete account: ' + authError.message },
        { status: 500 }
      )
    }

    console.log('✅ Account deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in delete account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}
