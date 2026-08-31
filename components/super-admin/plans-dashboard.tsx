"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Users, ShoppingBag, CreditCard, TrendingUp, Clock, Star, Package } from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface StoreData {
  id: string
  subdomain: string
  email: string
  plan: string
  created_at: string
  last_login?: string
  site_title: string
}

interface PlansDashboardProps {
  stores: StoreData[]
}

export function PlansDashboard({ stores }: PlansDashboardProps) {
  const [activeTab, setActiveTab] = useState("gratis")
  const [sortField, setSortField] = useState<string>("subdomain")
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc")
  const [cositasSubTab, setCositasSubTab] = useState("estadisticas")
  const [catalogChanges, setCatalogChanges] = useState<Record<string, {precio?: number, trial_days?: number}>>({})
  const [savingCatalog, setSavingCatalog] = useState(false)
  const [featureTrialDays, setFeatureTrialDays] = useState<Record<string, number>>({})
  const [catalogFeatures, setCatalogFeatures] = useState<any[]>([])
  const [sociosSubTab, setSociosSubTab] = useState("estadisticas")
  const [pageContent, setPageContent] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)
  const [storesWithProducts, setStoresWithProducts] = useState<Set<string>>(new Set())
  const [productCount, setProductCount] = useState<Record<string, number>>({})
  const [storeViews, setStoreViews] = useState<Record<string, number>>({})
  const [orderCount, setOrderCount] = useState<Record<string, number>>({})
  const [orderPaid, setOrderPaid] = useState<Record<string, number>>({})
  const [viewsDays, setViewsDays] = useState(7)
  const [storesWithMP, setStoresWithMP] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [cositasPorTienda, setCositasPorTienda] = useState<Record<string, any[]>>({})

  const freeStores = stores.filter(s => !s.plan || s.plan === "free" || s.plan === "gratis")
  const cositas = stores.filter(s => s.plan === "cositas")
  const socios = stores.filter(s => s.plan === "socios")

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  useEffect(() => {
    async function fetchExtra() {
      setLoading(true)
      // Tiendas con productos
      const { data: products } = await supabase
        .from("products")
        .select("store_id")
        .limit(500000)
      if (products) {
        setStoresWithProducts(new Set(products.map((p: any) => p.store_id)))
        const counts: Record<string, number> = {}
        products.forEach((p: any) => { counts[p.store_id] = (counts[p.store_id] || 0) + 1 })
        setProductCount(counts)
      }

      // Tiendas con MercadoPago
      const { data: payments } = await supabase
        .from("payment_methods")
        .select("store_id, provider")
        .eq("provider", "mercadopago")
      if (payments) {
        setStoresWithMP(new Set(payments.map((p: any) => p.store_id)))
      }
      // Cositas por tienda
      const { data: cositas } = await supabase
        .from('store_purchased_features')
        .select('store_id, feature_code, is_active, is_gifted')
      if (cositas) {
        const grouped: Record<string, any[]> = {}
        cositas.forEach((c: any) => {
          if (!grouped[c.store_id]) grouped[c.store_id] = []
          grouped[c.store_id].push(c)
        })
        setCositasPorTienda(grouped)
      }
      // Pedidos por tienda
      const { data: orders } = await supabase
        .from("orders")
        .select("store_id, status")
        .limit(500000)
      if (orders) {
        const oc: Record<string, number> = {}
        const op: Record<string, number> = {}
        orders.forEach((o: any) => {
          oc[o.store_id] = (oc[o.store_id] || 0) + 1
          if (o.status === "pagado") op[o.store_id] = (op[o.store_id] || 0) + 1
        })
        setOrderCount(oc)
        setOrderPaid(op)
      }
      // Visitas por tienda via API (excluye IP del dueño, últimos 7 días)
      const viewsRes = await fetch('/api/super-admin/stores-activity')
      if (viewsRes.ok) {
        const viewsData = await viewsRes.json()
        setStoreViews(viewsData)
      }
      // Contenido de la pagina publica
      const { data: pageData } = await supabase
        .from('page_content')
        .select('key, value')
        .eq('page', 'plan-cositas')
      if (pageData) {
        const map: Record<string, string> = {}
        pageData.forEach((r: any) => { map[r.key] = r.value })
        setPageContent(map)
      }
      // Features desde Supabase (fuente de verdad)
      const { data: featuresData } = await supabase
        .from('store_features')
        .select('*')
        .order('is_active', { ascending: false })
        .order('created_at', { ascending: true })
      if (featuresData) {
        const trialMap: Record<string, number> = {}
        featuresData.forEach((f: any) => { trialMap[f.code] = f.trial_days || 0 })
        setFeatureTrialDays(trialMap)
        setCatalogFeatures(featuresData)
      }
      setLoading(false)
    }
    fetchExtra()
  }, [])

  useEffect(() => {
    fetch(`/api/super-admin/stores-activity?days=${viewsDays}`)
      .then(r => r.json())
      .then(data => setStoreViews(data))
  }, [viewsDays])

  const activeFreestores = freeStores.filter(s => s.last_login && new Date(s.last_login) > thirtyDaysAgo)
  const dormidas = freeStores.filter(s => !s.last_login || new Date(s.last_login) <= thirtyDaysAgo)
  const conProductos = freeStores.filter(s => storesWithProducts.has(s.id))
  const conMP = freeStores.filter(s => storesWithMP.has(s.id))
  const candidatas = freeStores.filter(s => storesWithProducts.has(s.id) && storesWithMP.has(s.id))
  const allCositas = Object.values(cositasPorTienda).flat()
  const totalCositasVendidas = allCositas.filter((c) => !c.is_gifted).length
  const totalCositasActivas = allCositas.filter((c) => c.is_active).length
  const totalCositasRegaladas = allCositas.filter((c) => c.is_gifted).length

  const tabs = [
    { id: "gratis", label: `PLAN GRATIS (${freeStores.length})` },
    { id: "cositas", label: `PLAN COSITAS (${cositas.length})` },
    { id: "socios", label: `PLAN SOCIOS (${socios.length})` },
    { id: "mayorista", label: "PLAN MAYORISTA" },
  ]

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            } ${tab.id === "mayorista" ? "text-slate-400 cursor-default" : ""}`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto pb-2">
          <button onClick={() => window.open('https://claude.ai/chat/ff4fd46a-f313-41ea-83a0-681484cd18d1', '_blank')} className="inline-flex items-center gap-2 px-3 h-7 rounded-md text-xs font-medium text-white cursor-pointer border-0" style={{ backgroundColor: '#1a7f5a' }}>
            💬 Hablar con Claudio
          </button>
        </div>
      </div>

      {/* PLAN GRATIS */}
      {activeTab === "gratis" && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando estadísticas...</div>
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard icon={<Users className="w-5 h-5" />} label="Total gratis" value={freeStores.length} color="slate" />
                <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Activas (30d)" value={activeFreestores.length} color="green" />
                <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Con productos" value={conProductos.length} color="blue" />
                <StatCard icon={<CreditCard className="w-5 h-5" />} label="Con MercadoPago" value={conMP.length} color="indigo" />
                <StatCard icon={<Clock className="w-5 h-5" />} label="Dormidas" value={dormidas.length} color="red" />
                <StatCard icon={<Star className="w-5 h-5" />} label="Candidatas" value={candidatas.length} color="orange" />
              </div>

              {/* Candidatas a convertir */}
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold text-slate-800">Candidatas a convertir</h3>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-2">
                    Tienen productos + MercadoPago configurado
                  </span>
                </div>
                {candidatas.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">No hay candidatas por ahora</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left text-slate-500 text-xs uppercase">
                        <th className="px-6 py-3">Tienda</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Creada</th>
                        <th className="px-6 py-3">Último ingreso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidatas.map(s => (
                        <tr key={s.id} className="hover:bg-orange-50 transition-colors">
                          <td className="px-6 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold bg-slate-100 text-slate-600">
                            {storeViews[s.id] || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-800">
                          <a href={`https://${s.subdomain}.tol.ar`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline flex items-center gap-1">
                            {s.subdomain}.tol.ar
                            <span className="text-slate-300 text-xs">↗</span>
                          </a>
                        </td>
                          <td className="px-6 py-3 text-slate-500">{s.email}</td>
                          <td className="px-6 py-3 text-slate-400">{new Date(s.created_at).toLocaleDateString("es-AR")}</td>
                          <td className="px-6 py-3 text-slate-400">{s.last_login ? new Date(s.last_login).toLocaleDateString("es-AR") : "Nunca"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Todas las gratis */}
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Todas las tiendas en Plan Gratis</h3>
                  <div className="flex gap-1">
                    {[{d:7,l:"7D"},{d:30,l:"1M"},{d:180,l:"6M"},{d:365,l:"1A"}].map(p => (
                      <button key={p.d} onClick={() => setViewsDays(p.d)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${viewsDays === p.d ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-auto max-h-[600px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 text-left text-slate-500 text-xs uppercase">
                      {[
                        { key: "ranking", label: "Ranking" },
                        { key: "subdomain", label: "Tienda" },
                        { key: "email", label: "Email" },
                        { key: "productos", label: "Prod." },
                        { key: "mp", label: "MP" },
                        { key: "last_login", label: "Última entrada" },
                      ].map(col => (
                        <th key={col.key} className="px-2 py-2 cursor-pointer select-none hover:text-slate-800 hover:bg-slate-100 transition-colors" onClick={() => { if (sortField === col.key) { setSortDir(sortDir === "asc" ? "desc" : "asc") } else { setSortField(col.key); setSortDir("asc") } }}>
                          <span className="flex items-center gap-1">
                            {col.label}
                            {sortField === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
                          </span>
                        </th>
                      ))}
                      <th colSpan={3} className="px-2 py-2 text-center border-l border-slate-200">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Ventas</span>
                      </th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-400 text-xs uppercase border-t border-slate-100">
                      <th colSpan={6}></th>
                      {[{key:"ventas_pend",label:"Pendiente"},{key:"ventas_pag",label:"Pagado"},{key:"ventas",label:"Total"}].map(col => (
                        <th key={col.key} className="px-2 py-1 text-center cursor-pointer hover:text-slate-800 hover:bg-slate-100 border-l border-slate-200 first:border-l-0" onClick={() => { if (sortField === col.key) { setSortDir(sortDir === "asc" ? "desc" : "asc") } else { setSortField(col.key); setSortDir("asc") } }}>
                          {col.label}{sortField === col.key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...freeStores].sort((a, b) => {
                      let va: any, vb: any
                      if (sortField === "subdomain") { va = a.subdomain || ""; vb = b.subdomain || "" }
                      else if (sortField === "email") { va = a.email || ""; vb = b.email || "" }
                      else if (sortField === "ranking") { va = storeViews[a.id] || 0; vb = storeViews[b.id] || 0 }
                      else if (sortField === "productos") { va = storesWithProducts.has(a.id) ? 1 : 0; vb = storesWithProducts.has(b.id) ? 1 : 0 }
                      else if (sortField === "ventas") { va = orderCount[a.id] || 0; vb = orderCount[b.id] || 0 }
                      else if (sortField === "ventas_pag") { va = orderPaid[a.id] || 0; vb = orderPaid[b.id] || 0 }
                      else if (sortField === "ventas_pend") { va = (orderCount[a.id]||0)-(orderPaid[a.id]||0); vb = (orderCount[b.id]||0)-(orderPaid[b.id]||0) }
                      else if (sortField === "mp") { va = storesWithMP.has(a.id) ? 1 : 0; vb = storesWithMP.has(b.id) ? 1 : 0 }
                      else if (sortField === "last_login") { va = a.last_login ? new Date(a.last_login).getTime() : 0; vb = b.last_login ? new Date(b.last_login).getTime() : 0 }
                      if (va < vb) return sortDir === "asc" ? -1 : 1
                      if (va > vb) return sortDir === "asc" ? 1 : -1
                      return 0
                    }).map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold bg-slate-100 text-slate-600">
                            {storeViews[s.id] || 0}
                          </span>
                        </td>
                        <td className="px-2 py-2 font-medium text-slate-800">
                          <a href={`https://${s.subdomain}.tol.ar`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline flex items-center gap-1">
                            {s.subdomain}.tol.ar <span className="text-slate-300 text-xs">↗</span>
                          </a>
                        </td>
                        <td className="px-2 py-2 text-slate-500 text-xs">{s.email}</td>
                        <td className="px-2 py-2 text-center">
                          {productCount[s.id]
                            ? <span className="text-green-600 font-medium text-xs">{productCount[s.id]}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {storesWithMP.has(s.id)
                            ? <span className="text-blue-600 font-medium text-xs">✓</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-2 py-2 text-slate-400 text-xs text-center">
                          {s.last_login ? new Date(s.last_login).toLocaleDateString("es-AR") : "Nunca"}
                        </td>
                        <td className="px-2 py-2 text-center border-l border-slate-100">
                          {(orderCount[s.id]||0)-(orderPaid[s.id]||0) > 0
                            ? <span className="text-orange-500 font-medium text-xs">{(orderCount[s.id]||0)-(orderPaid[s.id]||0)}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {orderPaid[s.id]
                            ? <span className="text-green-600 font-medium text-xs">{orderPaid[s.id]}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {orderCount[s.id]
                            ? <span className="text-purple-600 font-medium text-xs">{orderCount[s.id]}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* PLAN COSITAS */}
      {activeTab === "cositas" && (
        <div className="space-y-6">
          {/* Sub-tabs Cositas */}
          <div className="flex border-b border-slate-200">
            {[
              { id: "estadisticas", label: "ESTADÍSTICAS" },
              { id: "cositas", label: "LISTADO DE COSITAS" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setCositasSubTab(t.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  cositasSubTab === t.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
            <a href="/plan-cositas" className="ml-auto mr-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">🌐 Página Pública</a>
          </div>
          {loading ? (
            <div className="text-center py-12 text-slate-400">Cargando estadísticas...</div>
          ) : cositasSubTab === "estadisticas" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<Package className="w-5 h-5" />} label="Tiendas en Cositas" value={cositas.length} color="orange" />
                <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Cositas vendidas" value={totalCositasVendidas} color="blue" />
                <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Cositas activas" value={totalCositasActivas} color="green" />
                <StatCard icon={<Star className="w-5 h-5" />} label="Cositas regaladas" value={totalCositasRegaladas} color="indigo" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  <h3 className="font-semibold text-slate-800">Tiendas en Plan Cositas</h3>
                </div>
                {cositas.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Aún no hay tiendas en Plan Cositas</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left text-slate-500 text-xs uppercase">
                        <th className="px-6 py-3">Tienda</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Cositas activas</th>
                        <th className="px-6 py-3">Regaladas</th>
                        <th className="px-6 py-3">Desde</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cositas.map(s => {
                        const sCositas = cositasPorTienda[s.id] || []
                        const activas = sCositas.filter((c) => c.is_active).length
                        const regaladas = sCositas.filter((c) => c.is_gifted).length
                        return (
                          <tr key={s.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-3 font-medium text-slate-800">{s.subdomain}.tol.ar</td>
                            <td className="px-6 py-3 text-slate-500">{s.email}</td>
                            <td className="px-6 py-3">
                              <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">{activas} cositas</span>
                            </td>
                            <td className="px-6 py-3">
                              {regaladas > 0 ? <span className="text-indigo-500 text-xs">gift {regaladas}</span> : <span className="text-slate-300">-</span>}
                            </td>
                            <td className="px-6 py-3 text-slate-400">{new Date(s.created_at).toLocaleDateString("es-AR")}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : cositasSubTab === "cositas" ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">Catálogo de Cositas</h3>
                    <p className="text-xs text-slate-400 mt-1">Las cositas disponibles se pueden comprar. Las próximamente están griseadas.</p>
                  </div>
                  <button
                    onClick={async () => {
                      setSavingCatalog(true)
                      for (const [code, changes] of Object.entries(catalogChanges)) {
                        const updates: any = {}
                        if (changes.precio !== undefined) updates.price = changes.precio
                        if (changes.trial_days !== undefined) updates.trial_days = changes.trial_days
                        if (Object.keys(updates).length > 0) {
                          await fetch("/api/super-admin/cositas", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ code, ...updates })
                          })
                        }
                      }
                      setCatalogChanges({})
                      setSavingCatalog(false)
                      alert("Guardado!")
                    }}
                    disabled={savingCatalog || Object.keys(catalogChanges).length === 0}
                    className="text-sm font-semibold px-4 py-2 rounded-lg border border-orange-400 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {savingCatalog ? "Guardando..." : "GUARDAR"}
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-slate-500 text-xs uppercase">
                      <th className="px-6 py-3">Cosita</th>
                      <th className="px-6 py-3">Código</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Tiendas activas</th>
                      <th className="px-6 py-3">Trial (días)</th>
                      <th className="px-6 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catalogFeatures.map(c => {
                      const activas = Object.values(cositasPorTienda).flat().filter((f: any) => f.feature_code === c.code && f.is_active).length
                      return (
                        <tr key={c.code} className={c.is_active ? "hover:bg-orange-50" : "opacity-50 bg-slate-50"}>
                          <td className="px-6 py-3">
                            <div className="font-medium text-slate-800">{c.name}</div>
                            <div className="text-xs text-slate-400">{c.description}</div>
                          </td>
                          <td className="px-6 py-3 text-xs font-mono text-slate-400">{c.code}</td>
                          <td className="px-6 py-3"><div className="flex items-center gap-1"><span className="text-slate-400 text-xs">USD</span><input type="number" defaultValue={c.precio} step="0.5" min="0.5" onChange={(e) => setCatalogChanges(prev => ({...prev, [c.code]: {...(prev[c.code]||{}), precio: parseFloat(e.target.value)}}))} className="w-16 text-sm border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-orange-400" /><span className="text-slate-400 text-xs"></span></div></td>
                          <td className="px-6 py-3">
                            {activas > 0
                              ? <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">{activas} tiendas</span>
                              : <span className="text-slate-300 text-xs">—</span>}
                          </td>
                          <td className="px-6 py-3">
                            <input type="number" key={`trial-${c.code}-${featureTrialDays[c.code]}`} defaultValue={featureTrialDays[c.code] ?? c.trial_days ?? 0} min="0" max="90" onChange={(e) => setCatalogChanges(prev => ({...prev, [c.code]: {...(prev[c.code]||{}), trial_days: parseInt(e.target.value)}}))} className="w-16 text-sm border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-orange-400" />
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={async () => {
                                const newVal = !c.is_active
                                const { createClient } = await import("@supabase/supabase-js")
                                const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string)
                                await sb.from("store_features").update({ is_active: newVal }).eq("code", c.code)
                                setCatalogFeatures(prev => prev.map(x => x.code === c.code ? {...x, is_active: newVal} : x))
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${c.is_active ? "bg-orange-500" : "bg-slate-300"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${c.is_active ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">✏️</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Edición visual directa</h3>
                <p className="text-sm text-slate-500 mb-6">La página tiene modo edición integrado. Entrá directamente y editá los textos pasando el mouse sobre ellos.</p>
                <a href="/plan-cositas" target="_blank"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                  Ir a tol.ar/plan-cositas →
                </a>
              </div>

            </div>
          )}
        </div>
      )}

      {/* PLAN SOCIOS */}
      {activeTab === "socios" && (
        <div className="space-y-6">
          {/* Sub-tabs Socios */}
          <div className="flex items-center border-b border-slate-200">
            {[
              { id: "estadisticas", label: "ESTADÍSTICAS" },
              { id: "socios", label: "SOCIOS" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSociosSubTab(t.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  sociosSubTab === t.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
            <a href="/plan-socio"
              className="ml-auto mr-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm">
              🌐 Página Pública
            </a>
          </div>

          {/* ESTADÍSTICAS */}
          {sociosSubTab === "estadisticas" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-xs text-blue-400 font-semibold uppercase mb-1">Socios activos</div>
                <div className="text-3xl font-bold text-blue-600">{socios.filter((s: any) => s.plan === "socios").length}</div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="text-xs text-green-400 font-semibold uppercase mb-1">Solicitudes pendientes</div>
                <div className="text-3xl font-bold text-green-600">0</div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="text-xs text-amber-400 font-semibold uppercase mb-1">Ventas del mes</div>
                <div className="text-3xl font-bold text-amber-600">$0</div>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <div className="text-xs text-purple-400 font-semibold uppercase mb-1">Comisiones del mes</div>
                <div className="text-3xl font-bold text-purple-600">$0</div>
              </div>
            </div>
          )}

          {/* SOCIOS */}
          {sociosSubTab === "socios" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">Tiendas en Plan Socio</h3>
                <p className="text-xs text-slate-400 mt-1">Tiendas con comisión sobre ventas. El % es editable por socio.</p>
              </div>
              {socios.filter((s: any) => s.plan === "socios").length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Aún no hay socios activos</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Tienda</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Teléfono</th>
                      <th className="px-4 py-3 text-left">Agente</th>
                      <th className="px-4 py-3 text-right">Ventas/mes</th>
                      <th className="px-4 py-3 text-center">%</th>
                      <th className="px-4 py-3 text-right">Comisión</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-left">Desde</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {socios.filter((s: any) => s.plan === "socios").map((s: any) => {
                      const ventas = s.ventas_mes || 0
                      const pct = s.comision_pct ?? 10
                      const comision = ventas * pct / 100
                      const estado = s.estado_socio || "pendiente"
                      const estadoColor = estado === "activo" ? "bg-green-100 text-green-700" : estado === "suspendido" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-blue-600">{s.subdomain}.tol.ar</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{s.email || "—"}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{s.whatsapp_number || "—"}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{s.agente || "—"}</td>
                          <td className="px-4 py-3 text-right">${ventas.toLocaleString("es-AR")}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              defaultValue={pct}
                              min={1}
                              max={50}
                              onBlur={async (e) => {
                                const val = parseFloat(e.target.value)
                                if (!isNaN(val) && val !== pct) {
                                  await supabase.from("stores").update({ comision_pct: val }).eq("id", s.id)
                                }
                              }}
                              className="w-14 text-center border border-purple-200 rounded-lg px-1 py-1 text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                            <span className="text-xs text-purple-700 font-bold ml-1">%</span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-600">${comision.toLocaleString("es-AR")}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoColor}`}>{estado}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{new Date(s.created_at).toLocaleDateString("es-AR")}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}



        </div>
      )}

      {/* PLAN MAYORISTA */}
      {activeTab === "mayorista" && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Plan Mayorista</h3>
          <span className="inline-block bg-slate-200 text-slate-500 text-sm px-4 py-1 rounded-full">Próximamente</span>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    red: "bg-red-50 border-red-200 text-red-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  }
  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-1 opacity-70">{icon}<span className="text-xs font-medium">{label}</span></div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}
