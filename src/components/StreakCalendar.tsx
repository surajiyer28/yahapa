'use client'

import { useState } from 'react'
import { StreakItem, StreakCompletion } from '@/hooks/useStreaks'

interface StreakCalendarProps {
  streakItems: StreakItem[]
  completions: StreakCompletion[]
  getCompletionPercentage: (date: string) => number
  getCompletionsForDate: (date: string) => StreakCompletion[]
}

interface DayData {
  date: Date
  dateStr: string
  percentage: number
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
}

interface MonthData {
  name: string
  year: number
  weeks: (DayData | null)[][] // Each week has 7 slots (Sun-Sat)
}

export default function StreakCalendar({
  streakItems,
  completions,
  getCompletionPercentage,
  getCompletionsForDate,
}: StreakCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Generate calendar data grouped by months
  const generateMonthsData = (): MonthData[] => {
    const today = new Date()
    const months: MonthData[] = []

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const year = monthDate.getFullYear()
      const month = monthDate.getMonth()
      const monthName = monthDate.toLocaleString('default', { month: 'short' })

      // Get first and last day of month
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()

      // Build weeks for this month
      const weeks: (DayData | null)[][] = []
      let currentWeek: (DayData | null)[] = []

      // Fill in days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay() // 0 = Sunday
        const dateStr = formatDate(date)
        const percentage = getCompletionPercentage(dateStr)

        // If this is the first day of the month and it's not Sunday, add null padding
        if (day === 1 && dayOfWeek > 0) {
          for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null)
          }
        }

        currentWeek.push({
          date: new Date(date),
          dateStr,
          percentage,
          dayOfWeek,
        })

        // If week is complete (7 days) or it's the last day of the month
        if (currentWeek.length === 7 || day === daysInMonth) {
          // Pad remaining days if needed
          while (currentWeek.length < 7) {
            currentWeek.push(null)
          }
          weeks.push(currentWeek)
          currentWeek = []
        }
      }

      months.push({
        name: monthName,
        year,
        weeks,
      })
    }

    return months
  }

  const getShadeClass = (percentage: number): string => {
    if (percentage === 0) {
      return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    } else if (percentage < 50) {
      return 'bg-blue-200 dark:bg-blue-900'
    } else if (percentage < 100) {
      return 'bg-blue-400 dark:bg-blue-700'
    } else {
      return 'bg-blue-600 dark:bg-blue-500'
    }
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleMouseEnter = (dayData: DayData, event: React.MouseEvent) => {
    setHoveredDate(dayData.dateStr)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredDate(null)
  }

  const months = generateMonthsData()
  const today = formatDate(new Date())

  return (
    <div className="space-y-3">
      <div className="overflow-x-hidden pb-2 flex justify-end" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="inline-flex gap-0">
          {/* Months */}
          {months.map((monthData, monthIdx) => (
            <div
              key={`${monthData.name}-${monthData.year}`}
              className="inline-flex flex-col gap-0"
              style={{ marginRight: monthIdx < months.length - 1 ? '6px' : '0' }}
            >
              {/* Month label */}
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 h-4">
                {monthData.name}
              </div>

              {/* Weeks for this month */}
              <div className="flex gap-[3px]">
                {monthData.weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[3px]">
                    {week.map((dayData, dayIdx) => {
                      if (!dayData) {
                        // Empty slot - don't render anything visible
                        return (
                          <div
                            key={`empty-${dayIdx}`}
                            className="w-[11px] h-[11px]"
                          />
                        )
                      }

                      const shadeClass = getShadeClass(dayData.percentage)
                      const isToday = dayData.dateStr === today

                      return (
                        <div
                          key={dayData.dateStr}
                          className={`w-[11px] h-[11px] rounded-sm ${shadeClass} cursor-pointer hover:ring-1 hover:ring-gray-500 transition-all`}
                          onMouseEnter={(e) => handleMouseEnter(dayData, e)}
                          onMouseLeave={handleMouseLeave}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="w-[11px] h-[11px] rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          <div className="w-[11px] h-[11px] rounded-sm bg-blue-200 dark:bg-blue-900" />
          <div className="w-[11px] h-[11px] rounded-sm bg-blue-400 dark:bg-blue-700" />
          <div className="w-[11px] h-[11px] rounded-sm bg-blue-600 dark:bg-blue-500" />
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {hoveredDate && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-2 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
          }}
        >
          <div className="font-semibold mb-1">
            {new Date(hoveredDate).toLocaleDateString('default', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-gray-300">
            {getCompletionsForDate(hoveredDate).length} / {streakItems.length} habits
          </div>
          {getCompletionsForDate(hoveredDate).length > 0 && (
            <div className="mt-1 space-y-0.5">
              {getCompletionsForDate(hoveredDate).map((completion) => {
                const item = streakItems.find((i) => i.id === completion.streak_item_id)
                return (
                  <div key={completion.id} className="text-xs text-green-400">
                    ✓ {item?.title}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
