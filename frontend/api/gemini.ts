import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Per-IP rate limit: 5 requests per hour (protects free Gemini quota) ──────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_PER_HOUR = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { limited: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, remaining: RATE_LIMIT_PER_HOUR - 1, resetMs: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_PER_HOUR) {
    return { limited: true, remaining: 0, resetMs: entry.resetAt };
  }

  entry.count++;
  return { limited: false, remaining: RATE_LIMIT_PER_HOUR - entry.count, resetMs: entry.resetAt };
}

// Allowed origins (update with your Vercel domain)
const ALLOWED_ORIGINS = [
  'https://statezio.vercel.app',
  'https://toc-visualizer.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsOrigin(req: VercelRequest): string {
  const origin = req.headers.origin || '';
  // Allow any *.vercel.app preview URL
  if (origin.endsWith('.vercel.app') || ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
}

function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', getCorsOrigin(req));
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  res.setHeader('Vary', 'Origin');
}

const MAX_PROMPT_LENGTH = 2000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting by IP ────────────────────────────────────────────────────
  const ip =
    ((req.headers['x-forwarded-for'] as string) || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const rateResult = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_PER_HOUR);
  res.setHeader('X-RateLimit-Remaining', rateResult.remaining);
  res.setHeader('X-RateLimit-Reset', Math.floor(rateResult.resetMs / 1000));

  if (rateResult.limited) {
    const minutesLeft = Math.ceil((rateResult.resetMs - Date.now()) / 60_000);
    return res.status(429).json({
      error: `Rate limit reached. You can make ${RATE_LIMIT_PER_HOUR} AI requests per hour. Please try again in ${minutesLeft} minute(s).`,
    });
  }

  // ── Validate request body ──────────────────────────────────────────────────
  const body = req.body as { prompt?: unknown; systemInstruction?: unknown };

  if (!body?.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()) {
    return res.status(400).json({ error: 'Missing or invalid "prompt" field.' });
  }

  if (body.prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({
      error: `Prompt too long (${body.prompt.length} chars). Maximum is ${MAX_PROMPT_LENGTH} characters.`,
    });
  }

  const prompt = body.prompt.trim();
  const systemInstruction =
    typeof body.systemInstruction === 'string' ? body.systemInstruction : '';

  // ── API Key resolution: server env takes priority over client header ────────
  const serverKey = process.env.GEMINI_API_KEY;
  const clientKey = (req.headers['x-gemini-key'] as string | undefined)?.trim();
  const apiKey = serverKey || clientKey;

  if (!apiKey) {
    return res.status(401).json({
      error:
        'No Gemini API key configured. Ask the administrator to set GEMINI_API_KEY in Vercel, or add your own key in the solver settings.',
    });
  }

  // ── Call Gemini with model fallback ───────────────────────────────────────
  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
  let rawText = '';
  let lastError = '';

  const geminiBody = {
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
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      maxOutputTokens: 4096,
    },
  };

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
        signal: AbortSignal.timeout(25_000), // 25 s timeout per model
      });

      if (!geminiRes.ok) {
        const errJson = await geminiRes.json().catch(() => null);
        lastError =
          errJson?.error?.message || `Model ${model} returned HTTP ${geminiRes.status}`;
        // 403 = bad key, don't retry other models
        if (geminiRes.status === 403 || geminiRes.status === 401) break;
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
    return res
      .status(502)
      .json({ error: lastError || 'No response from Gemini AI. Please try again.' });
  }

  // ── Strip markdown code fences if model wrapped response ──────────────────
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .trim();
  }

  // Validate it's parseable JSON before returning
  try {
    JSON.parse(cleaned);
  } catch {
    return res.status(502).json({
      error: 'Gemini returned a malformed JSON response. Please try again.',
    });
  }

  return res.status(200).json({ result: cleaned });
}
