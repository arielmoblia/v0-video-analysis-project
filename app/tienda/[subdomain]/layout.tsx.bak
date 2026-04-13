import type React from "react"
import { CartProvider } from "@/components/store/cart-provider"
import { PageTracker } from "@/components/store/page-tracker"
import { TrackingPixels } from "@/components/store/tracking-pixels"
import { WhatsAppButton } from "@/components/store/whatsapp-button"
import { getStoreBySubdomain, getStorePurchasedFeatures } from "@/lib/store-context"

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ subdomain: string }>
}) {
  const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain)

  // Obtener pixels y verificacion de dominio
  const pixels = store?.marketing_settings?.pixels || {}
  const verification = store?.marketing_settings?.verification || {}
  
  // Verificar si tiene la feature de WhatsApp
  const purchasedFeatures = store ? await getStorePurchasedFeatures(store.id) : []
  const hasWhatsAppFeature = purchasedFeatures.includes("whatsapp_chat")
  const whatsappNumber = store?.social_whatsapp || store?.whatsapp_number

  return (
    <CartProvider>
      {store && <PageTracker storeId={store.id} />}
      <TrackingPixels
        metaPixelId={pixels.meta_pixel_id}
        tiktokPixelId={pixels.tiktok_pixel_id}
        googleAnalyticsId={pixels.google_analytics_id}
        domainVerificationMeta={verification.meta_domain}
        domainVerificationGoogle={verification.google_site}
      />
      {children}
      {hasWhatsAppFeature && whatsappNumber && (
        <WhatsAppButton phoneNumber={whatsappNumber} storeName={store?.site_title} />
      )}
    </CartProvider>
  )
}
