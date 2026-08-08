import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting (simple in-memory, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_PER_MINUTE = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT_PER_MINUTE) return true;
  entry.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }

  // API Key: server env variable takes priority, then client-provided key as fallback
  const serverKey = process.env.GEMINI_API_KEY;
  const clientKey = req.headers['x-gemini-key'] as string | undefined;
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return res.status(401).json({
      error: 'No Gemini API key configured. Please set GEMINI_API_KEY in Vercel environment variables, or provide your own key in the solver settings.',
    });
  }

  const { prompt, systemInstruction } = req.body as {
    prompt: string;
    systemInstruction: string;
  };

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field.' });
  }

  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  let rawText = '';
  let lastError = '';

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Problem: ${prompt}\n\nPlease generate the complete, formally verified Automata solution matching the JSON specification.`,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!geminiRes.ok) {
        const errJson = await geminiRes.json().catch(() => null);
        lastError = errJson?.error?.message || `Model ${model} returned HTTP ${geminiRes.status}`;
        continue;
      }

      const data = await geminiRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        rawText = text;
        break;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'Network error reaching Gemini API';
    }
  }

  if (!rawText) {
    return res.status(502).json({ error: lastError || 'No response from Gemini AI. Please try again.' });
  }

  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  return res.status(200).json({ result: cleaned });
}
