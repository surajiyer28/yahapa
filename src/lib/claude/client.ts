import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function scoreTaskEffort(taskTitle: string, taskNotes?: string): Promise<number> {
  try {
    console.log('Scoring task with Claude API:', { taskTitle, taskNotes })

    const prompt = `You are a task scoring assistant. Rate the points for this task on a scale of 0-100 based on difficulty and time required, where:
0-30 = Low difficulty (quick, simple tasks like "reply to email", "make a phone call")
31-60 = Medium difficulty (moderate complexity like "write a report", "debug a feature")
61-100 = High difficulty (complex, time-consuming tasks like "build full authentication system", "refactor entire codebase")

Task: ${taskTitle}
${taskNotes ? `Notes: ${taskNotes}` : ''}

Respond with ONLY a single number between 0-100. No explanation.`

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    console.log('Claude API response:', message)

    const content = message.content[0]
    if (content.type === 'text') {
      const score = parseInt(content.text.trim())
      console.log('Parsed score:', score)
      // Return score divided by 10 to fit in the 1-10 range for database
      // We'll multiply by 10 when displaying
      const finalScore = isNaN(score) ? 5 : Math.min(Math.max(Math.round(score / 10), 1), 10)
      console.log('Final score (divided by 10):', finalScore)
      return finalScore
    }

    return 5
  } catch (error: any) {
    console.error('Error in scoreTaskEffort:', error.message)
    throw error
  }
}

export async function scoreBulkTasks(
  tasks: Array<{ id: string; title: string; notes?: string }>
): Promise<Record<string, number>> {
  const scores: Record<string, number> = {}

  for (const task of tasks) {
    scores[task.id] = await scoreTaskEffort(task.title, task.notes || undefined)
  }

  return scores
}
