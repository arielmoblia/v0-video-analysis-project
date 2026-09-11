"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { LogOut, Lock } from "lucide-react"
import type { Store } from "@/lib/store-context"
import { ProductsManager } from "./products-manager"
import { CategoriesManager } from "./categories-manager"
import { OrdersManager } from "./orders-manager"
import { StoreSettings } from "./store-settings"
import { PaymentsManager } from "./payments-manager"
import { ShippingManager } from "./shipping-manager"
import { PlansManager } from "./plans-manager"
import { CustomVariantsManager } from "./custom-variants-manager"
import { MarketingManager } from "./marketing-manager"
import { SEOManager } from "./seo-manager"
import { DolarManager } from "./dolar-manager"
import { CsvImporter } from "./csv-importer"
import { StatsManager } from "./stats-manager"
import { ContactManager } from "./contact-manager"
import { DropshipManager } from "./dropship-manager"
import { LinkedStoreManager } from "./linked-store-manager"
import { AdminChat } from "./admin-chat"
import { InvoicingManager } from "./invoicing-manager"

// Prueba aislada: solo esta tienda tiene el asistente de chat en el admin
const ADMIN_CHAT_SUBDOMAINS = ["prueba3"]

const FEATURE_NAMES: Record<string, string> = {
  store_stats: "Estadísticas",
  seo_profesional: "SEO profesional",
  custom_variants: "Variedades",
  multi_images: "Galería de imágenes",
  dolar_peso: "Dólar / Peso",
  unlimited_products: "Productos ilimitados",
  csv_import: "Importar CSV",
  lupa: "Lupa",
  whatsapp_chat: "WhatsApp",
  dropshipping: "Dropshipping",
  mayorista_minorista: "Mayorista / Minorista",
}

const FEATURE_TAB: Record<string, string> = {
  store_stats: "stats",
  seo_profesional: "seo",
  custom_variants: "variants",
  multi_images: "products",
  dolar_peso: "dolar",
  unlimited_products: "products",
  csv_import: "csv",
  lupa: "lupa",
  whatsapp_chat: "whatsapp",
  dropshipping: "dropship",
  mayorista_minorista: "mayorista",
}

const COMING_SOON_LIST = ["Chat con AI", "Dominio propio", "Video de portada", "Quitar tol.ar", "Mayoristas"]

interface AdminDashboardProps {
  store: Store
  subdomain: string
}

export function AdminDashboard({ store, subdomain }: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("settings")
  const [plansTab, setPlansTab] = useState("cositas")
  const [purchasedFeatures, setPurchasedFeatures] = useState<string[]>([])
  const [trialFeatures, setTrialFeatures] = useState<{ code: string; daysLeft: number }[]>([])
  const [customVariants, setCustomVariants] = useState<{ name: string; options: string[] }[]>([])

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const featuresRes = await fetch(`/api/admin/store-features?storeId=${store.id}`)
        if (featuresRes.ok) {
          const data = await featuresRes.json()
          setPurchasedFeatures(data.features || [])
          if (data.trials) setTrialFeatures(data.trials)
        }
        const variantsRes = await fetch(`/api/admin/custom-variants?storeId=${store.id}`)
        if (variantsRes.ok) {
          const data = await variantsRes.json()
          const variants = (data.variant_types || []).map((vt: { id: string; name: string; options: { id: string; name: string }[] }) => ({
            name: vt.name,
            options: vt.options.map((o: { name: string }) => o.name)
          }))
          setCustomVariants(variants)
        }
      } catch {}
    }
    loadFeatures()
  }, [store.id])

  useEffect(() => {
    const updateActivity = async () => {
      try {
        await fetch("/api/admin/track-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeId: store.id }),
        })
      } catch {}
    }
    updateActivity()
  }, [store.id])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subdomain }),
    })
    router.refresh()
  }

  const trialCodes = trialFeatures.map(t => t.code)
  const cositaCodes = Object.keys(FEATURE_NAMES).filter(code =>
    code !== "dropshipping" || store.is_dropship
  )
  const activeCositas = cositaCodes.filter(code =>
    purchasedFeatures.includes(code) && !trialCodes.includes(code)
  )
  const availableCositas = cositaCodes.filter(code =>
    !purchasedFeatures.includes(code) && !trialCodes.includes(code)
  )

  const sectionLabel = (text: string, color: string) => (
    <p className={`text-[10px] font-medium uppercase tracking-widest px-3 mb-1 mt-1 ${color}`}>{text}</p>
  )

  const navGratis = (tab: string, label: string) => (
    <div
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors ${
        activeTab === tab ? "bg-white border border-neutral-200 font-medium text-neutral-900" : "text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {label}
    </div>
  )

  const navActive = (tab: string, label: string) => (
    <div
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors border border-green-200 bg-green-50 ${
        activeTab === tab ? "ring-1 ring-green-400" : "hover:bg-green-100"
      }`}
    >
      <span className="text-green-800 font-medium">{label}</span>
    </div>
  )

  const navTrial = (tab: string, label: string, daysLeft: number) => (
    <div
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors border border-orange-200 bg-orange-50 ${
        activeTab === tab ? "ring-1 ring-orange-400" : "hover:bg-orange-100"
      }`}
    >
      <span className="text-orange-800 font-medium">{label}</span>
      <span className="text-xs text-orange-600">{daysLeft}d</span>
    </div>
  )

  const navLocked = (label: string) => (
    <div
      key={label}
      onClick={() => setActiveTab("plans")}
      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors hover:bg-neutral-200"
    >
      <span className="text-neutral-500">{label}</span>
      <Lock className="w-3 h-3 text-neutral-400" />
    </div>
  )

  const navSoon = (label: string) => (
    <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-0.5 opacity-40 cursor-default">
      <span className="text-neutral-400 text-xs">{label}</span>
      <span className="text-[10px] text-neutral-400 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">pronto</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-black text-white flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-light tracking-widest uppercase">{store.site_title}</h1>
            <p className="text-xs text-neutral-400">Panel de Administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={`/tienda/${subdomain}`} target="_blank" className="text-sm text-neutral-300 hover:text-white" rel="noreferrer">
              Ver tienda →
            </a>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-neutral-600 text-white hover:bg-neutral-800 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-52 bg-neutral-100 border-r border-neutral-200 flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-neutral-200">
            <p className="font-medium text-sm text-neutral-900 truncate">{store.site_title}</p>
            <p className="text-xs text-neutral-500">{subdomain}.tol.ar</p>
          </div>

          <div className="p-2 pt-3">
            {sectionLabel("Plan gratis", "text-neutral-400")}
            {navGratis("settings", "Ajustes")}
            {navGratis("categories", "Categoría")}
            {navGratis("products", "Productos")}
            {navGratis("payments", "Pagos")}
            {navGratis("shipping", "Envíos")}
            {navGratis("orders", "Pedidos")}
            {navGratis("contacto", "Contacto")}
            {navGratis("marketing", "Marketing")}
            {navGratis("facturacion", "Facturación electrónica")}
          </div>

          <div className="px-2 pb-2 border-t border-neutral-200 pt-3">
            {sectionLabel("Plan Cositas", "text-orange-500")}
            <div
              onClick={() => { setActiveTab("plans"); setPlansTab("cositas") }}
              className={`flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer mb-0.5 transition-colors font-medium ${
                activeTab === "plans" && plansTab === "cositas" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              ✦ Todas las Cositas
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL || "https://tol.ar"}/cositas`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-xs text-orange-500 hover:text-orange-600 hover:underline px-3 pb-1"
            >
              Leer más →
            </a>
            <div
              onClick={() => { setActiveTab("plans"); setPlansTab("modelos") }}
              className={`flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer mt-1 transition-colors font-medium ${
                activeTab === "plans" && plansTab === "modelos" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              ✦ Modelos/Templates
            </div>
          </div>

          {activeCositas.length > 0 && (
            <div className="px-2 pb-1 border-t border-neutral-200 pt-2">
              {sectionLabel("Cositas activas", "text-green-700")}
              {activeCositas.map(code => navActive(FEATURE_TAB[code], FEATURE_NAMES[code]))}
            </div>
          )}

          {trialFeatures.length > 0 && (
            <div className="px-2 pb-1 border-t border-neutral-200 pt-2">
              {sectionLabel("En prueba", "text-orange-600")}
              {trialFeatures.map(t => navTrial(FEATURE_TAB[t.code] || t.code, FEATURE_NAMES[t.code] || t.code, t.daysLeft))}
            </div>
          )}

          {availableCositas.length > 0 && (
            <div className="px-2 pb-1 border-t border-neutral-200 pt-2">
              {sectionLabel("Disponibles", "text-neutral-500")}
              {availableCositas.map(code => navLocked(FEATURE_NAMES[code]))}
            </div>
          )}

          <div className="px-2 pb-2 border-t border-neutral-200 pt-2">
            {sectionLabel("Próximamente", "text-neutral-400")}
            {COMING_SOON_LIST
              .filter(name => !(name === "Chat con AI" && ADMIN_CHAT_SUBDOMAINS.includes(subdomain)))
              .map(name => navSoon(name))}
          </div>

          <div className="px-2 pb-3 border-t border-neutral-200 pt-2">
            {sectionLabel("Otros planes", "text-neutral-400")}
            {navSoon("Plan Socio")}
            {navSoon("Plan Mayorista")}
            {navSoon("Plan a Medida")}
          </div>


        </aside>

        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {store.is_dropship && (
              <TabsContent value="dropship">
                <DropshipManager
                  storeId={store.id}
                  subdomain={subdomain}
                  sourceUrl={store.source_url || null}
                  markupPercent={store.markup_percent || 0}
                  onActivate={() => setActiveTab("plans")}
                  isUnlocked={purchasedFeatures.includes("dropshipping")}
                />
              </TabsContent>
            )}

            <TabsContent value="categories">
              <CategoriesManager storeId={store.id} />
            </TabsContent>

            {(store.template === "variants" || purchasedFeatures.includes("custom_variants")) && (
              <TabsContent value="variants">
                <CustomVariantsManager storeId={store.id} />
              </TabsContent>
            )}

            <TabsContent value="products">
              <ProductsManager
                storeId={store.id}
                template={store.template || subdomain}
                customVariants={customVariants}
                hasCustomVariantsFeature={purchasedFeatures.includes("custom_variants") || store.template === "variants"}
                hasMultiImagesFeature={purchasedFeatures.includes("multi_images")}
                hasUnlimitedProducts={true}
                onActivatePlans={() => setActiveTab("plans")}
              />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersManager
                storeId={store.id}
                storeName={store.site_title}
                isDropship={store.is_dropship || false}
                sourceUrl={store.source_url || null}
                subdomain={subdomain}
              />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsManager storeId={store.id} />
            </TabsContent>

            <TabsContent value="shipping">
              <ShippingManager storeId={store.id} />
            </TabsContent>

            <TabsContent value="stats">
              <StatsManager storeId={store.id} onActivate={() => setActiveTab("plans")} isUnlocked={purchasedFeatures.includes("store_stats")} />
            </TabsContent>

            <TabsContent value="marketing">
              <MarketingManager storeId={store.id} subdomain={subdomain} />
            </TabsContent>

            <TabsContent value="csv">
              {purchasedFeatures.includes("csv_import") && (
                <CsvImporter storeId={store.id} onClose={() => setActiveTab("products")} />
              )}
            </TabsContent>

            <TabsContent value="dolar">
              {purchasedFeatures.includes("dolar_peso") && (
                <DolarManager storeId={store.id} />
              )}
            </TabsContent>

            <TabsContent value="mayorista">
              {purchasedFeatures.includes("mayorista_minorista") && (
                <LinkedStoreManager
                  storeId={store.id}
                  initialUrl={store.linked_store_url}
                  initialLabel={store.linked_store_label}
                />
              )}
            </TabsContent>

            <TabsContent value="seo">
              <SEOManager storeId={store.id} subdomain={subdomain} storeName={store.site_title} onActivate={() => setActiveTab("plans")} isUnlocked={purchasedFeatures.includes("seo_profesional")} />
            </TabsContent>

            <TabsContent value="contacto">
              <ContactManager storeId={store.id} subdomain={subdomain} storeName={store.site_title} />
            </TabsContent>

            {purchasedFeatures.includes("whatsapp_chat") && (
              <TabsContent value="whatsapp">
                <ContactManager storeId={store.id} subdomain={subdomain} storeName={store.site_title} defaultSection="whatsapp" />
              </TabsContent>
            )}

            <TabsContent value="settings">
              <StoreSettings store={store} />
            </TabsContent>

            <TabsContent value="facturacion">
              <InvoicingManager storeId={store.id} subdomain={subdomain} />
            </TabsContent>

            <TabsContent value="plans">
              <PlansManager
                storeId={store.id}
                storeName={store.site_title}
                initialCustomDomain={store.custom_domain}
                initialLinkedStoreUrl={store.linked_store_url}
                initialLinkedStoreLabel={store.linked_store_label}
                initialActiveTheme={store.plan_features?.active_theme || null}
                purchasedFeatures={purchasedFeatures}
                onFeaturePurchased={(code) => setPurchasedFeatures([...purchasedFeatures, code])}
                activeTab={plansTab}
                onActiveTabChange={setPlansTab}
              />
              {(purchasedFeatures.includes("custom_variants") || store.template === "variants") && (
                <div className="mt-8">
                  <CustomVariantsManager storeId={store.id} />
                </div>
              )}
            </TabsContent>

            {purchasedFeatures.includes("lupa") && (
              <TabsContent value="lupa">
                <iframe
                  src={`https://lupa.tol.ar?store=${subdomain}`}
                  style={{ width: "100%", height: "80vh", border: "none", borderRadius: "8px" }}
                />
              </TabsContent>
            )}
          </Tabs>
        </main>
      </div>

      {ADMIN_CHAT_SUBDOMAINS.includes(subdomain) && (
        <AdminChat storeName={store.site_title} subdomain={subdomain} />
      )}
    </div>
  )
}
