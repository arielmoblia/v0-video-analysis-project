/** @type {import('next').NextConfig} */
const nextConfig = {
  // El server tiene solo 2 CPUs y varios procesos pm2 compitiendo por ellas;
  // algunas páginas de /blog superaban el límite default de 60s durante la
  // generación estática en momentos de carga alta, rompiendo el build de forma
  // intermitente (diagnosticado por Vigía el 27/08/2026).
  staticPageGenerationTimeout: 180,
  serverExternalPackages: ['pdfkit'],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimizacion de imagenes (CRITICO para PageSpeed)
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias de cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'scraping.tol.ar',
      },
      {
        protocol: 'https',
        hostname: '*.mitiendanube.com',
      },
      {
        protocol: 'https',
        hostname: 'acdn-us.mitiendanube.com',
      },
      {
        protocol: 'https',
        hostname: '*.tol.ar',
      },
      {
        protocol: 'http',
        hostname: '*.tol.ar',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/crear-tienda-online-argentina",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/crear-tienda-online",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/tienda-online-gratis-argentina",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/tienda-online-gratis",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/tienda-online-argentina-gratis",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/precios",
        destination: "/plan-gratis",
        permanent: true,
      },
      {
        source: "/comparacion",
        destination: "/comparar",
        permanent: true,
      },
      {
        source: "/comparar/tiendanube",
        destination: "/comparar",
        permanent: true,
      },
      {
        source: "/comparar/shopify",
        destination: "/comparar",
        permanent: true,
      },
      {
        // Bing rastreó esta URL y da 404 (no existe ningún artículo con este slug exacto,
        // es mezcla de dos slugs reales). Se redirige al artículo más parecido en vez de
        // dejar el 404 suelto.
        source: "/blog/mejor-plataforma-ecommerce-argentina-2026",
        destination: "/blog/plataformas-ecommerce-argentina-2026",
        permanent: true,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/(admin|super-admin|api)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // Cache agresivo para assets estaticos (imagenes, fonts, etc)
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|ico|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // En dev, Turbopack no siempre cambia el hash del chunk cuando cambia el
      // contenido (ni cuando cambia una env var NEXT_PUBLIC_* inlineada), así que
      // cachear los .js "para siempre" deja al navegador con código viejo aunque
      // el servidor ya se haya recompilado (mismo bug ya diagnosticado y arreglado
      // en tiendabasica-dev el 01/09/2026).
      ...(isProd ? [{
        source: "/(.*)\\.(js|css|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      }] : []),
    ]
  },
  poweredByHeader: false,
  // Comprimir respuestas
  compress: true,
}

export default nextConfig
