'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { Moon, Sun, LogOut, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import ActivityRings from '@/components/ActivityRings'
import TaskList from '@/components/TaskList'
import Toast from '@/components/Toast'
import PomodoroTimer from '@/components/PomodoroTimer'
import StreakTracker from '@/components/StreakTracker'
import { useTasks } from '@/hooks/useTasks'
import { useHealthData } from '@/hooks/useHealthData'
import { usePomodoro } from '@/hooks/usePomodoro'
import { calculateProductivityScore, calculateHealthScore } from '@/lib/utils/scores'
import { getDateString, formatDate, getYesterday, getTomorrow, getTodayString, isTodayDate } from '@/lib/utils/date'
import Image from 'next/image'

const GREETINGS = [
  'Welcome back',
  'Hello',
  'Great to see you',
  "Let's be productive",
  'Ready to crush it',
  'Time to shine',
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'current' | 'all'>('current')
  const [selectedDate, setSelectedDate] = useState(getDateString())
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [greeting, setGreeting] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const { tasks, addTask, toggleTask, deleteTask, updateTask, rescoreTasks } = useTasks(
    user?.id,
    viewMode === 'current' ? selectedDate : undefined
  )

  const { healthData, syncHealthData, connectGoogleFit, isConnected, autoSyncing } = useHealthData(
    user?.id,
    selectedDate
  )

  const { pomodoroCount, recordPomodoroComplete } = usePomodoro(user?.id, selectedDate)

  useEffect(() => {
    checkUser()
    checkForGoogleFitCallback()
    // Set random greeting on mount
    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    setGreeting(randomGreeting)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-rescore tasks on page load (once)
  useEffect(() => {
    if (user?.id && tasks.length > 0) {
      const hasRescored = sessionStorage.getItem('tasksRescored')
      if (!hasRescored) {
        rescoreTasks()
        sessionStorage.setItem('tasksRescored', 'true')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, tasks.length])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    // Ensure user exists in database
    try {
      await fetch('/api/user/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
        }),
      })
    } catch (err) {
      console.error('Error ensuring user:', err)
    }

    setUser(session.user)
    setLoading(false)
  }

  function checkForGoogleFitCallback() {
    // Check if user just came back from Google Fit OAuth
    const params = new URLSearchParams(window.location.search)
    const googleFitConnected = params.get('google_fit')
    const error = params.get('error')

    if (googleFitConnected === 'connected') {
      // Show success toast
      setToast({ message: 'Google Fit connected successfully! Syncing data...', type: 'success' })

      // Remove the query parameter
      window.history.replaceState({}, '', window.location.pathname)

      // Force a re-fetch of health data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } else if (error) {
      setToast({ message: `Error: ${error}`, type: 'error' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleDeleteAccount() {
    if (!user?.id) return

    setDeleteLoading(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (data.error) {
        setToast({ message: data.error, type: 'error' })
        setDeleteLoading(false)
      } else {
        // Sign out and redirect to login
        await supabase.auth.signOut()
        router.push('/login')
      }
    } catch (error: any) {
      setToast({ message: 'Failed to delete account', type: 'error' })
      setDeleteLoading(false)
    }
  }

  function handlePreviousDate() {
    setSelectedDate(getYesterday(selectedDate))
    setViewMode('current')
  }

  function handleNextDate() {
    setSelectedDate(getTomorrow(selectedDate))
    setViewMode('current')
  }

  function handleDateChange(newDate: string) {
    setSelectedDate(newDate)
    setViewMode('current')
  }

  function getUserDisplayName(): string {
    // First check user_metadata.name from Supabase Auth
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
    }
    // Fallback to email username
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  function getUserInitial(): string {
    const name = getUserDisplayName()
    return name.charAt(0).toUpperCase()
  }

  // Modified addTask to auto-rescore after adding
  const handleAddTask = async (title: string, notes: string, dueDate: string | null) => {
    await addTask(title, notes, dueDate)
    await rescoreTasks()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-900 dark:text-white">Loading...</div>
      </div>
    )
  }

  const productivityScore = calculateProductivityScore(tasks) + (pomodoroCount * 10)
  const healthScore = calculateHealthScore(healthData)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className={`shadow transition-colors duration-300 ${
        isPomodoroRunning
          ? 'bg-red-50 dark:bg-red-950'
          : 'bg-white dark:bg-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="YAHAPA" width={40} height={40} className="object-contain" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                YAHAPA
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    {getUserInitial()}
                  </div>
                  <span className="hidden sm:inline">{getUserDisplayName()}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true)
                        setShowProfileDropdown(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Controls */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {greeting}, {getUserDisplayName()}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            {/* Pomodoro Timer */}
            <PomodoroTimer
              onTimerStateChange={setIsPomodoroRunning}
              onPomodoroComplete={recordPomodoroComplete}
            />

            {/* Date Selector */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
              <button
                onClick={handlePreviousDate}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                title="Previous day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => handleDateChange(getYesterday(selectedDate))}
                  className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {formatDate(getYesterday(selectedDate), 'MMM d')}
                </button>
                <button
                  onClick={() => handleDateChange(selectedDate)}
                  className="px-3 py-2 text-sm rounded font-medium bg-blue-600 text-white"
                >
                  {isTodayDate(selectedDate) ? 'Today' : formatDate(selectedDate, 'MMM d')}
                </button>
                <button
                  onClick={() => handleDateChange(getTomorrow(selectedDate))}
                  className="px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {formatDate(getTomorrow(selectedDate), 'MMM d')}
                </button>
              </div>
              <button
                onClick={handleNextDate}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-white"
                title="Next day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('current')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'current'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Rings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col overflow-hidden" style={{ height: '600px' }}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Today&apos;s Progress
            </h3>
            <div className="flex-1 flex flex-col justify-center">
              <ActivityRings
                productivityScore={productivityScore}
                healthScore={healthScore}
                steps={healthData.steps}
                calories={healthData.calories}
                distance={healthData.distance}
              />
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end items-center mb-3">
                {isConnected && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    ✓ Connected
                  </span>
                )}
              </div>

              {isConnected ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {healthData.steps.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {healthData.calories.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.effort_score * 10), 0) + (pomodoroCount * 10)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Points</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Connect Google Fit to see your health data
                  </p>
                  <button
                    onClick={connectGoogleFit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    Connect Google Fit
                  </button>
                </div>
              )}

              {autoSyncing && (
                <div className="mt-3 text-center text-sm text-blue-600 dark:text-blue-400">
                  Syncing data from Google Fit...
                </div>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col" style={{ height: '600px' }}>
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
              selectedDate={selectedDate}
            />
          </div>
        </div>

        {/* Streak Tracker - Full width section */}
        <div className="mt-8">
          <StreakTracker userId={user?.id} selectedDate={selectedDate} />
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? All your data including tasks, health data, and settings will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
