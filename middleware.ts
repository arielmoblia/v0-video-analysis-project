import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dominios raíz que NO son subdominios de tienda
const ROOT_DOMAINS = ['tol.ar', 'www.tol.ar', 'localhost']

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Extraer el subdominio
  // Ej: "mitienda.tol.ar" → "mitienda"
  // Ej: "localhost:3000" → null
  const hostWithoutPort = hostname.split(':')[0]
  const parts = hostWithoutPort.split('.')

  // Si es un dominio raíz o localhost, dejar pasar sin tocar
  if (ROOT_DOMAINS.includes(hostWithoutPort)) {
    return NextResponse.next()
  }

  // Si tiene más de 2 partes (subdominio.dominio.tld) extraer el subdominio
  // También funciona con subdominio.localhost
  let subdomain: string | null = null

  if (parts.length >= 2) {
    const candidate = parts[0]
    // Ignorar "www" como subdominio de tienda
    if (candidate !== 'www') {
      subdomain = candidate
    }
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
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Rewrite: /admin → /tienda/[subdomain]/admin
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const newPath = pathname.replace(/^\/admin/, `/tienda/${subdomain}/admin`)
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  // Rewrite: / → /tienda/[subdomain]
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/tienda/${subdomain}`
    return NextResponse.rewrite(url)
  }

  // Cualquier otra ruta: rewrite al subdominio
  // Ej: /categoria/ropa → /tienda/[subdomain]/categoria/ropa
  const url = request.nextUrl.clone()
  url.pathname = `/tienda/${subdomain}${pathname}`
  return NextResponse.rewrite(url)
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