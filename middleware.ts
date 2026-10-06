import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAutologinToken } from '@/lib/utils/autologin-token'

// Si la URL trae ?al=<token> (login automático tras crear una tienda nueva),
// valida el token firmado y, si es válido, loguea seteando la cookie de admin
// y redirige a la misma página sin el token en la URL (no queda en el
// historial ni se reenvía a terceros vía referrer).
async function tryAutologin(
  request: NextRequest,
  subdomain: string,
  cleanPathname: string,
): Promise<NextResponse | null> {
  const token = request.nextUrl.searchParams.get('al')
  const secret = process.env.ADMIN_AUTOLOGIN_SECRET
  if (!token || !secret) return null

  const valid = await verifyAutologinToken(token, subdomain, secret)
  if (!valid) return null

  const cleanUrl = request.nextUrl.clone()
  cleanUrl.pathname = cleanPathname
  cleanUrl.searchParams.delete('al')

  const response = NextResponse.redirect(cleanUrl)
  response.cookies.set(`admin_${subdomain.toLowerCase()}`, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días, igual que el login manual
  })
  return response
}

// ── Cache de noindex en memoria (TTL 5 min) ──────────────────────────────────
const noindexCache: Record<string, { value: boolean; ts: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// ── Cache de dominio propio → subdominio (TTL 5 min) ─────────────────────────
const customDomainCache: Record<string, { subdomain: string | null; ts: number }> = {}

// Busca a qué tienda (subdominio) pertenece un dominio propio ya conectado
// (ej. "milatienda.com.ar" -> "milatienda"). Usa la misma tabla `stores`,
// consultada por REST directo porque el middleware corre en Edge runtime.
async function resolveCustomDomain(hostWithoutPort: string): Promise<string | null> {
  const lookupHost = hostWithoutPort.replace(/^www\./, '').toLowerCase()
  const now = Date.now()
  const cached = customDomainCache[lookupHost]
  if (cached && now - cached.ts < CACHE_TTL) return cached.subdomain

  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stores?custom_domain=eq.${encodeURIComponent(lookupHost)}&status=eq.active&select=subdomain&limit=1`
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const subdomain = data?.[0]?.subdomain || null
    customDomainCache[lookupHost] = { subdomain, ts: now }
    return subdomain
  } catch {
    return null
  }
}

async function isNoindex(pathname: string): Promise<boolean> {
  const now = Date.now()
  const cached = noindexCache[pathname]
  if (cached && now - cached.ts < CACHE_TTL) return cached.value

  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/seo_pages?url=eq.${encodeURIComponent(pathname)}&select=noindex&limit=1`
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return false
    const data = await res.json()
    const value = data?.[0]?.noindex === true
    noindexCache[pathname] = { value, ts: now }
    return value
  } catch {
    return false
  }
}


// Dominios raíz que NO son subdominios de tienda
const ROOT_DOMAINS = ['tol.ar', 'www.tol.ar', 'localhost', '157.173.212.229', '3003.tol.ar']

// CORS para llamadas de seo.tol.ar a los endpoints de administración de acá
// (dev). Antes seo-contenido le pegaba directo a la IP por http:// y el
// navegador lo bloqueaba por "mixed content" (página https pidiendo http);
// al pasarlo a https://prueba.tol.ar quedó expuesto el problema real: sin
// estos headers, el navegador bloquea igual por CORS (origen distinto).
const CORS_ALLOWED_ORIGINS = ['https://seo.tol.ar']

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  const origin = request.headers.get('origin') || ''
  if (pathname.startsWith('/api/') && CORS_ALLOWED_ORIGINS.includes(origin)) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    const corsResponse = NextResponse.next()
    corsResponse.headers.set('Access-Control-Allow-Origin', origin)
    return corsResponse
  }

  // Extraer el subdominio
  // Ej: "mitienda.tol.ar" → "mitienda"
  // Ej: "localhost:3000" → null
  const hostWithoutPort = hostname.split(':')[0]
  const parts = hostWithoutPort.split('.')

  // Si es un dominio raíz o localhost, dejar pasar sin tocar
  if (ROOT_DOMAINS.includes(hostWithoutPort)) {
    // Login automático en pruebas locales: /tienda/[subdomain]/admin?al=token
    const localAdminMatch = pathname.match(/^\/tienda\/([a-zA-Z0-9]+)\/admin$/)
    if (localAdminMatch) {
      const autologinResponse = await tryAutologin(request, localAdminMatch[1], pathname)
      if (autologinResponse) return autologinResponse
    }

    // Verificar noindex para páginas del dominio raíz
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.includes('.')) {
      const noindex = await isNoindex(pathname)
      if (noindex) {
        const response = NextResponse.next()
        response.headers.set('X-Robots-Tag', 'noindex, nofollow')
        return response
      }
    }
    return NextResponse.next()
  }

  let subdomain: string | null = null

  if (hostWithoutPort.endsWith('.tol.ar')) {
    // Subdominio de tol.ar: "mitienda.tol.ar" → "mitienda"
    if (parts.length >= 2) {
      const candidate = parts[0]
      // Ignorar "www" como subdominio de tienda
      if (candidate !== 'www') {
        subdomain = candidate
      }
    }
  } else {
    // No es *.tol.ar: puede ser el dominio propio de una tienda
    // (ej. "milatienda.com.ar"), conectado desde su panel de admin.
    subdomain = await resolveCustomDomain(hostWithoutPort)
  }

  // Si no hay subdominio válido, dejar pasar
  if (!subdomain) {
    return NextResponse.next()
  }

  // Evitar bucles de rewrite: si ya estamos en /tienda/... no tocar
  if (pathname.startsWith('/tienda')) {
    return NextResponse.next()
  }

  // Evitar tocar rutas de Next.js internas y archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/disenio-preview') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Rewrite: /admin → /tienda/[subdomain]/admin
  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/admin2' || pathname.startsWith('/admin2/')) {
    if (pathname === '/admin') {
      const autologinResponse = await tryAutologin(request, subdomain, '/admin')
      if (autologinResponse) return autologinResponse
    }

    const newPath = pathname.replace(/^\/admin2/, `/tienda/${subdomain}/admin2`).replace(/^\/admin/, `/tienda/${subdomain}/admin`)
    const url = request.nextUrl.clone()
    url.pathname = newPath
    const headers = new Headers(request.headers)
    headers.set('x-store-subdomain', subdomain)
    return NextResponse.rewrite(url, { request: { headers } })
  }

  // Rewrite: / → /tienda/[subdomain]
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/tienda/${subdomain}`
    const headers = new Headers(request.headers)
    headers.set('x-store-subdomain', subdomain)
    return NextResponse.rewrite(url, { request: { headers } })
  }

  // Cualquier otra ruta: rewrite al subdominio
  // Ej: /categoria/ropa → /tienda/[subdomain]/categoria/ropa
  const url = request.nextUrl.clone()
  url.pathname = `/tienda/${subdomain}${pathname}`
  const headers = new Headers(request.headers)
  headers.set('x-store-subdomain', subdomain)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas EXCEPTO:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}