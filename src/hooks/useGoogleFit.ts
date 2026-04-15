import { useState, useCallback } from 'react'
import type { FitData } from '../engine/healthMapping'
import { useGameStore } from '../store/gameStore'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.body.read'

export function useGoogleFit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const applyFitData = useGameStore(s => s.applyFitData)
  const connected = useGameStore(s => s.healthSync.connected)

  const connect = useCallback(async () => {
    if (!CLIENT_ID) {
      setError('Google Client ID not configured')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use OAuth popup flow
      const redirectUri = window.location.origin
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`
      window.location.href = authUrl
    } catch (e) {
      setError('Failed to connect to Google Fit')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFitData = useCallback(async (accessToken: string): Promise<FitData> => {
    const now = Date.now()
    const dayStart = new Date()
    dayStart.setHours(0, 0, 0, 0)

    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          { dataTypeName: 'com.google.step_count.delta' },
          { dataTypeName: 'com.google.active_minutes' },
          { dataTypeName: 'com.google.heart_minutes' },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: dayStart.getTime(),
        endTimeMillis: now,
      }),
    })

    const data = await response.json()
    const bucket = data.bucket?.[0]

    let steps = 0
    let activeMinutes = 0
    let heartPoints = 0

    if (bucket?.dataset) {
      for (const ds of bucket.dataset) {
        for (const pt of ds.point || []) {
          for (const val of pt.value || []) {
            if (ds.dataSourceId?.includes('step_count')) steps += val.intVal || 0
            if (ds.dataSourceId?.includes('active_minutes')) activeMinutes += val.intVal || 0
            if (ds.dataSourceId?.includes('heart_minutes')) heartPoints += val.fpVal || 0
          }
        }
      }
    }

    return { steps, sleepHours: 7, activeMinutes, heartPoints } // sleep requires separate API call
  }, [])

  const sync = useCallback(async (accessToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const fitData = await fetchFitData(accessToken)
      applyFitData(fitData)
    } catch {
      setError('Failed to sync fitness data')
    } finally {
      setLoading(false)
    }
  }, [fetchFitData, applyFitData])

  return { connect, sync, loading, error, connected }
}
