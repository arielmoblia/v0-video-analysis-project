"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Store,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  ExternalLink,
  Eye,
  LogOut,
  RefreshCw,
  Calendar,
  Globe,
  Trash2,
  CreditCard,
  Truck,
  DollarSign,
  Megaphone,
  Plug,
  Rocket,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Gift,
  X,
  Check,
  Images,
  MessageCircle,
  Palette,
  FileSpreadsheet,
  Mail, // Declared Mail variable
  Search, Wrench, Send, Edit3
} from "lucide-react"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { FeaturesAdmin } from "./features-admin"
import { PlansDashboard } from "./plans-dashboard"
import { EspecialistaDashboard } from "./especialista-dashboard"
import { PaymentsConfig } from "./payments-config"
import { PlatformMarketing } from "./platform-marketing"
import { IntegracionesManager } from "./integraciones-manager"
import { SeoModule } from "./seo-module"
import { CoreManager } from "./core-manager"
import { TemplateManager } from "./template-manager"
import { PromoMail } from "./promo-mail"
import { PaisDominio } from "./pais-dominio"
import { ScraperAdmin } from "./scraper-admin"
import { MenoresManager } from "./menores-manager"

interface StoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  status: string
  template: string
  plan: string
  created_at: string
  last_login?: string
  admin_password?: string
  last_activity_at?: string
  whatsapp_number?: string
  phone?: string
}

interface DeletedStoreData {
  id: string
  username: string
  email: string
  subdomain: string
  site_title: string
  plan: string
  deleted_at: string
  reason: string
}

// Features disponibles para regalar — se cargan desde Supabase (is_active: true)
const AVAILABLE_FEATURES: any[] = []

export function SuperAdminDashboard() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [availableFeatures, setAvailableFeatures] = useState<any[]>([])
  const [deletedStores, setDeletedStores] = useState<DeletedStoreData[]>([])
  const [scStore, setScStore] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [deployStatus, setDeployStatus] = useState<'idle'|'building'|'done'|'error'>('idle')
  const [isDevEnv, setIsDevEnv] = useState(false)
  const [deployLog, setDeployLog] = useState('')
  const [migrateStatus, setMigrateStatus] = useState<'idle'|'backing_up'|'backup_done'|'migrating'|'done'|'error'>('idle')
  const [migrateLog, setMigrateLog] = useState('')
  const [migratePending, setMigratePending] = useState<string[]>([])
  const [migrateBackupFile, setMigrateBackupFile] = useState('')
  const [showMigrateModal, setShowMigrateModal] = useState(false)
  const [migrateConfirmText, setMigrateConfirmText] = useState('')
  const [migrateError, setMigrateError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Estado para modal de features
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null)
  const [storeFeatures, setStoreFeatures] = useState<string[]>([])
  const [loadingFeatures, setLoadingFeatures] = useState(false)
  const [savingFeature, setSavingFeature] = useState<string | null>(null)
  const [mailStore, setMailStore] = useState<StoreData | null>(null)
  const [mailSubject, setMailSubject] = useState("")
  const [mailMessage, setMailMessage] = useState("")
  const [waStore, setWaStore] = useState<StoreData | null>(null)
  const [waMessage, setWaMessage] = useState("")
  const [storeProdCounts, setStoreProdCounts] = useState<Record<string,number>>({})
  const [storeOrderCounts, setStoreOrderCounts] = useState<Record<string,number>>({})
  const [storeHasPayment, setStoreHasPayment] = useState<Record<string,boolean>>({})
  const [storeHasShipping, setStoreHasShipping] = useState<Record<string,boolean>>({})
  const [storeLastProductAt, setStoreLastProductAt] = useState<Record<string,string>>({})
  const [groupFilter, setGroupFilter] = useState<string>("all")

  // Mensajes de purga/incentivo por grupo (Inactivas > Grupo 1 / 2 / 3 / 4)
  const defaultGrupoMensajes = {
    g1: { mailSubject: "", mailBody: "", waMessage: "" },
    g2: { mailSubject: "", mailBody: "", waMessage: "" },
    g3: { mailSubject: "", mailBody: "", waMessage: "" },
    g4: { mailSubject: "", mailBody: "", waMessage: "" },
  }
  const [grupoMensajes, setGrupoMensajes] = useState<Record<"g1"|"g2"|"g3"|"g4", { mailSubject: string; mailBody: string; waMessage: string }>>(defaultGrupoMensajes)
  const [redactarGrupo, setRedactarGrupo] = useState<"g1"|"g2"|"g3"|"g4"|null>(null)
  const [redactarTab, setRedactarTab] = useState<"mail"|"wa">("mail")
  const [redactarSubject, setRedactarSubject] = useState("")
  const [redactarBody, setRedactarBody] = useState("")
  const [redactarWa, setRedactarWa] = useState("")
  const [savingGrupoMsg, setSavingGrupoMsg] = useState(false)
  const [mandarGrupo, setMandarGrupo] = useState<"g1"|"g2"|"g3"|"g4"|null>(null)
  const [enviandoGrupoMail, setEnviandoGrupoMail] = useState(false)
  const [grupoSendResult, setGrupoSendResult] = useState<{success:number; failed:number}|null>(null)
  const [waWizardGrupo, setWaWizardGrupo] = useState<"g1"|"g2"|"g3"|"g4"|null>(null)
  const [waWizardIndex, setWaWizardIndex] = useState(0)
  const [waWizardSent, setWaWizardSent] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/super-admin/grupo-mensajes").then(r => r.json()).then(data => {
      if (data?.g1 && data?.g2 && data?.g3 && data?.g4) setGrupoMensajes(data)
    }).catch(() => {})
  }, [])

  const grupoLabel: Record<"g1"|"g2"|"g3"|"g4", string> = {
    g1: "Grupo 1 · Nunca cargó nada",
    g2: "Grupo 2 · Cargó y abandonó",
    g3: "Grupo 3 · Sin pago ni envío",
    g4: "Grupo 4 · Con pago y/o envío",
  }

  const openRedactar = (g: "g1"|"g2"|"g3"|"g4") => {
    const m = grupoMensajes[g]
    setRedactarSubject(m.mailSubject)
    setRedactarBody(m.mailBody)
    setRedactarWa(m.waMessage)
    setRedactarTab("mail")
    setRedactarGrupo(g)
  }

  const saveGrupoMensaje = async () => {
    if (!redactarGrupo) return
    setSavingGrupoMsg(true)
    try {
      const payload = { group: redactarGrupo, mailSubject: redactarSubject, mailBody: redactarBody, waMessage: redactarWa }
      const res = await fetch("/api/super-admin/grupo-mensajes", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      })
      if (res.ok) {
        setGrupoMensajes(prev => ({ ...prev, [redactarGrupo]: { mailSubject: redactarSubject, mailBody: redactarBody, waMessage: redactarWa } }))
        setRedactarGrupo(null)
      } else { alert("Error al guardar el mensaje") }
    } catch { alert("Error de conexión al guardar") }
    finally { setSavingGrupoMsg(false) }
  }

  const fechaLimite = () => {
    const d = new Date(Date.now() + 7*86400000)
    return d.toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "2-digit", month: "2-digit", year: "numeric" })
  }

  const buildGrupoMailHtml = (bodyText: string) => {
    const paragraphs = bodyText.split(/\n\n+/).map(p => `<p style="margin:0 0 14px;">${p.replace(/\n/g, "<br>")}</p>`).join("")
    return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;">
      <div style="background:#000;padding:18px 24px;display:flex;align-items:center;gap:12px;border-radius:12px 12px 0 0;">
        <img src="https://tol.ar/tol-logo.png" alt="tol.ar" width="36" height="36" style="display:block;">
        <div><div style="color:#fff;font-size:18px;font-weight:700;">tol.ar</div><div style="color:#bbb;font-size:11px;">Tu tienda online · 100% gratis</div></div>
      </div>
      <div style="height:4px;background:linear-gradient(90deg,#4ade80,#16a34a,#166534);"></div>
      <div style="background:#fff;padding:28px 24px;color:#27272a;font-size:15px;line-height:1.7;">${paragraphs}</div>
      <div style="background:#18181b;padding:16px 24px;color:#fff;font-size:10px;border-radius:0 0 12px 12px;">Recibís este mail porque tenés una tienda en tol.ar · Argentina</div>
    </div>`
  }

  const gruposStores = (g: "g1"|"g2"|"g3"|"g4") =>
    g === "g1" ? inactiveGroup1 : g === "g2" ? inactiveGroup2 : g === "g3" ? inactiveGroup3 : inactiveGroup4

  const openMandar = (g: "g1"|"g2"|"g3"|"g4") => { setGrupoSendResult(null); setMandarGrupo(g) }

  const enviarMailGrupo = async () => {
    if (!mandarGrupo) return
    const list = gruposStores(mandarGrupo).filter(s => s.email && s.email.includes("@"))
    if (list.length === 0) { alert("No hay tiendas con mail en este grupo"); return }
    const confirmSend = window.confirm(`Vas a enviar "${grupoMensajes[mandarGrupo].mailSubject}" a ${list.length} tienda(s) real(es) del ${grupoLabel[mandarGrupo]}.\n\nEsto manda mails de verdad. ¿Continuar?`)
    if (!confirmSend) return
    setEnviandoGrupoMail(true); setGrupoSendResult(null)
    try {
      const fecha = fechaLimite()
      const bodyWithFecha = grupoMensajes[mandarGrupo].mailBody.replace(/\[fecha\]/g, fecha)
      const res = await fetch("/api/super-admin/send-promo-mail", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: list.map(s => s.email),
          subject: grupoMensajes[mandarGrupo].mailSubject,
          html: buildGrupoMailHtml(bodyWithFecha),
          stores: list.map(s => ({ email: s.email, subdomain: s.subdomain })),
        }),
      })
      const data = await res.json()
      if (res.ok) setGrupoSendResult({ success: data.sent || 0, failed: data.failed || 0 })
      else alert("Error: " + (data.error || "Error desconocido"))
    } catch { alert("Error de conexión al enviar") }
    finally { setEnviandoGrupoMail(false) }
  }

  const waWizardStores = () => waWizardGrupo ? gruposStores(waWizardGrupo).filter(s => s.whatsapp_number || s.phone) : []

  const startWaWizard = (g: "g1"|"g2"|"g3"|"g4") => { setWaWizardGrupo(g); setWaWizardIndex(0); setWaWizardSent(new Set()) }

  const waWizardOpenCurrent = () => {
    if (!waWizardGrupo) return
    const list = waWizardStores()
    const store = list[waWizardIndex]
    if (!store) return
    const fecha = fechaLimite()
    const msg = grupoMensajes[waWizardGrupo].waMessage
      .replace(/\[fecha\]/g, fecha)
      .replace(/\[nombre de la tienda\]/g, store.subdomain)
      .replace(/\[link\]/g, `https://tol.ar/promocion-redes/${store.subdomain}`)
    const num = (store.whatsapp_number || store.phone || "").replace(/\D/g, "")
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank")
    setWaWizardSent(prev => new Set(prev).add(store.id))
    setWaWizardIndex(i => i + 1)
  }

  useEffect(() => {
    setIsDevEnv(window.location.hostname.includes('3003'))
  }, [])

  async function handleDeploy() {
    setDeployStatus('building')
    await fetch('/api/super-admin/deploy', { method: 'POST' })
    const interval = setInterval(async () => {
      const res = await fetch('/api/super-admin/deploy')
      const data = await res.json()
      if (data.log) setDeployLog(data.log)
      if (data.status === 'done') { setDeployStatus('done'); setDeployLog(''); clearInterval(interval); setTimeout(() => setDeployStatus('idle'), 3000) }
      if (data.status === 'error') { setDeployStatus('error'); clearInterval(interval) }
    }, 3000)
  }

  async function handleMigrateOpen() {
    setMigrateError('')
    const res = await fetch('/api/super-admin/migrate')
    const data = await res.json()
    if (data.pendingError) { setMigrateError(data.pendingError); setShowMigrateModal(true); return }
    if (!data.pending || data.pending.length === 0) { setMigrateError('No hay migraciones pendientes en producción.'); setShowMigrateModal(true); return }
    setMigratePending(data.pending)
    setMigrateConfirmText('')
    setShowMigrateModal(true)
    setMigrateStatus('backing_up')
    const backupRes = await fetch('/api/super-admin/migrate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step: 'backup' }) })
    const backupData = await backupRes.json().catch(() => ({} as any))
    if (backupData.status === 'backup_done') {
      if (backupData.backupFile) setMigrateBackupFile(backupData.backupFile)
      setMigrateStatus('backup_done')
      return
    }
    const interval = setInterval(async () => {
      const r = await fetch('/api/super-admin/migrate')
      const d = await r.json()
      if (d.log) setMigrateLog(d.log)
      if (d.backupFile) setMigrateBackupFile(d.backupFile)
      if (d.status === 'backup_done') { setMigrateStatus('backup_done'); clearInterval(interval) }
      if (d.status === 'error') { setMigrateStatus('error'); clearInterval(interval) }
    }, 3000)
  }

  async function handleMigrateApply() {
    setMigrateStatus('migrating')
    const res = await fetch('/api/super-admin/migrate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step: 'apply', confirm: migrateConfirmText }) })
    if (!res.ok) {
      const d = await res.json()
      setMigrateError(d.error || 'Error al aplicar migraciones')
      setMigrateStatus('backup_done')
      return
    }
    const interval = setInterval(async () => {
      const r = await fetch('/api/super-admin/migrate')
      const d = await r.json()
      if (d.log) setMigrateLog(d.log)
      if (d.status === 'done') { setMigrateStatus('done'); clearInterval(interval) }
      if (d.status === 'error') { setMigrateStatus('error'); clearInterval(interval) }
    }, 3000)
  }

  function closeMigrateModal() {
    setShowMigrateModal(false)
    setMigrateStatus('idle')
    setMigrateLog('')
    setMigrateConfirmText('')
    setMigrateError('')
  }

  const fetchStores = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/super-admin/stores", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setStores(data.stores || [])
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeletedStores = async () => {
    try {
      const res = await fetch("/api/super-admin/deleted-stores")
      if (res.ok) {
        const data = await res.json()
        setDeletedStores(data.stores || [])
      }
    } catch (error) {
      console.error("Error fetching deleted stores:", error)
    }
  }

  // Antes esto consultaba products/orders/payment_methods/shipping_methods directo desde
  // el navegador con la clave anon. Los permisos de seguridad de esas tablas ya no dejan
  // leer con esa clave (correcto: es una clave pública, visible por cualquiera), así que
  // esas consultas venían devolviendo siempre 0 filas y la columna Prod mostraba "0" para
  // tiendas con productos reales. Ahora se pide todo a una ruta del servidor que sí tiene
  // permiso, y que además pagina para no cortarse en las 1000 filas por default de Supabase.
  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/super-admin/counts", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      setStoreProdCounts(data.prodCounts || {})
      setStoreLastProductAt(data.lastProductAt || {})
      setStoreOrderCounts(data.orderCounts || {})
      setStoreHasPayment(data.hasPayment || {})
      setStoreHasShipping(data.hasShipping || {})
    } catch (error) {
      console.error("Error fetching counts:", error)
    }
  }

  useEffect(() => {
    fetchStores()
    fetchDeletedStores()
    fetchCounts()
    // Cargar cositas activas desde Supabase
    const loadFeatures = async () => {
      try {
        const res = await fetch("/api/super-admin/features", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        setAvailableFeatures((data.features || []).filter((f: any) => f.is_active))
      } catch(e) { console.error("Error cargando features:", e) }
    }
    loadFeatures()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/super-admin/logout", { method: "POST" })
    window.location.reload()
  }

  const handleChangePlan = async (storeId: string, newPlan: string) => {
    try {
      const res = await fetch("/api/super-admin/update-store-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, plan: newPlan }),
      })
      if (res.ok) {
        setStores(stores.map(s => s.id === storeId ? { ...s, plan: newPlan } : s))
      }
    } catch (error) {
      console.error("Error cambiando plan:", error)
    }
  }

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`¿Estás seguro de que querés borrar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(storeId)
    try {
      const res = await fetch(`/api/super-admin/stores?id=${storeId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setStores(stores.filter((s) => s.id !== storeId))
      } else {
        alert("Error al borrar la tienda")
      }
    } catch (error) {
      console.error("Error deleting store:", error)
      alert("Error al borrar la tienda")
    } finally {
      setDeleting(null)
    }
  }

  const [planFilter, setPlanFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortColumn, setSortColumn] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Funciones para gestionar features regaladas
  const openFeaturesModal = async (store: StoreData) => {
    setSelectedStore(store)
    setLoadingFeatures(true)
    try {
      const res = await fetch(`/api/super-admin/store-features?storeId=${store.id}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) {
        console.error("[v0] Error consultando features:", data.error)
        setStoreFeatures([])
      } else {
        setStoreFeatures(data.purchasedCodes || [])
      }
    } catch (error) {
      console.error("[v0] Error cargando features:", error)
      setStoreFeatures([])
    } finally {
      setLoadingFeatures(false)
    }
  }

  const toggleFeature = async (featureCode: string) => {
    if (!selectedStore) return
    setSavingFeature(featureCode)
    const isActive = storeFeatures.includes(featureCode)

    try {
      const res = await fetch("/api/super-admin/store-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: selectedStore.id, featureCode, action: isActive ? "remove" : "gift" }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert("Error: " + (data.error || "no se pudo guardar"))
      } else if (isActive) {
        setStoreFeatures(storeFeatures.filter(f => f !== featureCode))
      } else {
        setStoreFeatures([...storeFeatures, featureCode])
      }
    } catch (error) {
      console.error("Error toggling feature:", error)
      alert("Error de conexion")
    } finally {
      setSavingFeature(null)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className="text-left py-2 px-2 text-xs font-medium text-slate-500 cursor-pointer hover:bg-slate-50 select-none whitespace-nowrap"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-0.5">
        {children}
        {sortColumn === column ? (
          sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  )
  
  const freeStores = stores.filter((s) => !s.plan || s.plan === "free" || s.plan === "gratis").length
  const paidStores = stores.filter((s) => s.plan === "paid" || s.plan === "pro").length
  const templates = stores.filter((s) => s.plan === "templates").length
  const cositas = stores.filter((s) => s.plan === "cositas").length
  const socios = stores.filter((s) => s.plan === "socios").length
  const custom = stores.filter((s) => s.plan === "custom").length
  const mayoristas = stores.filter((s) => s.plan === "mayoristas").length

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sevenDaysAgo = new Date(Date.now() - 7*86400000)
  const inactiveStores = stores.filter((s) => s.plan !== "templates" && s.trial_expires_at && new Date(s.trial_expires_at) < new Date() && (!s.last_activity_at || new Date(s.last_activity_at) < sevenDaysAgo))

  // Clasificación de "vagancia" dentro de Inactivas: primero se fija si ya puede cobrar/entregar (pago y/o envío
  // configurado manda directo a Grupo 4, sin importar cuántos productos cargó ni hace cuánto). Solo si no tiene
  // ninguno de los dos se mira la actividad de carga de productos para ubicarla en Grupo 1/2/3.
  const getStoreGroup = (s: StoreData): "g1" | "g2" | "g3" | "g4" | null => {
    if (s.plan === "templates" || s.plan === "cositas") return null
    if (s.subdomain === "template" || s.subdomain === "pruebas") return null
    const listaParaVender = !!storeHasPayment[s.id] || !!storeHasShipping[s.id]
    if (listaParaVender) return "g4"
    const prodCount = storeProdCounts[s.id] || 0
    if (prodCount === 0) return "g1"
    const lastProd = storeLastProductAt[s.id]
    if (!lastProd || new Date(lastProd) < thirtyDaysAgo) return "g2"
    return "g3"
  }
  const inactiveGroup1 = inactiveStores.filter((s) => getStoreGroup(s) === "g1")
  const inactiveGroup2 = inactiveStores.filter((s) => getStoreGroup(s) === "g2")
  const inactiveGroup3 = inactiveStores.filter((s) => getStoreGroup(s) === "g3")
  const inactiveGroup4 = inactiveStores.filter((s) => getStoreGroup(s) === "g4")
  const activeStores = stores.filter((s) => s.plan !== "templates" && (!s.trial_expires_at || new Date(s.trial_expires_at) >= new Date() || (s.last_activity_at && new Date(s.last_activity_at) >= sevenDaysAgo)))
  const abandonedStores = stores.filter((s) => {
    if (s.plan === "templates") return false
    if (s.plan === "templates") return false
    const createdDate = new Date(s.created_at)
    return createdDate < thirtyDaysAgo && s.status === "active"
  }).length
  
  // Filtrar tiendas segun el plan seleccionado
  const filteredStores = stores
    .filter((s) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return s.subdomain?.toLowerCase().includes(q) || s.username?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
      }
      if (planFilter === "all") return true
      if (planFilter === "templates") return s.plan === "templates"
      if (planFilter === "free") return !s.plan || s.plan === "free" || s.plan === "gratis"
      if (planFilter === "cositas") return s.plan === "cositas"
      if (planFilter === "socios") return s.plan === "socios"
      if (planFilter === "custom") return s.plan === "custom"
      if (planFilter === "mayoristas") return s.plan === "mayoristas"
      if (planFilter === "inactive") {
        const isInactive = s.plan !== "templates" && s.plan !== "cositas" && !!s.trial_expires_at && new Date(s.trial_expires_at) < new Date() && (!s.last_activity_at || new Date(s.last_activity_at) < new Date(Date.now() - 7*86400000))
        if (!isInactive) return false
        if (groupFilter === "all") return true
        return getStoreGroup(s) === groupFilter
      }
      if (planFilter === "active") return s.plan !== "templates" && (!s.trial_expires_at || new Date(s.trial_expires_at) >= new Date() || (s.last_activity_at && new Date(s.last_activity_at) >= new Date(Date.now() - 7*86400000)))
      return true
    })
    .sort((a, b) => {
      let aVal: string | number = ""
      let bVal: string | number = ""
      
      switch (sortColumn) {
        case "subdomain":
          aVal = a.subdomain?.toLowerCase() || ""
          bVal = b.subdomain?.toLowerCase() || ""
          break
        case "email":
          aVal = a.email?.toLowerCase() || ""
          bVal = b.email?.toLowerCase() || ""
          break
        case "password":
          aVal = a.admin_password || ""
          bVal = b.admin_password || ""
          break
        case "template":
          aVal = a.template?.toLowerCase() || "modelo1"
          bVal = b.template?.toLowerCase() || "modelo1"
          break
        case "plan":
          aVal = a.plan?.toLowerCase() || "free"
          bVal = b.plan?.toLowerCase() || "free"
          break
        case "status":
          aVal = a.status || ""
          bVal = b.status || ""
          break
        case "created_at":
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
          break
        case "whatsapp":
          aVal = (a.whatsapp_number || a.phone) ? "1" : "0"
          bVal = (b.whatsapp_number || b.phone) ? "1" : "0"
          break
        case "productos":
          aVal = storeProdCounts[a.id] || 0
          bVal = storeProdCounts[b.id] || 0
          break
        case "ordenes":
          aVal = storeOrderCounts[a.id] || 0
          bVal = storeOrderCounts[b.id] || 0
          break
        case "pago_envio":
          aVal = (storeHasPayment[a.id] ? 1 : 0) + (storeHasShipping[a.id] ? 1 : 0)
          bVal = (storeHasPayment[b.id] ? 1 : 0) + (storeHasShipping[b.id] ? 1 : 0)
          break
        default:
          aVal = a.subdomain?.toLowerCase() || ""
          bVal = b.subdomain?.toLowerCase() || ""
      }
      
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">tol.ar Admin</h1>
              <p className="text-sm text-slate-400">Panel de administración</p>
            </div>
          </div>
          {deployStatus === 'building' && (
            <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#ca8a04',color:'white',cursor:'default'}}>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <span style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{deployLog || 'Buildeando...'}</span>
            </button>
          )}
          {deployStatus === 'idle' && (
            <button onClick={handleDeploy} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#22c55e',color:'white',display:isDevEnv?'flex':'none'}}>
              🚀 Subir a Producción
            </button>
          )}
          {deployStatus === 'done' && (
            <button onClick={() => setDeployStatus('idle')} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#3b82f6',color:'white'}}>
              ✅ ¡Listo!
            </button>
          )}
          {deployStatus === 'error' && (
            <button onClick={() => setDeployStatus('idle')} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#ef4444',color:'white'}}>
              ❌ Error — click para reintentar
            </button>
          )}
          <button onClick={handleMigrateOpen} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{background:'#dc2626',color:'white',display:isDevEnv?'flex':'none'}}>
            🔴 Base de datos
          </button>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-700">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs for Stores, Plans, Analytics, and Payments */}
        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 shadow-sm">
            <TabsTrigger value="pais-dominio" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              País/Dominio
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Tiendas
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Marketing
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Planes
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Cobros
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              SEO
            </TabsTrigger>
            <TabsTrigger value="integraciones" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Integraciones
            </TabsTrigger>
            <TabsTrigger value="core" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Core
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Templates
            </TabsTrigger>
            <TabsTrigger value="especialista" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Especialista
            </TabsTrigger>
            <TabsTrigger value="menores" className="data-[state=active]:bg-slate-100 text-slate-600 data-[state=active]:text-slate-900">
              Menores
            </TabsTrigger>
            <a href="https://smartcheck.tol.ar" target="_blank" rel="noopener noreferrer"
              style={{marginLeft:"4px",background:"#16a34a",color:"white",borderRadius:"6px",padding:"4px 10px",fontWeight:600,fontSize:"12px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"4px",whiteSpace:"nowrap"}}>
              👁 Smartcheck
            </a>
          </TabsList>

          <TabsContent value="stores" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600 font-semibold">Gratis</p>
                      <p className="text-2xl font-bold text-slate-900">{freeStores}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Store className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-semibold">Pagas</p>
                      <p className="text-2xl font-bold text-slate-900">{paidStores}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-yellow-600 font-semibold">Abandonadas</p>
                      <p className="text-2xl font-bold text-slate-900">{abandonedStores}</p>
                    </div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-600 font-semibold">Total</p>
                      <p className="text-2xl font-bold text-slate-900">{stores.length}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <a href="https://claude.ai/chat/94185572-e0a7-45bb-8ede-cd9bfe070411" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <Card className="bg-teal-700 border-teal-600 shadow-sm h-full cursor-pointer hover:bg-teal-600 transition-colors">
                  <CardContent className="p-4 flex items-center justify-center h-full gap-2">
                    <span style={{fontSize:16}}>💬</span>
                    <p className="text-sm text-teal-100 font-semibold whitespace-nowrap">Hablar con Claudio</p>
                  </CardContent>
                </Card>
              </a>
            </div>

            {/* Filtros por Plan */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button
                variant={planFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("all")}
                className={planFilter === "all" ? "bg-slate-800 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                TODAS ({stores.length})
              </Button>
              <Button
                variant={planFilter === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("templates")}
                className={planFilter === "templates" ? "bg-slate-800 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                TEMPLATES ({templates})
              </Button>
              <Button
                variant={planFilter === "free" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("free")}
                className={planFilter === "free" ? "bg-green-600 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                PLAN GRATIS ({freeStores})
              </Button>
              <Button
                variant={planFilter === "cositas" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("cositas")}
                className={planFilter === "cositas" ? "bg-orange-500 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                PLAN COSITAS ({cositas})
              </Button>
              <Button
                variant={planFilter === "socios" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("socios")}
                className={planFilter === "socios" ? "bg-blue-600 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                PLAN SOCIOS ({socios})
              </Button>
              <Button
                variant={planFilter === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("custom")}
                className={planFilter === "custom" ? "bg-purple-600 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                PLAN COSTUMIZADAS ({custom})
              </Button>
              <Button
                variant={planFilter === "mayoristas" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("mayoristas")}
                className={planFilter === "mayoristas" ? "bg-amber-600 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
              >
                MAYORISTAS ({mayoristas})
              </Button>
              <Button
                variant={planFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlanFilter("active")}
                className={planFilter === "active" ? "bg-green-600 text-white text-xs px-2 h-7" : "bg-transparent border-green-300 text-green-600 hover:bg-green-50 text-xs px-2 h-7"}
              >
                ACTIVAS ({activeStores.length})
              </Button>
              <Button
                variant={planFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => { setPlanFilter("inactive"); setGroupFilter("all") }}
                className={planFilter === "inactive" ? "bg-red-600 text-white text-xs px-2 h-7" : "bg-transparent border-red-300 text-red-600 hover:bg-red-50 text-xs px-2 h-7"}
              >
                INACTIVAS ({inactiveStores.length})
              </Button>

            </div>

            {planFilter === "inactive" && (
              <div className="flex flex-wrap gap-2 -mt-2">
                <Button
                  variant={groupFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter("all")}
                  className={groupFilter === "all" ? "bg-slate-700 text-white text-xs px-2 h-7" : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-2 h-7"}
                >
                  TODAS LAS INACTIVAS ({inactiveStores.length})
                </Button>
                <Button
                  variant={groupFilter === "g1" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter("g1")}
                  title="Crearon la tienda y nunca cargaron ni un producto propio"
                  className={groupFilter === "g1" ? "bg-red-700 text-white text-xs px-2 h-7" : "bg-transparent border-red-300 text-red-700 hover:bg-red-50 text-xs px-2 h-7"}
                >
                  GRUPO 1 · Nunca cargó nada ({inactiveGroup1.length})
                </Button>
                <Button
                  variant={groupFilter === "g2" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter("g2")}
                  title="Cargaron algún producto pero la abandonaron hace más de 30 días"
                  className={groupFilter === "g2" ? "bg-orange-600 text-white text-xs px-2 h-7" : "bg-transparent border-orange-300 text-orange-600 hover:bg-orange-50 text-xs px-2 h-7"}
                >
                  GRUPO 2 · Cargó y abandonó ({inactiveGroup2.length})
                </Button>
                <Button
                  variant={groupFilter === "g3" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter("g3")}
                  title="Tienen movimiento reciente pero no tienen forma de pago ni de envío configurada — catálogo nomás"
                  className={groupFilter === "g3" ? "bg-amber-600 text-white text-xs px-2 h-7" : "bg-transparent border-amber-300 text-amber-600 hover:bg-amber-50 text-xs px-2 h-7"}
                >
                  GRUPO 3 · Sin pago ni envío ({inactiveGroup3.length})
                </Button>
                <Button
                  variant={groupFilter === "g4" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter("g4")}
                  title="Movimiento reciente y ya tienen forma de pago o de envío configurada — listas para vender de verdad"
                  className={groupFilter === "g4" ? "bg-green-600 text-white text-xs px-2 h-7" : "bg-transparent border-green-300 text-green-600 hover:bg-green-50 text-xs px-2 h-7"}
                >
                  GRUPO 4 · Con pago y/o envío ({inactiveGroup4.length})
                </Button>
              </div>
            )}

            {planFilter === "inactive" && (groupFilter === "g1" || groupFilter === "g2" || groupFilter === "g3" || groupFilter === "g4") && (
              <div className="flex items-center gap-3 -mt-1 mb-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <button
                  onClick={() => openRedactar(groupFilter as "g1"|"g2"|"g3"|"g4")}
                  title="Redactar mail y WhatsApp para este grupo"
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => openMandar(groupFilter as "g1"|"g2"|"g3"|"g4")}
                  title="Mandar mail/WhatsApp a las tiendas de este grupo"
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <Send className="w-4 h-4 text-green-600" />
                </button>
                <span className="text-xs text-slate-500">
                  Redactar el mensaje del {grupoLabel[groupFilter as "g1"|"g2"|"g3"|"g4"]}, o mandarlo a las {gruposStores(groupFilter as "g1"|"g2"|"g3"|"g4").length} tiendas de este grupo.
                </span>
              </div>
            )}

            {/* Stores List */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                <CardTitle className="text-slate-900">Tiendas Registradas</CardTitle>
                <input
                  type="text"
                  placeholder="Buscar por subdominio, usuario o mail..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border border-slate-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-slate-400 w-72 bg-white"
                />
              </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStores}
                  className="border-slate-300 text-slate-600 hover:bg-slate-100 bg-transparent"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Cargando tiendas...</div>
                ) : planFilter === "NUNCA" ? (
                  filteredStores.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No hay tiendas inactivas por el momento</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Subdominio</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Titulo</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Plan</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Creada</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Borrada</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deletedStores.map((store) => (
                            <tr key={store.id} className="border-b border-slate-100 hover:bg-red-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-red-400" />
                                  <span className="text-slate-500 line-through">{store.subdomain}.tol.ar</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-700">{store.email}</td>
                              <td className="py-3 px-4 text-slate-700">{store.site_title}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="border-slate-300 text-slate-500">
                                  {store.plan || "free"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-sm">
                                {store.created_at ? new Date(store.created_at).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }) : "—"}
                              </td>
                              <td className="py-3 px-4 text-red-500 text-sm">
                                {store.deleted_at ? new Date(store.deleted_at).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : filteredStores.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {planFilter === "all" ? "No hay tiendas registradas" : `No hay tiendas con el plan "${planFilter}"`}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs">
                          <SortableHeader column="subdomain">Subdominio</SortableHeader>
                          <SortableHeader column="username">Usuario</SortableHeader>
                          <SortableHeader column="password">Clave</SortableHeader>
                          <SortableHeader column="whatsapp">Contacto</SortableHeader>
                          <SortableHeader column="productos">Prod</SortableHeader>
                          <SortableHeader column="ordenes">Ord</SortableHeader>
                          <SortableHeader column="pago_envio">Pago/Envío</SortableHeader>
                          <SortableHeader column="template">Template</SortableHeader>
                          <SortableHeader column="plan">Plan</SortableHeader>
                          <SortableHeader column="created_at">Creada</SortableHeader>
                          <th className="text-left py-2 px-2 text-xs font-medium text-slate-500">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map((store) => (
                          <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                            <td className="py-2 px-2">
                              <a 
                                href={`https://${store.subdomain}.tol.ar`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-green-600 transition-colors"
                              >
                                <span suppressHydrationWarning className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{background: !store.last_activity_at ? "#ef4444" : new Date(store.last_activity_at) > new Date(Date.now()-30*86400000) ? "#22c55e" : "#f59e0b"}} title={!store.last_activity_at ? "Nunca entró" : new Date(store.last_activity_at) > new Date(Date.now()-30*86400000) ? "Activa" : "Inactiva +30 días"}></span>
                                <span className="text-slate-700 hover:text-green-600 hover:underline truncate block max-w-[180px]" title={store.subdomain + ".tol.ar"}>{store.subdomain}.tol.ar</span>
                              </a>
                            </td>
                            <td className="py-2 px-2 text-slate-700">{store.username || "—"}</td>
                            <td className="py-2 px-2">
  <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs text-green-600 font-mono block truncate max-w-[100px]" title={store.admin_password || ""}>
  {store.admin_password && store.admin_password.length > 12 ? `${store.admin_password.slice(0, 12)}...` : store.admin_password || "—"}
  </code>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => { setMailStore(store); setMailSubject(""); setMailMessage("") }}
                                  title={store.email}
                                  className="w-7 h-7 flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => store.whatsapp_number || store.phone ? (setWaStore(store), setWaMessage("")) : null}
                                  title={store.whatsapp_number || store.phone || "Sin WhatsApp cargado"}
                                  disabled={!store.whatsapp_number && !store.phone}
                                  className={`w-7 h-7 flex items-center justify-center rounded-md border transition-colors ${store.whatsapp_number || store.phone ? "border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer" : "border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed"}`}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill={store.whatsapp_number || store.phone ? "#16a34a" : "#94a3b8"}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.564 4.14 1.542 5.877L.057 23.5l5.773-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.031-1.386l-.36-.214-3.427.9.916-3.337-.235-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className={`text-xs font-mono font-medium ${(storeProdCounts[store.id]||0)>0 ? "text-slate-700" : "text-slate-300"}`}>{storeProdCounts[store.id]||0}</span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className={`text-xs font-mono font-medium ${(storeOrderCounts[store.id]||0)>0 ? "text-green-600" : "text-slate-300"}`}>{storeOrderCounts[store.id]||0}</span>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-1">
                                <CreditCard className={`w-3.5 h-3.5 ${storeHasPayment[store.id] ? "text-green-600" : "text-slate-300"}`} title={storeHasPayment[store.id] ? "Tiene método de pago configurado" : "Sin método de pago configurado"} />
                                <Truck className={`w-3.5 h-3.5 ${storeHasShipping[store.id] ? "text-green-600" : "text-slate-300"}`} title={storeHasShipping[store.id] ? "Tiene método de envío configurado" : "Sin método de envío configurado"} />
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs px-1.5 py-0">
                                {store.template || "modelo1"}
                              </Badge>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={store.plan || "free"}
                                onChange={(e) => handleChangePlan(store.id, e.target.value)}
                                className={`text-xs font-medium px-1.5 py-0.5 rounded border cursor-pointer ${
                                  store.plan === "templates" ? "bg-slate-100 text-slate-700 border-slate-300" :
                                  store.plan === "cositas" ? "bg-orange-100 text-orange-700 border-orange-200" :
                                  store.plan === "socios" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  store.plan === "custom" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                  store.plan === "mayoristas" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                  "bg-green-100 text-green-700 border-green-200"
                                }`}
                              >
                                <option value="free">Gratis</option>
                                <option value="templates">Templates</option>
                                <option value="cositas">Cositas</option>
                                <option value="socios">Socios</option>
                                <option value="custom">Custom</option>
                                <option value="mayoristas">Mayoristas</option>
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-1 text-slate-500 text-xs whitespace-nowrap">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                {new Date(store.created_at).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex gap-1">
                                <button onClick={() => window.open(`https://smartcheck.tol.ar?store=${store.subdomain}`, "_blank")} title="SmartCheck" style={{background:"none",border:"none",cursor:"pointer",color:"#3b82f6",padding:2,display:"flex"}}><Eye style={{width:14,height:14}} /></button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openFeaturesModal(store)}
                                  className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 h-6 w-6 p-0"
                                  title="Regalar Features"
                                >
                                  <Gift className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStore(store.id, store.site_title)}
                                  disabled={deleting === store.id}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                >
                                  <Trash2 className={`w-3.5 h-3.5 ${deleting === store.id ? "animate-pulse" : ""}`} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <PlansDashboard stores={stores} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsConfig />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <PlatformMarketing />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <SeoModule />
          </TabsContent>

          {/* Integraciones Tab */}
          <TabsContent value="integraciones">
            <IntegracionesManager />
          </TabsContent>

          {/* Core Tab */}
          <TabsContent value="core">
            <CoreManager />
          </TabsContent>

          {/* Especialista Tab */}
          <TabsContent value="especialista" className="space-y-6">
            <EspecialistaDashboard />
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplateManager />
          </TabsContent>


          <TabsContent value="pais-dominio">
            <PaisDominio stores={stores} />
          </TabsContent>

          {/* Menores Tab */}
          <TabsContent value="menores">
            <MenoresManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal para regalar features */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-orange-500" />
                    Regalar Features
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedStore.site_title || selectedStore.subdomain}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStore(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingFeatures ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cargando features...
                </div>
              ) : (
                <div className="space-y-3">
                  {availableFeatures.map((feature) => {
                    const isActive = storeFeatures.includes(feature.code)
                    const isSaving = savingFeature === feature.code
                    const ICON_MAP: any = { MessageCircle, Palette, FileSpreadsheet, Search, BarChart3, Globe, DollarSign, Images, Gift, TrendingUp }
                    const Icon = (typeof feature.icon === "string" ? ICON_MAP[feature.icon] : feature.icon) || Store
                    
                    return (
                      <div
                        key={feature.code}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isActive 
                            ? "bg-green-50 border-green-200" 
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? "bg-green-100" : "bg-slate-100"}`}>
                            <Icon className={`w-4 h-4 ${isActive ? "text-green-600" : "text-slate-500"}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{feature.name}</p>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => toggleFeature(feature.code)}
                          disabled={isSaving}
                          className={`min-w-[100px] ${
                            isActive 
                              ? "bg-green-600 hover:bg-red-500" 
                              : "border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                          } group`}
                        >
                          {isSaving ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : isActive ? (
                            <>
                              <span className="flex items-center gap-1 group-hover:hidden">
                                <Check className="w-3 h-3" />
                                Activa
                              </span>
                              <span className="hidden group-hover:flex items-center gap-1">
                                <X className="w-3 h-3" />
                                Quitar
                              </span>
                            </>
                          ) : (
                            "Regalar"
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Las features regaladas no tienen costo para el usuario
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Mail */}
      {showMigrateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  🔴 Migraciones a producción
                </CardTitle>
                {(migrateStatus === 'idle' || migrateStatus === 'backup_done' || migrateStatus === 'done' || migrateStatus === 'error') && (
                  <Button variant="ghost" size="sm" onClick={closeMigrateModal} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {migrateError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">{migrateError}</div>
              )}
              {!migrateError && migrateStatus === 'backing_up' && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Haciendo backup completo de producción antes de tocar nada...
                  {migrateLog && <span className="text-xs text-slate-400 block">{migrateLog}</span>}
                </div>
              )}
              {!migrateError && (migrateStatus === 'backup_done' || migrateStatus === 'migrating') && (
                <>
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">
                    Backup listo: <span className="font-mono text-xs">{migrateBackupFile}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Migraciones pendientes ({migratePending.length})</label>
                    <ul className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-mono space-y-1">
                      {migratePending.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                  {migrateStatus === 'backup_done' && (
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Escribí CONFIRMAR para aplicar en producción</label>
                      <input type="text" value={migrateConfirmText} onChange={e => setMigrateConfirmText(e.target.value)} placeholder="CONFIRMAR" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-red-400" />
                    </div>
                  )}
                  {migrateStatus === 'migrating' && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      Aplicando migraciones en producción...
                      {migrateLog && <span className="text-xs text-slate-400 block">{migrateLog}</span>}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={closeMigrateModal} className="border-slate-300 text-slate-600 bg-transparent">Cerrar</Button>
                    {migrateStatus === 'backup_done' && (
                      <Button size="sm" disabled={migrateConfirmText !== 'CONFIRMAR'} onClick={handleMigrateApply} className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40">
                        Aplicar en producción
                      </Button>
                    )}
                  </div>
                </>
              )}
              {!migrateError && migrateStatus === 'done' && (
                <>
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md px-3 py-2">✅ Migraciones aplicadas correctamente en producción.</div>
                  <div className="flex justify-end pt-1">
                    <Button size="sm" onClick={closeMigrateModal} className="bg-blue-600 hover:bg-blue-700 text-white">Cerrar</Button>
                  </div>
                </>
              )}
              {(migrateStatus === 'error') && !migrateError && (
                <>
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">❌ Algo falló. Revisar /tmp/migrate.log en el servidor antes de reintentar.</div>
                  <div className="flex justify-end pt-1">
                    <Button size="sm" onClick={closeMigrateModal} className="bg-blue-600 hover:bg-blue-700 text-white">Cerrar</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {mailStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Enviar mail
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{mailStore.subdomain}.tol.ar</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setMailStore(null)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Para</label>
                <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-blue-600 font-mono">{mailStore.email}</div>
                <p className="text-xs text-slate-400 mt-1">{mailStore.username} · {mailStore.subdomain}.tol.ar</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Asunto</label>
                <input type="text" value={mailSubject} onChange={e => setMailSubject(e.target.value)} placeholder="Novedad sobre tu tienda en tol.ar" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Plantilla</label>
                <select onChange={e => { const t = e.target.value; if(t==="bienvenida") setMailMessage("Hola! Bienvenido/a a tol.ar. Tu tienda ya está lista para empezar a vender."); else if(t==="recordatorio") setMailMessage("Hola! Te escribimos porque tu tienda todavía no tiene productos cargados. ¿Necesitás ayuda para empezar?"); else if(t==="oferta") setMailMessage("Hola! Tenemos una oferta especial para vos. Escribinos para conocer más detalles."); else if(t==="soporte") setMailMessage("Hola! Nos comunicamos desde el equipo de tol.ar. ¿Hay algo en lo que podamos ayudarte?"); }} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white">
                  <option value="">— Sin plantilla —</option>
                  <option value="bienvenida">Bienvenida</option>
                  <option value="recordatorio">Recordatorio de activación</option>
                  <option value="oferta">Oferta especial</option>
                  <option value="soporte">Soporte</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Mensaje</label>
                <textarea value={mailMessage} onChange={e => setMailMessage(e.target.value)} placeholder="Escribí tu mensaje acá..." rows={4} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setMailStore(null)} className="border-slate-300 text-slate-600 bg-transparent">Cancelar</Button>
                <Button size="sm" onClick={() => { window.open(`mailto:${mailStore.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailMessage)}`); setMailStore(null) }} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Mail className="w-3.5 h-3.5 mr-1.5" /> Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal WhatsApp */}
      {waStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.564 4.14 1.542 5.877L.057 23.5l5.773-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.031-1.386l-.36-.214-3.427.9.916-3.337-.235-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                  WhatsApp
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{waStore.subdomain}.tol.ar</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setWaStore(null)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Número</label>
                <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2.5 text-center text-green-700 font-mono font-medium text-sm tracking-wider">{waStore.whatsapp_number || waStore.phone}</div>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Mensaje inicial (opcional)</label>
                <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)} placeholder={"Hola! Te escribimos desde tol.ar..."} rows={3} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-green-400 resize-none" />
              </div>
              <Button className="w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold" onClick={() => { const num = (waStore.whatsapp_number || waStore.phone || "").replace(/\D/g,""); window.open(`https://wa.me/${num}${waMessage ? "?text="+encodeURIComponent(waMessage) : ""}`,"_blank"); setWaStore(null) }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-2"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.564 4.14 1.542 5.877L.057 23.5l5.773-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.031-1.386l-.36-.214-3.427.9.916-3.337-.235-.374A9.787 9.787 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                Abrir WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: redactar mensaje de purga por grupo */}
      {redactarGrupo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  Redactar — {grupoLabel[redactarGrupo]}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setRedactarGrupo(null)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
              <div className="flex gap-1 pt-2">
                <button onClick={() => setRedactarTab("mail")} className={`text-xs px-3 py-1.5 rounded-md font-medium ${redactarTab === "mail" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Mail className="w-3 h-3 inline mr-1" /> Mail
                </button>
                <button onClick={() => setRedactarTab("wa")} className={`text-xs px-3 py-1.5 rounded-md font-medium ${redactarTab === "wa" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <MessageCircle className="w-3 h-3 inline mr-1" /> WhatsApp
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-400 -mt-1">Placeholders disponibles: <code className="bg-slate-100 px-1 rounded">[nombre de la tienda]</code> y <code className="bg-slate-100 px-1 rounded">[fecha]</code> (se completa sola: una semana después de mandarlo)</p>
              {redactarTab === "mail" ? (
                <>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Asunto</label>
                    <input type="text" value={redactarSubject} onChange={e => setRedactarSubject(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Cuerpo del mail</label>
                    <textarea value={redactarBody} onChange={e => setRedactarBody(e.target.value)} rows={9} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Mensaje de WhatsApp</label>
                  <textarea value={redactarWa} onChange={e => setRedactarWa(e.target.value)} rows={6} className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-green-400 resize-none" />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setRedactarGrupo(null)} className="border-slate-300 text-slate-600 bg-transparent">Cancelar</Button>
                <Button size="sm" disabled={savingGrupoMsg} onClick={saveGrupoMensaje} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {savingGrupoMsg ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: mandar mensaje de purga por grupo */}
      {mandarGrupo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4 text-green-600" />
                  Mandar — {grupoLabel[mandarGrupo]}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setMandarGrupo(null)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Mail</span>
                  <span className="text-xs text-blue-600">{gruposStores(mandarGrupo).filter(s => s.email && s.email.includes("@")).length} con mail</span>
                </div>
                {grupoSendResult && (
                  <p className="text-xs mb-2 text-blue-800">{grupoSendResult.success} enviados{grupoSendResult.failed > 0 && `, ${grupoSendResult.failed} fallaron`}</p>
                )}
                <Button size="sm" disabled={enviandoGrupoMail} onClick={enviarMailGrupo} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {enviandoGrupoMail ? "Enviando..." : `Enviar mail a ${gruposStores(mandarGrupo).filter(s => s.email && s.email.includes("@")).length} tiendas`}
                </Button>
              </div>
              <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-900 flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</span>
                  <span className="text-xs text-green-600">{gruposStores(mandarGrupo).filter(s => s.whatsapp_number || s.phone).length} con WhatsApp</span>
                </div>
                <p className="text-xs text-green-700 mb-2">No hay envío automático de WhatsApp — se abre uno por uno para que lo mandes vos mismo, tienda por tienda.</p>
                <Button size="sm" onClick={() => { startWaWizard(mandarGrupo); setMandarGrupo(null) }} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Empezar a mandar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Wizard: mandar WhatsApp de a uno */}
      {waWizardGrupo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp — {grupoLabel[waWizardGrupo]}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setWaWizardGrupo(null)} className="h-7 w-7 p-0"><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {waWizardStores().length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No hay tiendas con WhatsApp en este grupo.</p>
              ) : waWizardIndex >= waWizardStores().length ? (
                <div className="text-center py-4">
                  <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Listo, recorriste las {waWizardStores().length} tiendas del grupo.</p>
                  <Button size="sm" onClick={() => setWaWizardGrupo(null)} className="mt-3 bg-slate-700 hover:bg-slate-800 text-white">Cerrar</Button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500">Tienda {waWizardIndex + 1} de {waWizardStores().length}</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    <p className="text-sm font-medium text-slate-800">{waWizardStores()[waWizardIndex].subdomain}.tol.ar</p>
                    <p className="text-xs text-green-700 font-mono">{waWizardStores()[waWizardIndex].whatsapp_number || waWizardStores()[waWizardIndex].phone}</p>
                  </div>
                  <Button className="w-full bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold" onClick={waWizardOpenCurrent}>
                    Abrir WhatsApp y pasar a la siguiente
                  </Button>
                  <div className="flex justify-between gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => setWaWizardIndex(i => i + 1)} className="flex-1 border-slate-300 text-slate-600 bg-transparent">
                      Saltar sin mandar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {scStore && (
        <div onClick={() => setScStore(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fff',borderRadius:12,padding:32,minWidth:400,position:'relative',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <button onClick={() => setScStore(null)} style={{position:'absolute',top:12,right:16,background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#888'}}>✕</button>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <Eye style={{color:'#3b82f6',width:20,height:20}} />
              <strong style={{fontSize:16}}>SmartCheck</strong>
              <span style={{background:'#f1f5f9',padding:'2px 8px',borderRadius:6,fontSize:12,color:'#64748b'}}>{scStore.subdomain}.tol.ar</span>
            </div>
            <div style={{background:'#f8fafc',borderRadius:8,padding:20,textAlign:'center',color:'#94a3b8',fontSize:13,marginBottom:16}}>
              🚧 Grabaciones de sesiones — próximamente
            </div>
            <a href="https://app.smartlook.com/recordings" target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',padding:'10px',background:'#3b82f6',color:'#fff',borderRadius:8,fontSize:13,textDecoration:'none'}}>Ver en Smartlook →</a>
          </div>
        </div>
      )}
    </div>
  )
}
