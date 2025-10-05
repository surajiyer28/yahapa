import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface StreakItem {
  id: string
  user_id: string
  title: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface StreakCompletion {
  id: string
  user_id: string
  streak_item_id: string
  completion_date: string
  created_at: string
}

export function useStreaks(userId: string | undefined) {
  const [streakItems, setStreakItems] = useState<StreakItem[]>([])
  const [completions, setCompletions] = useState<StreakCompletion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    fetchStreakItems()
    fetchCompletions()
  }, [userId])

  async function fetchStreakItems() {
    if (!userId) return

    try {
      const response = await fetch(`/api/streaks/items?userId=${userId}`)
      const data = await response.json()

      if (data.error) {
        console.error('Error fetching streak items:', data.error)
        return
      }

      setStreakItems(data.items || [])
    } catch (error) {
      console.error('Error fetching streak items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCompletions(startDate?: string, endDate?: string) {
    if (!userId) return

    try {
      let url = `/api/streaks/completions?userId=${userId}`
      if (startDate) url += `&startDate=${startDate}`
      if (endDate) url += `&endDate=${endDate}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        console.error('Error fetching completions:', data.error)
        return
      }

      setCompletions(data.completions || [])
    } catch (error) {
      console.error('Error fetching completions:', error)
    }
  }

  async function addStreakItem(title: string) {
    if (!userId) return

    try {
      const response = await fetch('/api/streaks/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Error adding streak item:', data.error)
        return
      }

      await fetchStreakItems()
    } catch (error) {
      console.error('Error adding streak item:', error)
    }
  }

  async function updateStreakItem(id: string, title: string) {
    try {
      const response = await fetch('/api/streaks/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Error updating streak item:', data.error)
        return
      }

      await fetchStreakItems()
    } catch (error) {
      console.error('Error updating streak item:', error)
    }
  }

  async function deleteStreakItem(id: string) {
    try {
      const response = await fetch(`/api/streaks/items?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.error) {
        console.error('Error deleting streak item:', data.error)
        return
      }

      // Refresh both streak items and completions
      await fetchStreakItems()
      await fetchCompletions()
    } catch (error) {
      console.error('Error deleting streak item:', error)
    }
  }

  async function toggleCompletion(streakItemId: string, completionDate: string) {
    if (!userId) return

    try {
      const response = await fetch('/api/streaks/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, streakItemId, completionDate }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Error toggling completion:', data.error)
        return
      }

      await fetchCompletions()
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  function isCompleted(streakItemId: string, date: string): boolean {
    return completions.some(
      (c) => c.streak_item_id === streakItemId && c.completion_date === date
    )
  }

  function getCompletionsForDate(date: string): StreakCompletion[] {
    return completions.filter((c) => c.completion_date === date)
  }

  function getCompletionPercentage(date: string): number {
    if (streakItems.length === 0) return 0
    const completedCount = getCompletionsForDate(date).length
    return (completedCount / streakItems.length) * 100
  }

  return {
    streakItems,
    completions,
    loading,
    addStreakItem,
    updateStreakItem,
    deleteStreakItem,
    toggleCompletion,
    isCompleted,
    getCompletionsForDate,
    getCompletionPercentage,
    refreshCompletions: fetchCompletions,
  }
}
