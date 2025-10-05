import { NextRequest, NextResponse } from 'next/server'
import { getGoogleFitData, refreshAccessToken } from '@/lib/google-fit/client'
import { supabaseServer } from '@/lib/supabase/server'
import { getDateString, parseLocalDate } from '@/lib/utils/date'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { userId, date } = body

  console.log('Syncing Google Fit data for user:', userId, 'date:', date)

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Get user's Google tokens
  const { data: user, error: userError } = await (supabaseServer as any)
    .from('users')
    .select('google_access_token, google_refresh_token')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    console.error('User not found:', userError)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  console.log('User found, checking tokens...')
  console.log('Has access token:', !!user.google_access_token)
  console.log('Has refresh token:', !!user.google_refresh_token)

  if (!user.google_access_token) {
    console.log('Google Fit not connected')
    return NextResponse.json(
      { error: 'Google Fit not connected' },
      { status: 400 }
    )
  }

  let accessToken = user.google_access_token
  console.log('Using access token to fetch data...')

  // Try to fetch data, refresh token if needed
  try {
    // Parse date as local date to avoid timezone issues
    const targetDate = date ? parseLocalDate(date) : new Date()
    console.log('Target date for Google Fit:', targetDate, 'from string:', date)

    const healthData = await getGoogleFitData(accessToken, targetDate)

    // Save to database
    console.log('Fetched health data from Google Fit:', healthData)
    console.log('Will save with date string:', getDateString(targetDate))

    const { data, error } = await (supabaseServer as any)
      .from('health_data')
      .upsert(
        {
          user_id: userId,
          date: getDateString(targetDate),
          steps: healthData.steps,
          calories: healthData.calories,
          distance: healthData.distance,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving to database:', error)
      throw error
    }

    console.log('Saved to database and returning:', data)
    return NextResponse.json(data)
  } catch (error: any) {
    // If token expired, try to refresh
    console.log('❌ Error fetching Google Fit data:', error.message)
    if (error.message?.includes('401') && user.google_refresh_token) {
      try {
        console.log('🔄 Access token expired, refreshing...')
        const newTokens = await refreshAccessToken(user.google_refresh_token)

        console.log('✅ Got new access token, updating database...')
        // Update access token
        await (supabaseServer as any)
          .from('users')
          .update({ google_access_token: newTokens.access_token })
          .eq('id', userId)

        console.log('🔁 Retrying Google Fit data fetch with new token...')
        // Retry with new token
        const targetDate = date ? parseLocalDate(date) : new Date()
        const healthData = await getGoogleFitData(newTokens.access_token, targetDate)

        const { data, error } = await (supabaseServer as any)
          .from('health_data')
          .upsert(
            {
              user_id: userId,
              date: getDateString(targetDate),
              steps: healthData.steps,
              calories: healthData.calories,
              distance: healthData.distance,
            },
            { onConflict: 'user_id,date' }
          )
          .select()
          .single()

        if (error) {
          throw error
        }

        return NextResponse.json(data)
      } catch (refreshError: any) {
        return NextResponse.json(
          { error: 'Failed to refresh token: ' + refreshError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to sync Google Fit data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const targetDate = date || getDateString()

  const { data, error } = await supabaseServer
    .from('health_data')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .single()

  if (error) {
    // Return empty data if not found
    if (error.code === 'PGRST116') {
      return NextResponse.json({
        steps: 0,
        calories: 0,
        distance: 0,
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
