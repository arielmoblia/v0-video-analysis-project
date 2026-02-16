"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, FolderOpen, ShoppingCart, Settings, LogOut, CreditCard, Truck, Sparkles, Megaphone, Wand2, Search, BarChart3, MessageSquare, Crown, Palette, ChevronDown } from "lucide-react"
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
import { StatsManager } from "./stats-manager"
import { ContactManager } from "./contact-manager"

interface AdminDashboardProps {
  store: Store
  subdomain: string
}

export function AdminDashboard({ store, subdomain }: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("settings")
  const [purchasedFeatures, setPurchasedFeatures] = useState<string[]>([])
  const [customVariants, setCustomVariants] = useState<{ name: string; options: string[] }[]>([])

  // Cargar features compradas y variantes personalizadas
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        // Cargar features compradas
        const featuresRes = await fetch(`/api/admin/store-features?storeId=${store.id}`)
        if (featuresRes.ok) {
          const data = await featuresRes.json()
          setPurchasedFeatures(data.features || [])
        }
        
        // Cargar variantes personalizadas
        const variantsRes = await fetch(`/api/admin/custom-variants?storeId=${store.id}`)
        if (variantsRes.ok) {
          const data = await variantsRes.json()
          // Transformar variant_types a formato { name, options }[]
          const variants = (data.variant_types || []).map((vt: { id: string; name: string; options: { id: string; name: string }[] }) => ({
            name: vt.name,
            options: vt.options.map(o => o.name)
          }))
          setCustomVariants(variants)
        }
      } catch (error) {
        // Silenciar error
      }
    }
    loadFeatures()
  }, [store.id])

  // Registrar actividad cuando el usuario entra al admin
  // Esto reinicia el contador de 7 dias del trial
  useEffect(() => {
    const updateActivity = async () => {
      try {
        await fetch("/api/admin/track-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeId: store.id }),
        })
      } catch (error) {
        // Silenciar error - no es critico
      }
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light tracking-widest uppercase">{store.site_title}</h1>
            <p className="text-xs text-neutral-400">Panel de Administración</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`/tienda/${subdomain}`}
              target="_blank"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
              rel="noreferrer"
            >
              Ver tienda →
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-neutral-600 text-white hover:bg-neutral-800 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8">
            <TabsList className="flex flex-wrap gap-1">
              {/* Grupo 1: Configuracion - Slate */}
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-700">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Ajustes</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-700">
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Categorias</span>
              </TabsTrigger>

              {/* Productos con dropdown de Variantes */}
              {(store.template === "variants" || purchasedFeatures.includes("custom_variants")) ? (
                <div className="relative group">
                  <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-700">
                    <Package className="w-4 h-4" />
                    <span className="hidden sm:inline">Productos</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </TabsTrigger>
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => setActiveTab("products")}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 rounded-t-lg transition-colors ${activeTab === "products" ? "text-slate-900 font-medium bg-slate-50" : "text-slate-600"}`}
                    >
                      <Package className="w-4 h-4" />
                      Productos
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("variants")}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 rounded-b-lg transition-colors border-t border-slate-100 ${activeTab === "variants" ? "text-slate-900 font-medium bg-slate-50" : "text-slate-600"}`}
                    >
                      <Palette className="w-4 h-4" />
                      Variantes
                    </button>
                  </div>
                </div>
              ) : (
                <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-700">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Productos</span>
                </TabsTrigger>
              )}

              {/* Separador visual */}
              <span className="w-px h-6 bg-slate-200 mx-1 self-center" />

              {/* Grupo 2: Ventas - Emerald */}
              <TabsTrigger value="payments" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Pagos</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700">
                <Truck className="w-4 h-4" />
                <span className="hidden sm:inline">Envios</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>

              {/* Separador visual */}
              <span className="w-px h-6 bg-slate-200 mx-1 self-center" />

              {/* Grupo 3: Crecimiento - Blue */}
              <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-600">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Estadisticas</span>
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-600">
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">Marketing</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-600">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">SEO</span>
              </TabsTrigger>

              {/* Separador visual */}
              <span className="w-px h-6 bg-slate-200 mx-1 self-center" />

              {/* Contacto con dropdown de WhatsApp */}
              {purchasedFeatures.includes("whatsapp_chat") ? (
                <div className="relative group">
                  <TabsTrigger value="contacto" className="flex items-center gap-2 data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Contacto</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </TabsTrigger>
                  <div className="absolute top-full right-0 mt-1 bg-white border border-rose-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => setActiveTab("contacto")}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-rose-50 rounded-t-lg transition-colors ${activeTab === "contacto" ? "text-rose-700 font-medium bg-rose-50" : "text-slate-600"}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contacto
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("whatsapp")}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-rose-50 rounded-b-lg transition-colors border-t border-rose-100 ${activeTab === "whatsapp" ? "text-rose-700 font-medium bg-rose-50" : "text-slate-600"}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <TabsTrigger value="contacto" className="flex items-center gap-2 data-[state=active]:bg-rose-600 data-[state=active]:text-white text-rose-600">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Contacto</span>
                </TabsTrigger>
              )}

              {/* Separador visual */}
              <span className="w-px h-6 bg-slate-200 mx-1 self-center" />

              {/* Grupo 5: Premium - Orange */}
              <TabsTrigger value="plans" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-500">
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Cositas</span>
              </TabsTrigger>
            </TabsList>
          </div>

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
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager storeId={store.id} storeName={store.site_title} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsManager storeId={store.id} />
          </TabsContent>

          <TabsContent value="shipping">
            <ShippingManager storeId={store.id} />
          </TabsContent>

          <TabsContent value="stats">
            <StatsManager storeId={store.id} />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingManager storeId={store.id} subdomain={subdomain} />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager storeId={store.id} subdomain={subdomain} storeName={store.site_title} />
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

          <TabsContent value="plans">
            <PlansManager 
              storeId={store.id} 
              storeName={store.site_title}
              purchasedFeatures={purchasedFeatures}
              onFeaturePurchased={(code) => setPurchasedFeatures([...purchasedFeatures, code])}
            />
            
            {/* Mostrar configurador de variantes si compraron la feature O si tienen template "variants" */}
            {(purchasedFeatures.includes("custom_variants") || store.template === "variants") && (
              <div className="mt-8">
                <CustomVariantsManager storeId={store.id} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
