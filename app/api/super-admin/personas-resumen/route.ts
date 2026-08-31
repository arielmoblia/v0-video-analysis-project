import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_PANEL_PAGE_PATH } from "@/lib/admin-panel-tracking"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// ID fijo del registro "tol.ar" dentro de la tabla stores (no es una tienda real, es la landing).
const TOLAR_STORE_ID = "a921029f-9dc7-40ed-ae14-732491c37eee"

// Rutas que solo pueden pertenecer a una tienda de cliente (tol.ar no vende productos propios).
const PREFIJOS_DE_TIENDA = ["/producto/", "/categoria/", "/tienda/", "/checkout", "/devoluciones", "/carrito"]

// Páginas donde entrar es una señal real de estar averiguando para crear una tienda
// (no solo pasar por la home). Mismo criterio ya usado para analizar el grupo "Directo".
const PAGINAS_SENAL = ["/plan-gratis", "/templates", "/pagos", "/plan-cositas", "/contacto", "/crear-tienda"]

const PATRONES_BOT = [
  "bot", "spider", "crawl", "facebookexternalhit", "meta-externalagent",
  "headless", "python-requests", "curl/", "wget", "preview", "pingdom", "uptimerobot",
]
const REGEX_BOTS = PATRONES_BOT.join("|")
function excluirBots(q: any) {
  return q.not("user_agent", "imatch", REGEX_BOTS)
}

const PERIODOS = ["siempre", "mes", "semana"] as const
type Periodo = (typeof PERIODOS)[number]

function desdeFecha(periodo: Periodo): string | null {
  if (periodo === "siempre") return null
  const dias = periodo === "mes" ? 30 : 7
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000).toISOString()
}

// page_views no trae paginado propio del cliente Supabase (tope de 1000 filas por consulta),
// así que primero contamos cuántas tandas hacen falta y las pedimos todas en paralelo.
async function traerTodasLasFilas(filtro: (q: any) => any, campos: string) {
  const TAMANIO_TANDA = 1000
  const { count } = await filtro(excluirBots(supabase.from("page_views").select("*", { count: "exact", head: true })))
  const total = count || 0
  if (total === 0) return []
  const paginas = Math.ceil(total / TAMANIO_TANDA)
  const resultados = await Promise.all(
    Array.from({ length: paginas }, (_, i) => {
      const q = excluirBots(supabase.from("page_views").select(campos).range(i * TAMANIO_TANDA, i * TAMANIO_TANDA + TAMANIO_TANDA - 1))
      return filtro(q)
    })
  )
  const filas: any[] = []
  for (const r of resultados) if (r.data) filas.push(...r.data)
  return filas
}

async function personasEnTolar(periodo: Periodo) {
  const desde = desdeFecha(periodo)
  const filas = await traerTodasLasFilas((q: any) => {
    let query = q.eq("country", "Argentina").eq("store_id", TOLAR_STORE_ID)
    for (const prefijo of PREFIJOS_DE_TIENDA) query = query.not("page_path", "like", prefijo + "%")
    if (desde) query = query.gte("created_at", desde)
    return query
  }, "visitor_id, page_path")

  const todas = new Set<string>()
  const conSenal = new Set<string>()
  for (const fila of filas as { visitor_id: string | null; page_path: string }[]) {
    if (!fila.visitor_id) continue
    todas.add(fila.visitor_id)
    if (PAGINAS_SENAL.includes(fila.page_path)) conSenal.add(fila.visitor_id)
  }
  return { total: todas.size, conSenal: conSenal.size, sinSenal: todas.size - conSenal.size }
}

async function tiendasCreadas(periodo: Periodo) {
  let q = supabase.from("stores").select("*", { count: "exact", head: true }).neq("plan", "templates")
  const desde = desdeFecha(periodo)
  if (desde) q = q.gte("created_at", desde)
  const { count } = await q
  return count || 0
}

async function tiendasConAdminActivo(periodo: Periodo) {
  const desde = desdeFecha(periodo)
  const filas = await traerTodasLasFilas((q: any) => {
    let query = q.not("store_id", "eq", TOLAR_STORE_ID).eq("country", "Argentina").eq("page_path", ADMIN_PANEL_PAGE_PATH)
    if (desde) query = query.gte("created_at", desde)
    return query
  }, "store_id")
  return new Set((filas as { store_id: string }[]).map((f) => f.store_id)).size
}

async function personasEnTiendas(periodo: Periodo) {
  const desde = desdeFecha(periodo)
  const filas = await traerTodasLasFilas((q: any) => {
    let query = q.not("store_id", "eq", TOLAR_STORE_ID).eq("country", "Argentina").neq("page_path", ADMIN_PANEL_PAGE_PATH)
    if (desde) query = query.gte("created_at", desde)
    return query
  }, "visitor_id")
  const personas = new Set<string>()
  for (const fila of filas as { visitor_id: string | null }[]) if (fila.visitor_id) personas.add(fila.visitor_id)
  return personas.size
}

// orders no tiene tope de 1000 filas para este volumen todavía, pero se pagina igual por las dudas.
async function personasQueCompraron(periodo: Periodo) {
  const desde = desdeFecha(periodo)
  let q = supabase.from("orders").select("customer_email")
  if (desde) q = q.gte("created_at", desde)
  const { data } = await q
  const emails = new Set<string>()
  for (const fila of (data || []) as { customer_email: string | null }[]) {
    if (fila.customer_email) emails.add(fila.customer_email.trim().toLowerCase())
  }
  return emails.size
}

async function resumenPeriodo(periodo: Periodo) {
  const [tolar, tiendas, adminActivo, enTiendas, compraron] = await Promise.all([
    personasEnTolar(periodo),
    tiendasCreadas(periodo),
    tiendasConAdminActivo(periodo),
    personasEnTiendas(periodo),
    personasQueCompraron(periodo),
  ])
  return {
    tolarTotal: tolar.total,
    tolarSinSenal: tolar.sinSenal,
    tolarConSenal: tolar.conSenal,
    tiendasCreadas: tiendas,
    tiendasConAdminActivo: adminActivo,
    personasEnTiendas: enTiendas,
    personasQueCompraron: compraron,
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
    if (!isAuthenticated) return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })

    const periodoParam = request.nextUrl.searchParams.get("periodo")
    const periodo: Periodo = PERIODOS.includes(periodoParam as Periodo) ? (periodoParam as Periodo) : "siempre"

    const data = await resumenPeriodo(periodo)

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
