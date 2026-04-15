import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' })
  }

  try {
    // For DALL-E, we generate from a text prompt describing pixel art
    // In production, you'd process the uploaded image and use it as reference
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: 'A cute Tamagotchi-style pixel art character, 32x32 pixel art, transparent background, kawaii style, simple and iconic, retro game pet sprite',
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(500).json({ error: err.error?.message || 'Failed to generate avatar' })
    }

    const data = await response.json()
    const b64 = data.data[0].b64_json
    const url = `data:image/png;base64,${b64}`

    return res.status(200).json({ url })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
