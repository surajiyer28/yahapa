'use client'

import { useStreaks } from '@/hooks/useStreaks'
import StreakList from './StreakList'
import StreakCalendar from './StreakCalendar'

interface StreakTrackerProps {
  userId: string
  selectedDate: string
}

export default function StreakTracker({ userId, selectedDate }: StreakTrackerProps) {
  const {
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
  } = useStreaks(userId)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading streaks...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Streak Tracker
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Streak management (25% width) */}
        <div className="lg:w-1/4">
          <StreakList
            streakItems={streakItems}
            selectedDate={selectedDate}
            onAddStreak={addStreakItem}
            onUpdateStreak={updateStreakItem}
            onDeleteStreak={deleteStreakItem}
            onToggleCompletion={toggleCompletion}
            isCompleted={isCompleted}
          />
        </div>

        {/* Right side - Calendar heatmap (75% width) */}
        <div className="lg:w-3/4">
          <StreakCalendar
            streakItems={streakItems}
            completions={completions}
            getCompletionPercentage={getCompletionPercentage}
            getCompletionsForDate={getCompletionsForDate}
          />
        </div>
      </div>
    </div>
  )
}
