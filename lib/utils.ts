import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Quita emojis y espacios extra — usado para titles, H1 y descripciones SEO
export function seoClean(text: string): string {
  return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').replace(/\s+/g, ' ').trim()
}

// Agrega protocolo si falta, para que un link externo cargado sin "http(s)://"
// no se interprete como ruta relativa del dominio actual (ej: AFIP data fiscal).
export function withProtocol(url: string): string {
  const trimmed = url.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

// Extrae el primer párrafo útil de una descripción de producto para usar como meta description.
// Evita líneas que arrancan con especificaciones técnicas (Medidas:, Peso:, etc.).
export function seoDesc(raw: string, maxLen = 155): string {
  const lines = raw.split(/\n+/).map(l => l.trim()).filter(Boolean)
  const good = lines.find(l =>
    l.length > 25 &&
    !/^(Medidas?:|Peso:|Talles?:|Colores?:|Material:|Dimensi[oó]n|✅|🔥|👉|→|•|-\s)/i.test(l)
  ) ?? lines[0] ?? raw
  const clean = seoClean(good)
  return clean.length > maxLen ? clean.slice(0, maxLen - 3) + '...' : clean
}
