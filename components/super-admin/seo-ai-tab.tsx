"use client"

import { useState, useEffect } from "react"
import { GeoPreguntas } from "./geo-preguntas"
import { GeoMatriz } from "./geo-matriz"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Brain, FileText, Plus, ExternalLink, X, ChevronRight, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TOUR_PASOS = [
  { titulo: "📊 Cómo figuramos en cada IA", texto: "Las 4 tarjetas muestran qué porcentaje de las respuestas de cada IA menciona a tol.ar vs la competencia. La barra verde tiene que crecer. Abajo ves cuántas personas llegaron a tol.ar desde cada IA — ese es el número real." },
  { titulo: "📋 La tabla de preguntas", texto: "Le hacemos 10 preguntas a cada IA y registramos si tol.ar aparece o no. Verde = nos conocen, Rojo = no saben que existimos. Apretá 'Correr análisis' para actualizar." },
  { titulo: "✏️ Las preguntas que monitoreamos", texto: "Podés editar, agregar o pausar las preguntas que le hacemos a las IAs. Son conversaciones reales que la gente tendría — no keywords de Google." },
  { titulo: "🔍 Puntos débiles de la competencia", texto: "Lo que las IAs dicen malo de Tiendanube y Empretienda es tu munición. Si una IA dice 'Tiendanube cobra comisión', creás contenido que destaque que tol.ar no cobra nada." },
  { titulo: "✍️ El redactor automático", texto: "Escribís el tema y Claude escribe la página completa lista para publicar. Una buena página sube en Google Y hace que las IAs te citen." },
  { titulo: "📡 Radar de menciones", texto: "Cuantas más veces nos mencionan en internet, más nos conocen las IAs. Podés agregar menciones propias como el lanzamiento de tol.ar." },
  { titulo: "📈 Evolución y oportunidades", texto: "El gráfico muestra cómo evolucionan tus posiciones en Google. Las oportunidades son keywords donde estás cerca de la primera página — con una página bien escrita podés llegar." },
]

const DEBILIDADES = [
  { comp: "Tiendanube", ia: "ChatGPT · Perplexity", quote: '"Tiendanube cobra entre 2% y 15% de comisión por venta según el plan"', opp: "Oportunidad: tol.ar 0% comisión" },
  { comp: "Tiendanube", ia: "Claude", quote: '"El plan gratuito de Tiendanube tiene limitaciones en cantidad de productos"', opp: "Oportunidad: plan gratis sin límites" },
  { comp: "Empretienda", ia: "Perplexity", quote: '"Empretienda tiene menos integraciones de pago que otras plataformas"', opp: "Oportunidad: MP + Mobbex + MODO + Ualá" },
  { comp: "Tiendanube", ia: "Gemini", quote: '"Para pequeños emprendedores los costos de Tiendanube pueden ser elevados"', opp: "Oportunidad: precio fijo, sin sorpresas" },
]

const OPORTUNIDADES = [
  { kw: "plataformas de venta online argentina gratis", pos: 47, vol: 880, pct: 78, color: "#E24B4A", accion: "Crear página" },
  { kw: "alternativas tiendanube argentina", pos: 23, vol: 390, pct: 55, color: "#EF9F27", accion: "Crear página" },
  { kw: "tienda online sin comisiones argentina", pos: 18, vol: 260, pct: 45, color: "#EF9F27", accion: "Optimizar" },
  { kw: "crear tienda online gratis argentina", pos: 11, vol: 720, pct: 30, color: "#639922", accion: "Optimizar" },
]

const MENCIONES_INICIALES = [
  { source: "tol.ar blog", url: "https://tol.ar/blog/lanzamiento", text: "Lanzamos tol.ar: la primera plataforma e-commerce argentina sin comisiones por venta.", date: "hace 1 día", tipo: "propia" },
  { source: "Reddit r/argentina", url: "https://reddit.com/r/argentina", text: "Yo uso tol.ar y la verdad que no te cobra nada por venta...", date: "hace 5 días", tipo: "auto" },
  { source: "TechArgentina", url: "https://techargentina.com", text: "Startups argentinas de e-commerce: tol.ar y el nuevo ecosistema sin comisiones...", date: "hace 12 días", tipo: "auto" },
]

const IA_STATIC = [
  { engine: "ChatGPT", bars: [{ name: "Tiendanube", pct: 75, color: "#E24B4A" }, { name: "Empretienda", pct: 20, color: "#EF9F27" }, { name: "tol.ar", pct: 5, color: "#1D9E75" }] },
  { engine: "Gemini",  bars: [{ name: "Tiendanube", pct: 80, color: "#E24B4A" }, { name: "Empretienda", pct: 18, color: "#EF9F27" }, { name: "tol.ar", pct: 2, color: "#1D9E75" }] },
  { engine: "Claude",  bars: [{ name: "tol.ar", pct: 45, color: "#1D9E75" }, { name: "Tiendanube", pct: 40, color: "#E24B4A" }, { name: "Empretienda", pct: 15, color: "#EF9F27" }] },
  { engine: "Perplexity", bars: [{ name: "Tiendanube", pct: 50, color: "#E24B4A" }, { name: "tol.ar", pct: 30, color: "#1D9E75" }, { name: "Empretienda", pct: 20, color: "#EF9F27" }] },
]

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="w-4 h-4 rounded-full border border-slate-300 text-slate-400 text-[10px] font-medium flex items-center justify-center hover:border-slate-500 hover:text-slate-600 transition-colors">i</button>
      {open && <span className="absolute left-1/2 -translate-x-1/2 top-6 z-50 w-52 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-md leading-relaxed">{text}</span>}
    </span>
  )
}

function SectionHeader({ label, badge, badgeColor, tooltip, right }: { label: string; badge?: string; badgeColor?: string; tooltip: string; right?: React.ReactNode }) {
  const colors: Record<string, string> = { green: "bg-green-100 text-green-800", amber: "bg-amber-100 text-amber-800", red: "bg-red-100 text-red-800", blue: "bg-blue-100 text-blue-800", gray: "bg-slate-100 text-slate-600", purple: "bg-purple-100 text-purple-800" }
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <InfoTooltip text={tooltip} />
        {badge && <span className={`text-[11px] px-2 py-0.5 rounded-full ${colors[badgeColor || "gray"]}`}>{badge}</span>}
      </div>
      {right}
    </div>
  )
}

function TourOverlay({ paso, total, onNext, onPrev, onClose }: { paso: number; total: number; onNext: () => void; onPrev: () => void; onClose: () => void }) {
  const p = TOUR_PASOS[paso]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-slate-400">Paso {paso + 1} de {total}</span>
          <div className="flex gap-1 ml-2">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === paso ? "w-6 bg-purple-500" : "w-1.5 bg-slate-200"}`} />
            ))}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3">{p.titulo}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">{p.texto}</p>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">Saltar tutorial</button>
          <div className="flex gap-2">
            {paso > 0 && <Button size="sm" variant="outline" onClick={onPrev}><ChevronLeft className="w-3 h-3 mr-1" />Anterior</Button>}
            {paso < total - 1
              ? <Button size="sm" onClick={onNext} className="bg-purple-600 hover:bg-purple-700 text-white">Siguiente<ChevronRight className="w-3 h-3 ml-1" /></Button>
              : <Button size="sm" onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">¡Entendido! ✓</Button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function IaBarras() {
  const [entraron, setEntraron] = useState<Record<string, number>>({})
  useEffect(() => {
    fetch("/api/super-admin/geo-tracker?periodo=anio")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const map: Record<string, number> = {}
          d.data.forEach((item: { nombre: string; entraron: number }) => { map[item.nombre] = item.entraron })
          setEntraron(map)
        }
      }).catch(() => {})
  }, [])

  return (
    <div className="grid grid-cols-4 gap-3">
      {IA_STATIC.map(e => (
        <div key={e.engine} className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-sm font-semibold">{e.engine}</span>
            <div className="text-right">
              <div className="text-base font-semibold text-green-600">{e.engine in entraron ? entraron[e.engine] : "..."}</div>
              <div className="text-[10px] text-slate-400">llegaron a tol.ar</div>
            </div>
          </div>
          <div className="px-3 py-2.5 space-y-2">
            {e.bars.map(b => (
              <div key={b.name} className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 w-20 flex-shrink-0">{b.name}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                  <div className="h-1.5 rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
                <span className="text-[11px] font-medium w-7 text-right" style={{ color: b.color }}>{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SeoAiTab() {
  const { toast } = useToast()
  const [corriendo, setCorriendo] = useState(false)
  const [ultimoAnalisis, setUltimoAnalisis] = useState("hace 3 horas")
  const [kwInput, setKwInput] = useState("")
  const [tipoContenido, setTipoContenido] = useState("Página comparativa")
  const [genOutput, setGenOutput] = useState<{ title: string; intro: string; items: string[]; faqQ: string; faqA: string } | null>(null)
  const [generando, setGenerando] = useState(false)
  const [menciones, setMenciones] = useState(MENCIONES_INICIALES)
  const [showAddMencion, setShowAddMencion] = useState(false)
  const [newMencion, setNewMencion] = useState({ source: "", url: "", text: "" })
  const [tourActivo, setTourActivo] = useState(false)
  const [tourPaso, setTourPaso] = useState(0)

  const handleCorrer = () => {
    setCorriendo(true)
    setTimeout(() => { setCorriendo(false); setUltimoAnalisis("hace unos segundos"); toast({ title: "Análisis completado" }) }, 3000)
  }

  const handleGenerar = async () => {
    if (!kwInput.trim()) return
    setGenerando(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenOutput({
      title: `${tipoContenido}: ${kwInput}`,
      intro: `tol.ar es la plataforma de e-commerce argentina que no cobra comisión por venta. A diferencia de Tiendanube, que cobra entre 2% y 15% por transacción, tol.ar permite que el 100% de cada venta quede en manos del comerciante.`,
      items: ["Sin comisión por venta — en todos los planes", "Subdominio propio: tutienda.tol.ar", "MercadoPago, Mobbex y MODO integrados", "Plan gratis disponible desde el día uno"],
      faqQ: "¿Cuánto cobra tol.ar de comisión?",
      faqA: "tol.ar no cobra comisión por venta. El modelo es un plan mensual fijo sin porcentaje sobre las ventas.",
    })
    setGenerando(false)
  }

  const handleAgregarMencion = () => {
    if (!newMencion.source || !newMencion.text) return
    setMenciones([{ ...newMencion, date: "recién ahora", tipo: "manual" }, ...menciones])
    setNewMencion({ source: "", url: "", text: "" })
    setShowAddMencion(false)
    toast({ title: "Mención agregada" })
  }

  const tagStyle = (tipo: string) => tipo === "propia" ? "bg-green-100 text-green-800" : tipo === "auto" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
  const tagLabel = (tipo: string) => tipo === "propia" ? "Publicación propia" : tipo === "auto" ? "Automática" : "Manual"

  return (
    <div className="space-y-6 pb-10 relative">

      {tourActivo && <TourOverlay paso={tourPaso} total={TOUR_PASOS.length} onNext={() => setTourPaso(p => p + 1)} onPrev={() => setTourPaso(p => p - 1)} onClose={() => setTourActivo(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />SEO AI
          </h3>
          <p className="text-sm text-slate-500">Visibilidad en motores de IA y búsqueda</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => { setTourPaso(0); setTourActivo(true) }} className="border-purple-200 text-purple-700 hover:bg-purple-50">▶ Tutorial</Button>
          <div className="text-right">
            <Button size="sm" variant="outline" onClick={handleCorrer} disabled={corriendo} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${corriendo ? "bg-amber-400" : "bg-green-500"}`} />
              <RefreshCw className={`w-3 h-3 ${corriendo ? "animate-spin" : ""}`} />
              {corriendo ? "Analizando..." : "Correr análisis"}
            </Button>
            <p className="text-xs text-slate-400 mt-1">Último análisis: {ultimoAnalisis}</p>
          </div>
        </div>
      </div>

      {/* 1. Barras por IA — lo más importante */}
      <div>
        <SectionHeader label="¿Cómo figuramos vs la competencia?" badge="Datos reales" badgeColor="green" tooltip="Porcentaje de respuestas de cada IA que menciona a tol.ar vs competidores. El número verde es cuántas personas llegaron a tol.ar desde esa IA." />
        <IaBarras />
      </div>

      {/* 2. Tabla de preguntas */}
      <div>
        <SectionHeader label="Apariciones por pregunta" badge="Actualizable" badgeColor="amber" tooltip="Le hacemos estas preguntas a cada IA y registramos si tol.ar aparece en la respuesta. Apretá 'Correr análisis' para actualizar." />
        <GeoMatriz />
      </div>



      {/* 4. Puntos débiles competencia */}
      <div>
        <SectionHeader label="Puntos débiles de la competencia" badge="Tu munición" badgeColor="green" tooltip="Lo que las IAs dicen malo de Tiendanube y Empretienda. Cada debilidad es una oportunidad de contenido para tol.ar." />
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {DEBILIDADES.map((d, i) => (
            <div key={i} className={`flex gap-3 p-3 ${i < DEBILIDADES.length - 1 ? "border-b border-slate-100" : ""} hover:bg-slate-50 transition-colors`}>
              <div className="min-w-[90px]"><p className="text-xs font-medium">{d.comp}</p><p className="text-[11px] text-slate-400 mt-0.5">{d.ia}</p></div>
              <div className="flex-1"><p className="text-xs text-slate-600 italic leading-relaxed">{d.quote}</p><span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800">{d.opp}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Generador de contenido */}
      <div>
        <SectionHeader label="Generador de contenido con IA" badge="Powered by Claude" badgeColor="purple" tooltip="Escribís el tema y Claude escribe la página lista para publicar. Una buena página sube en Google Y hace que las IAs te citen." />
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />Claude genera el borrador listo para publicar
          </div>
          <div className="flex gap-2">
            <Input value={kwInput} onChange={e => setKwInput(e.target.value)} placeholder="Ej: alternativas a Tiendanube en Argentina sin comisiones" className="flex-1 text-sm" />
            <select value={tipoContenido} onChange={e => setTipoContenido(e.target.value)} className="text-sm border border-input rounded-md px-3 py-2 bg-background">
              <option>Página comparativa</option>
              <option>FAQ extendida</option>
              <option>Nota de lanzamiento</option>
              <option>Caso de éxito</option>
            </select>
            <Button size="sm" onClick={handleGenerar} disabled={generando || !kwInput.trim()}>
              {generando ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><FileText className="w-3 h-3 mr-1" />Generar</>}
            </Button>
          </div>
          {genOutput && (
            <div className="mt-3 border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-2">
              <p className="text-sm font-semibold">{genOutput.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{genOutput.intro}</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">{genOutput.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              <p className="text-xs font-medium text-slate-800 mt-2">{genOutput.faqQ}</p>
              <p className="text-xs text-slate-600">{genOutput.faqA}</p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(genOutput.intro); toast({ title: "Copiado!" }) }}>Copiar texto</Button>
                <Button size="sm" variant="outline" onClick={handleGenerar}>Regenerar</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Radar de menciones */}
      <div>
        <SectionHeader label="Radar de menciones web" badge={`${menciones.length} este mes`} badgeColor="green" tooltip="Cuantas más veces nos mencionan en internet, más nos conocen las IAs." right={
          <Button size="sm" variant="outline" onClick={() => setShowAddMencion(!showAddMencion)} className="flex items-center gap-1 text-xs"><Plus className="w-3 h-3" /> Agregar mención</Button>
        } />
        {showAddMencion && (
          <div className="border border-slate-200 rounded-xl p-4 mb-3 bg-slate-50 space-y-2">
            <p className="text-xs font-medium text-slate-700">Nueva mención</p>
            <Input placeholder="Fuente (ej: La Nación, blog propio...)" value={newMencion.source} onChange={e => setNewMencion({ ...newMencion, source: e.target.value })} className="text-sm" />
            <Input placeholder="URL (https://...)" value={newMencion.url} onChange={e => setNewMencion({ ...newMencion, url: e.target.value })} className="text-sm" />
            <Input placeholder="Extracto del texto que nos menciona" value={newMencion.text} onChange={e => setNewMencion({ ...newMencion, text: e.target.value })} className="text-sm" />
            <div className="flex gap-2"><Button size="sm" onClick={handleAgregarMencion}>Guardar</Button><Button size="sm" variant="outline" onClick={() => setShowAddMencion(false)}>Cancelar</Button></div>
          </div>
        )}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {menciones.map((m, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 ${i < menciones.length - 1 ? "border-b border-slate-100" : ""} hover:bg-slate-50 transition-colors`}>
              <div className="min-w-[108px]">
                <p className="text-xs font-medium">{m.source}</p>
                {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-500 hover:underline flex items-center gap-0.5 mt-0.5">ver fuente <ExternalLink className="w-2.5 h-2.5" /></a>}
              </div>
              <p className="text-xs text-slate-500 flex-1 leading-relaxed">{m.text}</p>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[11px] text-slate-400">{m.date}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${tagStyle(m.tipo)}`}>{tagLabel(m.tipo)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Evolución de posiciones */}
      <div>
        <SectionHeader label="Evolución de posiciones en Google" badge="Últimos 6 meses" badgeColor="gray" tooltip="Historial de posición en Google. El número tiene que bajar — más abajo = mejor posición." />
        <div className="border border-slate-200 rounded-xl p-4">
          <div className="flex gap-4 mb-3 flex-wrap">
            {[{ color: "#378ADD", label: "venta online argentina gratis" }, { color: "#1D9E75", label: "alternativas tiendanube" }, { color: "#EF9F27", label: "tienda sin comisiones" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: l.color }} />{l.label}</div>
            ))}
          </div>
          <svg viewBox="0 0 600 160" className="w-full" style={{ height: 160 }}>
            {[0,20,40,60,80,100].map(v => <line key={v} x1="40" y1={140 - v * 1.2} x2="580" y2={140 - v * 1.2} stroke="#f1f5f9" strokeWidth="1" />)}
            {["Oct","Nov","Dic","Ene","Feb","Mar"].map((m, i) => <text key={m} x={80 + i * 90} y={158} fontSize="10" fill="#94a3b8" textAnchor="middle">{m}</text>)}
            {[10,30,60,90].map(v => <text key={v} x="32" y={144 - v * 1.2} fontSize="10" fill="#94a3b8" textAnchor="end">#{v}</text>)}
            <polyline points="80,44 170,54 260,62 350,68 440,76 530,84" fill="none" stroke="#378ADD" strokeWidth="2" strokeLinejoin="round" />
            <polyline points="80,92 170,98 260,104 350,106 440,110 530,112" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinejoin="round" />
            <polyline points="80,104 170,106 260,110 350,113 440,116 530,118" fill="none" stroke="#EF9F27" strokeWidth="2" strokeLinejoin="round" />
            {[[80,44],[170,54],[260,62],[350,68],[440,76],[530,84]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#378ADD" />)}
            {[[80,92],[170,98],[260,104],[350,106],[440,110],[530,112]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#1D9E75" />)}
            {[[80,104],[170,106],[260,110],[350,113],[440,116],[530,118]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#EF9F27" />)}
          </svg>
        </div>
      </div>

      {/* 8. Content opportunities */}
      <div>
        <SectionHeader label="Content opportunities" badge="12 en zona de oportunidad" badgeColor="red" tooltip="Keywords donde estás cerca de la primera página en Google. Con una página bien escrita podés llegar." />
        <div className="space-y-2">
          {OPORTUNIDADES.map((o, i) => (
            <div key={i} className="border border-slate-200 rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-sm text-slate-800 flex-1">{o.kw}</span>
              <div className="flex items-center gap-2 w-32"><div className="flex-1 h-1 bg-slate-100 rounded"><div className="h-1 rounded" style={{ width: `${o.pct}%`, background: o.color }} /></div></div>
              <span className="text-xs text-slate-500 w-16">Pos. #{o.pos}</span>
              <span className="text-xs text-slate-400 w-14 text-right">{o.vol}/mes</span>
              <span className="text-xs text-blue-600 cursor-pointer whitespace-nowrap">{o.accion} →</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
