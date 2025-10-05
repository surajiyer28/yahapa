'use client'

import { useState } from 'react'
import { StreakItem } from '@/hooks/useStreaks'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

interface StreakListProps {
  streakItems: StreakItem[]
  selectedDate: string
  onAddStreak: (title: string) => void
  onUpdateStreak: (id: string, title: string) => void
  onDeleteStreak: (id: string) => void
  onToggleCompletion: (streakItemId: string, date: string) => void
  isCompleted: (streakItemId: string, date: string) => boolean
}

export default function StreakList({
  streakItems,
  selectedDate,
  onAddStreak,
  onUpdateStreak,
  onDeleteStreak,
  onToggleCompletion,
  isCompleted,
}: StreakListProps) {
  const [newStreakTitle, setNewStreakTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleAddStreak = () => {
    if (newStreakTitle.trim()) {
      onAddStreak(newStreakTitle.trim())
      setNewStreakTitle('')
    }
  }

  const handleStartEdit = (item: StreakItem) => {
    setEditingId(item.id)
    setEditingTitle(item.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onUpdateStreak(editingId, editingTitle.trim())
      setEditingId(null)
      setEditingTitle('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Add new streak */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newStreakTitle}
          onChange={(e) => setNewStreakTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddStreak()}
          placeholder="Add a new item..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddStreak}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Add habit"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Streak items list */}
      {streakItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="mb-2">No habits yet</p>
          <p className="text-sm">Add your first habit to start tracking!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {streakItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isCompleted(item.id, selectedDate)}
                onChange={() => onToggleCompletion(item.id, selectedDate)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />

              {/* Title (editable) */}
              {editingId === item.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:text-green-700 dark:text-green-400"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-900 dark:text-white">
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteStreak(item.id)}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
