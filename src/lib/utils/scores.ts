interface Task {
  completed: boolean
  effort_score: number
}

interface HealthData {
  steps: number
  calories: number
  distance: number
}

const HEALTH_TARGETS = {
  steps: 10000,
  calories: 2000,
  distance: 5000, // meters
}

export function calculateProductivityScore(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  const completedTasks = tasks.filter(t => t.completed)
  if (completedTasks.length === 0) return 0

  const totalEffort = tasks.reduce((sum, t) => sum + t.effort_score, 0)
  const completedEffort = completedTasks.reduce((sum, t) => sum + t.effort_score, 0)

  return Math.round((completedEffort / totalEffort) * 100)
}

export function calculateHealthScore(healthData: HealthData): number {
  const stepsScore = Math.min((healthData.steps / HEALTH_TARGETS.steps) * 100, 100)
  const caloriesScore = Math.min((healthData.calories / HEALTH_TARGETS.calories) * 100, 100)
  const distanceScore = Math.min((healthData.distance / HEALTH_TARGETS.distance) * 100, 100)

  const averageScore = (stepsScore + caloriesScore + distanceScore) / 3

  return Math.round(averageScore)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981' // green
  if (score >= 50) return '#f59e0b' // orange
  return '#ef4444' // red
}
