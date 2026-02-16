"use client"

import Script from "next/script"
import { useEffect } from "react"

interface TrackingPixelsProps {
  metaPixelId?: string
  tiktokPixelId?: string
  googleAnalyticsId?: string
  domainVerificationMeta?: string
  domainVerificationGoogle?: string
}

// Helper global para disparar eventos desde cualquier componente
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    gtag: (...args: unknown[]) => void
    ttq: { track: (...args: unknown[]) => void }
    trackEvent: (eventName: string, data?: Record<string, unknown>) => void
  }
}

export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.trackEvent) {
    window.trackEvent(eventName, data)
  }
}

export function TrackingPixels({ metaPixelId, tiktokPixelId, googleAnalyticsId, domainVerificationMeta, domainVerificationGoogle }: TrackingPixelsProps) {
  // Registrar funcion global para disparar eventos
  useEffect(() => {
    window.trackEvent = (eventName: string, data?: Record<string, unknown>) => {
      // Meta Pixel events
      if (metaPixelId && window.fbq) {
        if (eventName === "ViewContent") {
          window.fbq("track", "ViewContent", {
            content_name: data?.name,
            content_ids: [data?.id],
            content_type: "product",
            value: data?.price,
            currency: "ARS",
          })
        } else if (eventName === "AddToCart") {
          window.fbq("track", "AddToCart", {
            content_name: data?.name,
            content_ids: [data?.id],
            content_type: "product",
            value: data?.price,
            currency: "ARS",
          })
        } else if (eventName === "Purchase") {
          window.fbq("track", "Purchase", {
            content_ids: data?.productIds,
            content_type: "product",
            value: data?.total,
            currency: "ARS",
            num_items: data?.numItems,
          })
        }
      }

      // Google Analytics events
      if (googleAnalyticsId && window.gtag) {
        if (eventName === "ViewContent") {
          window.gtag("event", "view_item", {
            items: [{ item_id: data?.id, item_name: data?.name, price: data?.price }],
          })
        } else if (eventName === "AddToCart") {
          window.gtag("event", "add_to_cart", {
            items: [{ item_id: data?.id, item_name: data?.name, price: data?.price, quantity: 1 }],
          })
        } else if (eventName === "Purchase") {
          window.gtag("event", "purchase", {
            transaction_id: data?.orderId,
            value: data?.total,
            currency: "ARS",
            items: data?.items,
          })
        }
      }

      // TikTok Pixel events
      if (tiktokPixelId && window.ttq) {
        if (eventName === "ViewContent") {
          window.ttq.track("ViewContent", {
            content_id: data?.id,
            content_name: data?.name,
            value: data?.price,
            currency: "ARS",
          })
        } else if (eventName === "AddToCart") {
          window.ttq.track("AddToCart", {
            content_id: data?.id,
            content_name: data?.name,
            value: data?.price,
            currency: "ARS",
          })
        } else if (eventName === "Purchase") {
          window.ttq.track("CompletePayment", {
            value: data?.total,
            currency: "ARS",
          })
        }
      }

      // CAPI server-side (funciona aunque haya AdBlock)
      if (data?.storeId) {
        fetch("/api/capi/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventName, data, metaPixelId, googleAnalyticsId }),
        }).catch(() => {})
      }
    }
  }, [metaPixelId, tiktokPixelId, googleAnalyticsId])

  return (
    <>
      {/* Verificacion de dominio Meta */}
      {domainVerificationMeta && (
        <meta name="facebook-domain-verification" content={domainVerificationMeta} />
      )}
      {/* Verificacion de dominio Google */}
      {domainVerificationGoogle && (
        <meta name="google-site-verification" content={domainVerificationGoogle} />
      )}

      {/* Meta Pixel (Facebook) */}
      {metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* TikTok Pixel */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  )
}
