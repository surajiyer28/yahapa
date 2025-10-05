'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

interface PomodoroTimerProps {
  onTimerStateChange: (isRunning: boolean) => void
  onPomodoroComplete: () => void
}

export default function PomodoroTimer({ onTimerStateChange, onPomodoroComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed
            setIsRunning(false)
            onTimerStateChange(false)
            showNotification()
            onPomodoroComplete()
            return 25 * 60 // Reset to 25 minutes
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onTimerStateChange])

  const showNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Complete!', {
          body: '25 minutes is up! Time for a break.',
          icon: '/logo.png',
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Pomodoro Complete!', {
              body: '25 minutes is up! Time for a break.',
              icon: '/logo.png',
            })
          }
        })
      }
    }
  }

  const toggleTimer = () => {
    if (!isRunning && Notification.permission === 'default') {
      // Request notification permission when first starting
      Notification.requestPermission()
    }
    const newState = !isRunning
    setIsRunning(newState)
    onTimerStateChange(newState)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2">
      <button
        onClick={toggleTimer}
        className={`p-2 rounded transition-colors ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
        }`}
        title={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>
      <div className="font-mono text-lg font-medium text-gray-900 dark:text-white min-w-[4rem]">
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}
