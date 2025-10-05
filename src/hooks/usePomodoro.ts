import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePomodoro(userId: string | undefined, date: string) {
  const [pomodoroCount, setPomodoroCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    fetchPomodoroCount()
  }, [userId, date])

  async function fetchPomodoroCount() {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('completed_count')
        .eq('user_id', userId)
        .eq('date', date)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching pomodoro count:', error)
        return
      }

      setPomodoroCount(data?.completed_count || 0)
    } catch (error) {
      console.error('Error fetching pomodoro count:', error)
    }
  }

  async function recordPomodoroComplete() {
    if (!userId) return

    try {
      const response = await fetch('/api/pomodoro/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date }),
      })

      if (!response.ok) {
        throw new Error('Failed to record pomodoro completion')
      }

      // Refresh the count
      await fetchPomodoroCount()
    } catch (error) {
      console.error('Error recording pomodoro completion:', error)
    }
  }

  return { pomodoroCount, recordPomodoroComplete }
}
