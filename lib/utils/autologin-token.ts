// Token firmado y de corta duración para loguear automáticamente al admin de
// una tienda recién creada, sin pasar la contraseña real por la URL.
// Usa Web Crypto (funciona igual en runtime Node y en el middleware Edge).

const TTL_MS = 2 * 60 * 1000 // 2 minutos: solo para el instante posterior a crear la tienda
const encoder = new TextEncoder()

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  return atob(padded)
}

async function getKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ])
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function generateAutologinToken(subdomain: string, secret: string, ttlMs: number = TTL_MS): Promise<string> {
  const payload = `${subdomain.toLowerCase()}.${Date.now() + ttlMs}`
  const key = await getKey(secret)
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return `${toBase64Url(encoder.encode(payload))}.${toBase64Url(signature)}`
}

export async function verifyAutologinToken(token: string, subdomain: string, secret: string): Promise<boolean> {
  const [payloadB64, sigB64] = token.split(".")
  if (!payloadB64 || !sigB64) return false

  const payload = fromBase64Url(payloadB64)
  const [tokenSubdomain, expiresStr] = payload.split(".")
  if (tokenSubdomain !== subdomain.toLowerCase()) return false

  const expires = Number(expiresStr)
  if (!expires || Date.now() > expires) return false

  const key = await getKey(secret)
  const expectedSignature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  return timingSafeEqual(toBase64Url(expectedSignature), sigB64)
}
