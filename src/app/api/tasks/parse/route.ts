import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' })

    const prompt = `You are a task parsing assistant. Parse the following natural language input into a structured task format.

Today's date: ${todayString} (${dayOfWeek})

User input: "${text}"

Extract:
1. Task title (the main action/task)
2. Notes (any additional details, can be empty)
3. Due date in YYYY-MM-DD format (if mentioned, otherwise use today's date)

For relative dates:
- "today" = ${todayString}
- "tomorrow" = calculate tomorrow's date
- "next Monday/Tuesday/etc" = find the next occurrence of that day
- "coming Thursday" = find the next Thursday
- If no date mentioned, use today: ${todayString}

Respond with ONLY valid JSON in this exact format, no other text:
{
  "title": "string",
  "notes": "string",
  "dueDate": "YYYY-MM-DD"
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text.trim())
        return NextResponse.json(parsed)
      } catch (parseError) {
        console.error('Failed to parse Claude response:', content.text)
        return NextResponse.json(
          { error: 'Failed to parse task' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 })
  } catch (error: any) {
    console.error('Error parsing task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to parse task' },
      { status: 500 }
    )
  }
}
