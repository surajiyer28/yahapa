interface GoogleFitData {
  steps: number
  calories: number
  distance: number
}

export async function getGoogleFitData(
  accessToken: string,
  date: Date
): Promise<GoogleFitData> {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const startTimeMillis = startOfDay.getTime()
  const endTimeMillis = endOfDay.getTime()

  // Fetch steps
  const stepsResponse = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

  // Check for authentication errors
  if (!stepsResponse.ok) {
    const errorData = await stepsResponse.json()
    if (stepsResponse.status === 401) {
      throw new Error('401: Token expired or invalid')
    }
    throw new Error(`Google Fit API error: ${errorData.error?.message || stepsResponse.statusText}`)
  }

  // Fetch calories
  const caloriesResponse = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.calories.expended',
            dataSourceId:
              'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
          },
        ],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  )

  // Fetch distance
  const distanceResponse = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.distance.delta',
            dataSourceId:
              'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
          },
        ],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis,
      }),
    }
  )

  const [stepsData, caloriesData, distanceData] = await Promise.all([
    stepsResponse.json(),
    caloriesResponse.json(),
    distanceResponse.json(),
  ])

  console.log('📊 Google Fit API responses:', {
    stepsData: JSON.stringify(stepsData, null, 2),
    caloriesData: JSON.stringify(caloriesData, null, 2),
    distanceData: JSON.stringify(distanceData, null, 2)
  })

  const steps =
    stepsData.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0
  const calories =
    caloriesData.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0
  const distance =
    distanceData.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0

  console.log('📈 Parsed values:', { steps, calories, distance })

  return {
    steps,
    calories: Math.round(calories),
    distance: Math.round(distance),
  }
}

export function getGoogleAuthUrl(redirectUri: string, userId: string): string {
  const scope = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.location.read',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
    state: userId, // Pass userId as state
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  return response.json()
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  })

  return response.json()
}
