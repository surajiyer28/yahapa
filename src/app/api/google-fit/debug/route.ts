import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  // Get user's Google tokens
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('🔍 User lookup:', {
    userId,
    found: !!user,
    error: userError,
    hasAccessToken: !!user?.google_access_token,
    hasRefreshToken: !!user?.google_refresh_token,
    accessTokenPrefix: user?.google_access_token?.substring(0, 20)
  })

  if (userError || !user?.google_access_token) {
    return NextResponse.json({
      error: 'No Google Fit connection',
      debug: {
        userFound: !!user,
        hasAccessToken: !!user?.google_access_token,
        hasRefreshToken: !!user?.google_refresh_token,
        userError: userError?.message
      }
    }, { status: 400 })
  }

  // Parse the date
  const targetDate = new Date(date)
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  const startTimeMillis = startOfDay.getTime()
  const endTimeMillis = endOfDay.getTime()

  console.log('🔍 Debug Info:')
  console.log('Date string:', date)
  console.log('Target date:', targetDate)
  console.log('Start of day:', startOfDay)
  console.log('End of day:', endOfDay)
  console.log('Start millis:', startTimeMillis)
  console.log('End millis:', endTimeMillis)

  try {
    // Try to fetch all available data sources first
    const dataSourcesResponse = await fetch(
      'https://www.googleapis.com/fitness/v1/users/me/dataSources',
      {
        headers: {
          Authorization: `Bearer ${user.google_access_token}`,
        },
      }
    )

    const dataSources = await dataSourcesResponse.json()

    // Fetch steps with the standard data source
    const stepsResponse = await fetch(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.google_access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId:
                'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
            },
          ],
          bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
          startTimeMillis,
          endTimeMillis,
        }),
      }
    )

    const stepsData = await stepsResponse.json()

    // Also try the merge_step_deltas source
    const stepsResponse2 = await fetch(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.google_access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId:
                'derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas',
            },
          ],
          bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
          startTimeMillis,
          endTimeMillis,
        }),
      }
    )

    const stepsData2 = await stepsResponse2.json()

    return NextResponse.json({
      date,
      startTimeMillis,
      endTimeMillis,
      dataSources: dataSources,
      stepsDataEstimated: stepsData,
      stepsDataMerge: stepsData2,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
