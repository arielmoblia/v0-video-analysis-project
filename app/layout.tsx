import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { ChatFlotante } from "@/components/chat-flotante"
import { UtmTracker } from "@/components/utm-tracker"
import { PageTracker } from "@/components/store/page-tracker"
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
    default: "tol.ar - Tienda Online Gratis en Argentina | 0% comisión",
    template: "%s | tol.ar"
  },
  description: "Creá tu tienda online gratis en Argentina con Tol.ar. Sin comisiones, sin conocimientos técnicos. MercadoPago y Andreani integrados. Empezá a vender en 2 minutos.",
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
    title: "Tol.ar — Creá tu tienda online gratis en Argentina",
    description: "Creá tu tienda online gratis en Argentina con Tol.ar. Sin comisiones, sin conocimientos técnicos. MercadoPago y Andreani integrados. Empezá a vender en 2 minutos.",
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
    title: "Tol.ar — Creá tu tienda online gratis en Argentina",
    description: "Creá tu tienda online gratis en Argentina con Tol.ar. Sin comisiones, sin conocimientos técnicos. MercadoPago y Andreani integrados. Empezá a vender en 2 minutos.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const isStoreSubdomain = Boolean(headersList.get("x-store-subdomain"))
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
        {/* Preconectar a dominios criticos primero */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch para recursos secundarios */}
        <link rel="dns-prefetch" href="https://www.mercadopago.com.ar" />
        <link rel="dns-prefetch" href="https://api.mercadopago.com" />

        {/* llms.txt — contexto para crawlers de IA (ChatGPT, Claude, Gemini, Perplexity) */}
        <link rel="llms" href="https://tol.ar/llms.txt" />

        {/* JSON-LD WebSite — ayuda a las IAs a entender el sitio como entidad */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://tol.ar/#website",
              "name": "tol.ar",
              "url": "https://tol.ar",
              "description": "La plataforma de tiendas online gratis más completa de Argentina. Plan gratuito permanente, sin comisiones, con MercadoPago y Andreani integrados.",
              "inLanguage": "es-AR",
              "publisher": {
                "@id": "https://tol.ar/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tol.ar/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

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

        {/* JSON-LD SoftwareApplication para GEO — ayuda a las IAs a entender qué es tol.ar */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "tol.ar",
              "alternateName": "Tienda OnLine Argentina",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "E-commerce platform",
              "operatingSystem": "Web",
              "url": "https://tol.ar",
              "description": "Plataforma argentina de e-commerce para crear tiendas online gratis, sin comisiones por venta, con MercadoPago integrado. Plan gratuito para siempre sin límite de productos.",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Plan Gratis",
                  "price": "0",
                  "priceCurrency": "ARS",
                  "description": "Tienda online completa sin comisiones, sin mensualidad, sin vencimiento"
                },
                {
                  "@type": "Offer",
                  "name": "Cositas opcionales",
                  "price": "1",
                  "priceCurrency": "USD",
                  "description": "Funcionalidades extra a la carta, $1 USD por mes cada una"
                }
              ],
              "featureList": [
                "0% comisión por venta",
                "Plan gratuito permanente",
                "Integración con MercadoPago",
                "Integración con Stripe",
                "Integración con PayPal",
                "Integración con Mobbex",
                "Envíos con Andreani",
                "Catálogo de productos con variantes",
                "Variantes de productos",
                "Gestión de pedidos",
                "Diseño por IA",
                "Dominio propio opcional"
              ],
              "audience": {
                "@type": "Audience",
                "audienceType": "Emprendedores y comerciantes argentinos"
              },
              "availableLanguage": "es-AR",
              "countriesSupported": "AR",
              "inLanguage": "es",
              "numberOfUsers": 378
            })
          }}
        />
      
      <script dangerouslySetInnerHTML={{ __html: `
        window.smartlook||(function(d) {
          var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
          var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
          c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
        })(document);
        smartlook('init', '3f0fde2205d89a1258ddfc7741f15fe6888a2902', { region: 'eu' });
      ` }} />
      </head>
      <body className="font-sans antialiased">
      {!isStoreSubdomain && <PageTracker storeId="a921029f-9dc7-40ed-ae14-732491c37eee" />}
        {children}
        <Suspense fallback={null}><UtmTracker /></Suspense>
        <ChatFlotante />
                {/* Google Analytics 4 - ID: G-BRLNYVV46F */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BRLNYVV46F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BRLNYVV46F');
          `}
        </Script>
      </body>
    </html>
  )
}
