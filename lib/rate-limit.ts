// Rate limiting utility para prevenir abuso de APIs

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  interval: number // en milisegundos
  maxRequests: number
}

export function rateLimit(
  key: string,
  options: RateLimitOptions = { interval: 60000, maxRequests: 10 }
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  // Si no hay entrada o ya pasó el tiempo de reset
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + options.interval,
    })
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetIn: options.interval,
    }
  }

  // Si hay entrada y no ha pasado el tiempo
  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  // Incrementar contador
  entry.count++
  rateLimitMap.set(key, entry)

  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key)
}

// Limpiar entradas viejas cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
