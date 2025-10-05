import { useState, useEffect } from 'react'

interface HealthData {
  steps: number
  calories: number
  distance: number
}

interface User {
  google_access_token: string | null
  google_refresh_token: string | null
}

export function useHealthData(userId: string | undefined, date?: string) {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    calories: 0,
    distance: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [autoSyncing, setAutoSyncing] = useState(false)

  // Check if user has Google Fit connected
  const checkConnection = async () => {
    if (!userId) return false

    try {
      const response = await fetch(`/api/google-fit/status?userId=${userId}`)
      const data = await response.json()
      setIsConnected(data.connected || false)
      return data.connected || false
    } catch (err) {
      return false
    }
  }

  const fetchHealthData = async (shouldSync = false) => {
    if (!userId) return

    try {
      setLoading(true)

      // If shouldSync is true, fetch fresh data from Google Fit
      if (shouldSync) {
        setAutoSyncing(true)
        const syncResponse = await fetch('/api/google-fit/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date }),
        })

        if (syncResponse.ok) {
          const syncData = await syncResponse.json()
          console.log('✅ Synced health data from API:', syncData)
          console.log('📊 Setting health data:', {
            steps: syncData.steps || 0,
            calories: syncData.calories || 0,
            distance: syncData.distance || 0,
          })
          setHealthData({
            steps: syncData.steps || 0,
            calories: syncData.calories || 0,
            distance: syncData.distance || 0,
          })
          setError(null)
          setAutoSyncing(false)
          return
        }
      }

      // Otherwise, just get cached data from database
      const params = new URLSearchParams({ userId })
      if (date) params.append('date', date)

      const response = await fetch(`/api/google-fit/sync?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch health data')

      const data = await response.json()
      console.log('📥 Fetched cached health data from API:', data)
      console.log('📊 Setting health data:', {
        steps: data.steps || 0,
        calories: data.calories || 0,
        distance: data.distance || 0,
      })
      setHealthData({
        steps: data.steps || 0,
        calories: data.calories || 0,
        distance: data.distance || 0,
      })
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setAutoSyncing(false)
    }
  }

  useEffect(() => {
    const initHealthData = async () => {
      if (!userId) return

      // Check if connected
      const connected = await checkConnection()

      // If connected, auto-sync fresh data (this will also refresh token if needed)
      if (connected) {
        console.log('🔄 Auto-syncing health data on load...')
        await fetchHealthData(true)
      } else {
        // Just fetch cached data
        console.log('📥 Fetching cached health data...')
        await fetchHealthData(false)
      }
    }

    initHealthData()
  }, [userId, date])

  const syncHealthData = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch('/api/google-fit/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date }),
      })

      if (!response.ok) throw new Error('Failed to sync health data')

      const data = await response.json()
      setHealthData({
        steps: data.steps || 0,
        calories: data.calories || 0,
        distance: data.distance || 0,
      })
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const connectGoogleFit = async () => {
    if (!userId) {
      setError('User ID required')
      return
    }

    try {
      const response = await fetch(`/api/google-fit/auth?userId=${userId}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      // Redirect to Google OAuth
      window.location.href = data.authUrl
    } catch (err: any) {
      setError(err.message)
    }
  }

  return {
    healthData,
    loading,
    error,
    isConnected,
    autoSyncing,
    syncHealthData,
    connectGoogleFit,
    refetch: fetchHealthData,
  }
}
