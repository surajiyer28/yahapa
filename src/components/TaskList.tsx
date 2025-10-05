'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Check, Calendar, ArrowUp } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

export interface Task {
  id: string
  title: string
  notes: string | null
  completed: boolean
  effort_score: number
  due_date: string | null
  created_at: string
  updated_at: string
}

interface TaskListProps {
  tasks: Task[]
  onAddTask: (title: string, notes: string, dueDate: string | null) => Promise<void>
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  selectedDate: string
}

export default function TaskList({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  selectedDate,
}: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskNotes, setNewTaskNotes] = useState('')
  const [newTaskDate, setNewTaskDate] = useState('')
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [isParsingTask, setIsParsingTask] = useState(false)

  // Get today's date string for validation
  const getTodayDateString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    // If no due date provided, default to today
    const dueDate = newTaskDate || getTodayDateString()

    try {
      await onAddTask(newTaskTitle, newTaskNotes, dueDate)
      setNewTaskTitle('')
      setNewTaskNotes('')
      setNewTaskDate('')
      setShowAddForm(false)
    } catch (err: any) {
      alert('Failed to add task: ' + err.message)
    }
  }

  const handleNaturalLanguageSubmit = async () => {
    if (!naturalLanguageInput.trim() || isParsingTask) return

    setIsParsingTask(true)
    try {
      // Parse the natural language input
      const response = await fetch('/api/tasks/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalLanguageInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse task')
      }

      const parsed = await response.json()

      // Add the parsed task
      await onAddTask(parsed.title, parsed.notes || '', parsed.dueDate)
      setNaturalLanguageInput('')
    } catch (err: any) {
      alert('Failed to parse task: ' + err.message)
    } finally {
      setIsParsingTask(false)
    }
  }

  const handleNaturalLanguageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleNaturalLanguageSubmit()
    }
  }

  const completedTasks = tasks.filter(t => t.completed)
  const incompleteTasks = tasks.filter(t => !t.completed)

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Scrollable task area */}
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>{incompleteTasks.length === 0 ? "No tasks added" : ""}</div>
        {showAddForm && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
            />
            <textarea
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {incompleteTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isExpanded={expandedTasks.has(task.id)}
              onToggleExpand={() => toggleExpand(task.id)}
              onToggle={() => onToggleTask(task.id, !task.completed)}
              onDelete={() => onDeleteTask(task.id)}
              onUpdate={(updates) => onUpdateTask(task.id, updates)}
            />
          ))}
        </div>

        {completedTasks.length > 0 && (
          <>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Completed ({completedTasks.length})
              </h4>
            </div>
            <div className="space-y-2 opacity-60">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isExpanded={expandedTasks.has(task.id)}
                  onToggleExpand={() => toggleExpand(task.id)}
                  onToggle={() => onToggleTask(task.id, !task.completed)}
                  onDelete={() => onDeleteTask(task.id)}
                  onUpdate={(updates) => onUpdateTask(task.id, updates)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Natural Language Input - Fixed at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            onKeyPress={handleNaturalLanguageKeyPress}
            placeholder="e.g., Remind me to pay rent tomorrow"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isParsingTask}
          />
          <button
            onClick={handleNaturalLanguageSubmit}
            disabled={isParsingTask || !naturalLanguageInput.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            title="Submit task (or press Enter)"
          >
            {isParsingTask ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function TaskItem({
  task,
  isExpanded,
  onToggleExpand,
  onToggle,
  onDelete,
  onUpdate,
}: {
  task: Task
  isExpanded: boolean
  onToggleExpand: () => void
  onToggle: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Task>) => void
}) {
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editDate, setEditDate] = useState(task.due_date || '')

  const handleDateSave = async () => {
    if (editDate && editDate !== task.due_date) {
      await onUpdate({ due_date: editDate })
    }
    setIsEditingDate(false)
  }

  const handleDateCancel = () => {
    setEditDate(task.due_date || '')
    setIsEditingDate(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span
              className={`text-gray-900 dark:text-white ${
                task.completed ? 'line-through' : ''
              }`}
            >
              {task.title}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Points: {task.effort_score * 10}
            </span>
            {!isEditingDate && task.due_date && (
              <button
                onClick={() => setIsEditingDate(true)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                Due: {formatDate(task.due_date, 'MMM d')}
              </button>
            )}
            {isEditingDate && (
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={handleDateSave}
                  className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleDateCancel}
                  className="text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {task.notes && (
          <button
            onClick={onToggleExpand}
            className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        <button
          onClick={onDelete}
          className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && task.notes && (
        <div className="mt-3 pl-8 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {task.notes}
        </div>
      )}
    </div>
  )
}
