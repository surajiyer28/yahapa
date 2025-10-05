import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, addDays, subDays } from 'date-fns'

export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  return format(dateObj, formatStr)
}

export function getWeekDays(date: Date = new Date()): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  const end = endOfWeek(date, { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

export function isTodayDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseLocalDate(date) : date
  return isToday(dateObj)
}

export function getDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getYesterday(dateString: string): string {
  const date = parseLocalDate(dateString)
  return getDateString(subDays(date, 1))
}

export function getTomorrow(dateString: string): string {
  const date = parseLocalDate(dateString)
  return getDateString(addDays(date, 1))
}

export function getTodayString(): string {
  return getDateString(new Date())
}

// Parse YYYY-MM-DD string as local date (not UTC)
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Convert YYYY-MM-DD string to Date object at start of day in local timezone
export function dateStringToDate(dateString: string): Date {
  return parseLocalDate(dateString)
}
