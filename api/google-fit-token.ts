import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, redirect_uri } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Google OAuth not configured' })
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirect_uri || '',
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(400).json({ error: err.error_description || 'Token exchange failed' })
    }

    const tokens = await response.json()
    return res.status(200).json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    })
  } catch {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
