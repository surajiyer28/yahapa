import { NextResponse } from 'next/server'
import { scoreTaskEffort } from '@/lib/claude/client'

export async function GET() {
  try {
    console.log('Testing Claude API...')
    const score = await scoreTaskEffort('Write a simple email', 'Just a quick reply')
    console.log('Test score received:', score)

    return NextResponse.json({
      success: true,
      score,
      message: 'Claude API is working correctly'
    })
  } catch (error: any) {
    console.error('Claude API test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        apiKey: process.env.ANTHROPIC_API_KEY ? 'Set (first 10 chars: ' + process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...)' : 'Not set'
      },
      { status: 500 }
    )
  }
}
