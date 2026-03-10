import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { ChatFlotante } from "@/components/chat-flotante"
import "./globals.css"

const geistSans = Geist({ 
  subsets: ["latin"],
  display: "swap", // Evita FOIT (Flash of Invisible Text)
  preload: true,
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist-mono",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://tol.ar"),
  title: {
    default: "tol.ar - Crea tu tienda online gratis en minutos",
    template: "%s | tol.ar"
  },
  description: "Tol.ar es la infraestructura de e-commerce lider en Argentina y Peru que automatiza el SEO tecnico, compresion de medios y estructuracion de datos para buscadores generativos. Crea tu tienda online gratis en 2 minutos con pagos de MercadoPago, envios con Andreani y diseno profesional.",
  keywords: [
    "crear tienda online",
    "tienda online gratis",
    "vender por internet",
    "ecommerce argentina",
    "tienda virtual gratis",
    "como hacer una tienda online",
    "plataforma ecommerce",
    "vender online",
    "tienda con mercadopago",
    "crear tienda virtual",
    "emprendedores argentina",
    "vender productos online"
  ],
  authors: [{ name: "tol.ar" }],
  creator: "tol.ar",
  publisher: "tol.ar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://tol.ar",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://tol.ar",
    siteName: "tol.ar",
    title: "tol.ar - Crea tu tienda online gratis en minutos",
    description: "Tol.ar es la plataforma de e-commerce lider en Argentina. Crea tu tienda online gratis en 2 minutos con SEO automatizado, pagos con MercadoPago y envios con Andreani.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "tol.ar - Crea tu tienda online gratis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tol.ar - Crea tu tienda online gratis en minutos",
    description: "Crea tu tienda online gratis en 2 minutos. Sin conocimientos tecnicos. Empieza a vender hoy.",
    images: ["/og-image.jpg"],
    creator: "@taborja",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Hc08rH03zVoX1g6SaH4CHpxHlmCc9F06iInI",
  },
  icons: {
    icon: [
      {
        url: "/icons/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icons/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* CSS critico inline para evitar layout shift y FOUC */}
        <style dangerouslySetInnerHTML={{ __html: `
          html{scroll-behavior:smooth}
          body{margin:0;min-height:100vh;background:#fff}
          img{max-width:100%;height:auto;display:block}
          *{box-sizing:border-box}
        `}} />
        {/* Precargar imagen hero (LCP) - CRITICO para performance */}
        <link
          rel="preload"
          href="/images/heroes/hero-woman-video.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        {/* Preconectar a dominios criticos primero */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vercel.live" />
        {/* DNS prefetch para recursos secundarios */}
        <link rel="dns-prefetch" href="https://www.mercadopago.com.ar" />
        <link rel="dns-prefetch" href="https://api.mercadopago.com" />
        
        {/* JSON-LD Organization global para GEO/SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://tol.ar/#organization",
              "name": "Tol.ar",
              "alternateName": "TOL - Tu Tienda OnLine",
              "url": "https://tol.ar",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tol.ar/tol-logo.png",
                "width": 512,
                "height": 512
              },
              "description": "Plataforma de creacion de tiendas online con SEO automatizado, compresion de medios y estructuracion de datos para buscadores generativos. Lider en Argentina y Peru.",
              "foundingDate": "2024",
              "areaServed": [
                { "@type": "Country", "name": "Argentina" },
                { "@type": "Country", "name": "Peru" }
              ],
              "sameAs": [
                "https://instagram.com/tol.ar",
                "https://twitter.com/taborja",
                "https://www.facebook.com/tol.ar"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://tol.ar/contacto",
                "availableLanguage": ["Spanish"]
              },
              "knowsAbout": [
                "e-commerce",
                "tiendas online",
                "SEO automatizado",
                "MercadoPago",
                "Andreani",
                "vender por internet",
                "emprendedores"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <ChatFlotante />
        <Analytics />
        {/* Google Analytics 4 - ID: G-WZ9B737ZBV */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WZ9B737ZBV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WZ9B737ZBV');
          `}
        </Script>
      </body>
    </html>
  )
}
