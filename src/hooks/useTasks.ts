import { useState, useEffect } from 'react'
import { Task } from '@/components/TaskList'

export function useTasks(userId: string | undefined, date?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const params = new URLSearchParams({ userId })
      if (date) params.append('date', date)

      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch tasks')

      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchTasks()
    }
  }, [userId, date])

  const addTask = async (title: string, notes: string, dueDate: string | null) => {
    if (!userId) {
      console.error('No userId provided')
      return
    }

    try {
      console.log('Adding task:', { userId, title, notes, dueDate })
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, notes, dueDate }),
      })

      const data = await response.json()
      console.log('Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add task')
      }

      setTasks([data, ...tasks])
      setError(null)
    } catch (err: any) {
      console.error('Error adding task:', err)
      setError(err.message)
      throw err // Re-throw so UI can handle it
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      setTasks(tasks.filter((t) => t.id !== taskId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, ...updates }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      const updatedTask = await response.json()
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const rescoreTasks = async () => {
    if (!userId) return

    try {
      const response = await fetch('/api/tasks/rescore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) throw new Error('Failed to rescore tasks')

      // Refresh tasks to get new scores
      await fetchTasks()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    rescoreTasks,
    refetch: fetchTasks,
  }
}
