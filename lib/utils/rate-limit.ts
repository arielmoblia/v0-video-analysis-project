// Rate limiting para prevenir ataques de fuerza bruta
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutos
const MAX_ATTEMPTS = 5 // máximo 5 intentos

export function rateLimit(identifier: string): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now - record.lastReset > WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now })
    return { success: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const resetIn = WINDOW_MS - (now - record.lastReset)
    return { success: false, remaining: 0, resetIn }
  }

  record.count++
  return { success: true, remaining: MAX_ATTEMPTS - record.count, resetIn: WINDOW_MS - (now - record.lastReset) }
}

export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}
