import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 1;

export async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return null;
  }

  const rateLimitInfo = rateLimitMap.get(ip)!;
  const timeSinceLastRequest = now - rateLimitInfo.lastRequest;

  if (timeSinceLastRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return null;
  }

  if (rateLimitInfo.count >= MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  rateLimitInfo.count += 1;
  rateLimitInfo.lastRequest = now;
  rateLimitMap.set(ip, rateLimitInfo);

  return null;
}