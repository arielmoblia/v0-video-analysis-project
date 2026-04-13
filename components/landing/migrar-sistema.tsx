"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Upload, Sparkles, CheckCircle2, RefreshCw } from "lucide-react"

const STEPS = [
  "Descargá planilla",
  "Subí archivo",
  "IA detecta tipo",
  "Columnas",
  "Preview",
  "Importando",
  "Destino",
  "¡Lista!",
]

const PLATS: Record<string, { label: string; title: string; guide: string }> = {
  ml:  { label: "Mercado Libre",       title: "Cómo descargar tu catálogo de ML",      guide: "Cómo exportar tus productos de Mercado Libre" },
  tn:  { label: "Tiendanube",          title: "Exportar catálogo desde Tiendanube",     guide: "Cómo exportar tus productos de Tiendanube" },
  emp: { label: "Empretienda",         title: "Descargar productos de Empretienda",     guide: "Cómo exportar tus productos de Empretienda" },
  wp:  { label: "WordPress/Woo",       title: "Exportar productos desde WooCommerce",   guide: "Cómo exportar tus productos de WooCommerce" },
  csv: { label: "Ya tengo mi CSV",     title: "Usá nuestra plantilla de ejemplo",       guide: "Formato esperado del archivo CSV" },
}

const TEMPLATES = [
  { key: "indumentaria", name: "Indumentaria",  vars: "talle, color",        ai: true,  img: "/images/templates/template-indumentaria.png" },
  { key: "calzado",      name: "Calzado",        vars: "número, color",       ai: false, img: "/images/templates/template-calzado.png" },
  { key: "perfumeria",   name: "Perfumería",     vars: "ml, concentración",   ai: false, img: "/images/templates/template-cosmeticos.png" },
  { key: "tecnologia",   name: "Tecnología",     vars: "capacidad, color",    ai: false, img: "/images/templates/template-electronicos.png" },
  { key: "hogar",        name: "Hogar",          vars: "tamaño, material",    ai: false, img: "/images/templates/vintage-retro-store-classic-artisan.jpg" },
  { key: "generico",     name: "Genérico",       vars: "sin variantes",       ai: false, img: "/images/templates/minimal-clean-white-store-modern.jpg" },
]

const COLUMNS = [
  ["titulo",       "Nombre del producto"],
  ["precio_venta", "Precio"],
  ["descripcion",  "Descripción"],
  ["url_foto_1",   "URL de foto"],
  ["talle",        "Variante: talle"],
  ["color",        "Variante: color"],
]

const PREVIEW = [
  { name: "Remera básica blanca",  price: "$22.500", talles: "S M L XL", colores: "Blanco, Negro", ok: true,  img: "/images/templates/clothing-fashion-store-modern-shirts-pants-apparel.jpg" },
  { name: "Pantalón cargo verde",  price: "—",       talles: "M L XL",   colores: "Verde, Negro",  ok: false, img: "/images/templates/fashion-clothing-store-modern-shoes-apparel.jpg" },
  { name: "Buzo con capucha gris", price: "$38.000", talles: "S M L",    colores: "Gris, Azul",    ok: true,  img: "/images/templates/bold-colorful-vibrant-store-young.jpg" },
]

export function MigrarSistema() {
  const [step, setStep] = useState(1)
  const [plat, setPlat] = useState("ml")
  const [tmpl, setTmpl] = useState("indumentaria")
  const [count, setCount] = useState(0)
  const [importing, setImporting] = useState(false)
  const [destino, setDestino] = useState("existente")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [subdomain, setSubdomain] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    imported: number
    warnings: number
    storeUrl: string
    adminUrl: string
    adminPassword: string
    subdomain: string
  } | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const total = 32

  const next = () => setStep(s => Math.min(s + 1, 8))
  const prev = () => setStep(s => Math.max(s - 1, 1))
  const goTo = (n: number) => { if (n <= step) setStep(n) }

  useEffect(() => {
    if (step === 6 && !importing) {
      setImporting(true)
      setCount(0)
      intervalRef.current = setInterval(() => {
        setCount(c => {
          const next = Math.min(c + 2, total)
          if (next >= total) {
            clearInterval(intervalRef.current!)
            setTimeout(() => setStep(7), 800)
          }
          return next
        })
      }, 80)
    }
    if (step !== 6) {
      setImporting(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [step])

  const v = PLATS[plat]

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">

      {/* STEPPER */}
      <div className="flex items-start mb-8">
        {STEPS.map((label, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <div key={label} className="flex-1 flex flex-col items-center relative">
              {i < STEPS.length - 1 && (
                <div className={`absolute top-3 left-1/2 w-full h-px ${done ? "bg-orange-400" : "bg-border"}`} />
              )}
              <button
                onClick={() => goTo(n)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 relative transition-colors ${
                  done   ? "bg-orange-500 text-white" :
                  active ? "bg-white border-2 border-orange-500 text-orange-500" :
                           "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {done ? "✓" : n}
              </button>
              <span className={`text-[9px] text-center mt-1 max-w-[52px] leading-tight ${active ? "text-orange-500 font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* CARD CONTENIDO */}
      <div className="border border-border rounded-2xl p-6 bg-background">

        {/* PASO 1 — PLATAFORMA + VIDEO */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-bold mb-1 text-center">¿De dónde venís?</h2>
            <p className="text-sm text-muted-foreground mb-5 text-center">Elegí tu plataforma y te mostramos exactamente cómo exportar tus productos.</p>
            <div className="flex gap-2 mb-6 justify-center">
              {Object.entries(PLATS).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => setPlat(k)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${plat === k ? "border-orange-500 text-orange-600 bg-orange-50" : "border-border text-muted-foreground hover:border-orange-300"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold mb-3">{v.guide}</p>
            <div className="bg-zinc-900 rounded-xl h-40 flex flex-col items-center justify-center gap-3 relative mb-3">
              <span className="absolute top-3 left-3 text-xs text-white/60 bg-black/40 px-2 py-0.5 rounded">{v.label}</span>
              <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <p className="text-white/80 text-sm">{v.title}</p>
            </div>
            <p className="text-xs text-muted-foreground">¿No encontrás la opción? Mirá el video de 2 minutos.</p>
            <NavRow onNext={next} />
          </>
        )}

        {/* PASO 2 — SUBIR ARCHIVO */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-bold mb-1">Subí tu archivo</h2>
            <p className="text-sm text-muted-foreground mb-5">Aceptamos <strong>.csv</strong> y <strong>.xlsx</strong> — el formato que exporta {v.label}. Hasta 10 MB.</p>
            <label
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 bg-muted/40 mb-4 cursor-pointer transition-colors ${file ? "border-orange-400 bg-orange-50/40" : "border-border hover:border-orange-300"}`}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-orange-400") }}
              onDragLeave={e => { e.currentTarget.classList.remove("border-orange-400") }}
              onDrop={e => {
                e.preventDefault()
                e.currentTarget.classList.remove("border-orange-400")
                const dropped = e.dataTransfer.files?.[0]
                if (dropped) setFile(dropped)
              }}
            >
              <Upload className="w-8 h-8 text-orange-500" />
              <p className="font-semibold text-foreground">
                {file ? file.name : "Arrastrá tu archivo acá"}
              </p>
              <p className="text-sm text-muted-foreground">
                {file ? `${(file.size / 1024).toFixed(0)} KB — listo para importar` : "o hacé clic para buscarlo — CSV o Excel hasta 10 MB"}
              </p>
              {file && (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">✓ Archivo seleccionado</span>
              )}
              {!file && (
                <span className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium mt-1">
                  Elegir archivo
                </span>
              )}
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <NavRow onPrev={prev} onNext={next} />
          </>
        )}

        {/* PASO 3 — IA DETECTA */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-bold mb-1">La IA detecta el tipo de producto</h2>
            <p className="text-sm text-muted-foreground mb-5">Analizamos las columnas de tu archivo y elegimos el template más adecuado para tus variantes.</p>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-5 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-base">✦</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-purple-800">Detectamos: Indumentaria</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">✦ IA · 94% seguro</span>
                </div>
                <p className="text-xs text-purple-600 mb-2">Columnas encontradas: talle, color, género</p>
                <div className="h-1 rounded-full bg-purple-200"><div className="h-full w-[94%] bg-purple-500 rounded-full" /></div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">¿No es correcto? Elegí el tipo de producto:</p>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-48 shrink-0">
                {TEMPLATES.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTmpl(t.key)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${tmpl === t.key ? "border-orange-500 bg-orange-50" : t.ai ? "border-purple-300 bg-purple-50" : "border-border hover:border-orange-300"}`}
                  >
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.vars}</p>
                  </button>
                ))}
              </div>
              <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted min-h-[320px]">
                {TEMPLATES.filter(t => t.key === tmpl).map(t => (
                  <img
                    key={t.key}
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover object-top"
                  />
                ))}
              </div>
            </div>
            <NavRow onPrev={prev} onNext={next} nextLabel="Confirmar →" />
          </>
        )}

        {/* PASO 4 — COLUMNAS */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-bold mb-1">Revisá las columnas</h2>
            <p className="text-sm text-muted-foreground mb-5">Confirmá que cada columna corresponda al campo correcto. Podés ignorar las que no necesitás.</p>
            <div className="space-y-2 mb-4">
              {COLUMNS.map(([col, def]) => (
                <div key={col} className="flex items-center gap-3">
                  <div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground min-w-[130px]">{col}</div>
                  <span className="text-muted-foreground">→</span>
                  <select className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
                    <option>{def}</option>
                    <option>Ignorar columna</option>
                  </select>
                </div>
              ))}
            </div>
            <NavRow onPrev={prev} onNext={next} />
          </>
        )}

        {/* PASO 5 — PREVIEW */}
        {step === 5 && (
          <>
            <h2 className="text-lg font-bold mb-1">Preview — revisá antes de importar</h2>
            <p className="text-sm text-muted-foreground mb-4">Así van a quedar tus productos con template de <strong>Indumentaria</strong>.</p>
            <div className="border border-border rounded-xl overflow-hidden mb-3">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    {["Foto","Nombre","Precio","Talles","Colores","Estado"].map(h => (
                      <th key={h} className="text-left p-2 font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW.map(row => (
                    <tr key={row.name} className="border-t border-border">
                      <td className="p-2">
                        <img src={row.img} alt={row.name} className="w-10 h-10 rounded-lg object-cover" />
                      </td>
                      <td className="p-2 text-foreground">{row.name}</td>
                      <td className="p-2 text-muted-foreground">{row.price}</td>
                      <td className="p-2 text-muted-foreground">{row.talles}</td>
                      <td className="p-2 text-muted-foreground">{row.colores}</td>
                      <td className="p-2">
                        {row.ok
                          ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">listo</span>
                          : <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">sin precio</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mb-4">32 productos · 31 listos · 1 sin precio (podés editarlo después)</p>
            <NavRow onPrev={prev} onNext={next} nextLabel="Importar 32 productos →" />
          </>
        )}

        {/* PASO 6 — IMPORTANDO */}
        {step === 6 && (
          <>
            <h2 className="text-lg font-bold mb-1">Importando tus productos…</h2>
            <p className="text-sm text-muted-foreground mb-5">No cierres esta pantalla hasta que termine.</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { n: count,        label: "importados",   color: "text-green-600" },
                { n: 1,            label: "advertencias", color: "text-amber-600" },
                { n: total - count, label: "pendientes",  color: "text-muted-foreground" },
              ].map(s => (
                <div key={s.label} className="bg-muted rounded-xl p-3 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.n}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-muted mb-2 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${Math.round((count/total)*100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              {count < total ? `Importando producto ${count} de ${total}…` : "¡Listo!"}
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <button onClick={prev} className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <button disabled className="flex items-center gap-1 text-sm text-white bg-orange-300 rounded-lg px-4 py-2 cursor-not-allowed">
                Importando… <RefreshCw className="w-4 h-4 animate-spin" />
              </button>
            </div>
          </>
        )}

        {/* PASO 8 — BIENVENIDA FINAL */}
        {step === 8 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
              <p className="text-xs font-semibold text-orange-500 mb-1">{destino === "nueva" ? "nombretienda.tol.ar" : "mitienda.tol.ar"}</p>
              <h2 className="text-xl font-bold mb-2">¡Tu tienda online está lista!</h2>
              <p className="text-sm text-muted-foreground">Te enviamos un email con los datos de acceso. Revisá spam si es necesario.</p>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                {apiError}
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm">
                <p className="font-semibold text-green-700 mb-1">✓ Importación completada</p>
                <p className="text-green-600">{result.imported} productos importados · {result.warnings} advertencias</p>
              </div>
            )}

            <div className="mb-5">
              <label className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1">
                Email <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(false) }}
                placeholder="tu@email.com"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground outline-none transition-colors ${emailError ? "border-red-400 bg-red-50" : "border-border focus:border-orange-400"}`}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">El email es obligatorio para enviarte los datos de acceso.</p>}
            </div>

            <div className="border border-border rounded-xl overflow-hidden mb-5 text-sm">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground mb-0.5">Tu tienda:</p>
                <a href={result?.storeUrl || "#"} target="_blank" className="text-orange-500 hover:underline">
                  {result?.storeUrl || `https://${subdomain}.tol.ar/`}
                </a>
              </div>
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground mb-0.5">Panel de administración:</p>
                <a href={result?.adminUrl || "#"} target="_blank" className="text-orange-500 hover:underline">
                  {result?.adminUrl || `https://${subdomain}.tol.ar/admin`}
                </a>
              </div>
              <div className="px-4 py-3 bg-muted/50">
                <p className="font-semibold text-foreground mb-2">Credenciales de acceso:</p>
                <div className="bg-background border border-border rounded-lg px-3 py-2 font-mono text-xs space-y-1">
                  <p>Usuario: <strong>{result?.subdomain || subdomain || "nombretienda"}</strong></p>
                  <p>Contraseña: <strong>{result?.adminPassword || "—"}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={prev} className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <a href={result ? result.storeUrl : "https://tol.ar"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Ver mi tienda <ArrowRight className="w-4 h-4" />
              </a>
              <a href={result ? result.adminUrl : "https://tol.ar"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Ir al admin <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </>
        )}

        {/* PASO 7 — DESTINO */}
        {step === 7 && (
          <>

            <p className="text-sm font-semibold mb-3">¿A dónde importamos tus productos?</p>
            <div className="border border-border rounded-xl overflow-hidden mb-6">
              <button
                onClick={() => setDestino("existente")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border transition-colors ${destino === "existente" ? "bg-orange-50" : "hover:bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${destino === "existente" ? "border-orange-500" : "border-border"}`}>
                  {destino === "existente" && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Importar a una tienda existente</p>
                  <p className="text-xs text-muted-foreground">Ya tengo cuenta en tol.ar</p>
                </div>
              </button>
              {destino === "existente" && (
                <div className="px-4 py-3 bg-orange-50/50">
                  <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
                    <option>mitienda.tol.ar</option>
                    <option>otratienda.tol.ar</option>
                  </select>
                </div>
              )}
              <button
                onClick={() => setDestino("nueva")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${destino === "nueva" ? "bg-orange-50" : "hover:bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${destino === "nueva" ? "border-orange-500" : "border-border"}`}>
                  {destino === "nueva" && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Crear tienda nueva</p>
                  <p className="text-xs text-muted-foreground">Soy nuevo en tol.ar</p>
                </div>
              </button>
              {destino === "nueva" && (
                <div className="px-4 py-3 bg-orange-50/50">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                    <input
                      type="text"
                      placeholder="nombredetutienda"
                      value={subdomain}
                      onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                      className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-foreground"
                    />
                    <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-l border-border">.tol.ar</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1">
                Email <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(false) }}
                placeholder="tu@email.com"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground outline-none transition-colors ${emailError ? "border-red-400 bg-red-50" : "border-border focus:border-orange-400"}`}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">El email es obligatorio.</p>}
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mt-3">
                {apiError}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
              <button onClick={prev} className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <button
                onClick={async () => {
                  if (!email) { setEmailError(true); return; }
                  if (!file) { setApiError("Subí un archivo CSV en el paso 2"); return; }
                  if (destino === "nueva" && subdomain.length < 4) { setApiError("El nombre debe tener al menos 4 caracteres"); return; }
                  setLoading(true)
                  setApiError(null)
                  try {
                    const fd = new FormData()
                    fd.append("file", file)
                    fd.append("email", email)
                    fd.append("subdomain", subdomain)
                    fd.append("template", tmpl)
                    fd.append("destino", destino)
                    const res = await fetch("/api/migrar", { method: "POST", body: fd })
                    const data = await res.json()
                    if (!res.ok || !data.success) {
                      setApiError(data.error || "Error al importar")
                      setLoading(false)
                      return
                    }
                    setResult(data)
                    setLoading(false)
                    next()
                  } catch(e) {
                    setApiError("Error de conexión — intentá de nuevo")
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm rounded-lg px-5 py-2 font-medium transition-colors"
              >
                {loading ? "Creando tienda…" : "Confirmar"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

function NavRow({ onPrev, onNext, nextLabel = "Continuar →" }: {
  onPrev?: () => void
  onNext?: () => void
  nextLabel?: string
}) {
  return (
    <div className="flex justify-between items-center pt-5 border-t border-border mt-5">
      {onPrev
        ? <button onClick={onPrev} className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /> Volver</button>
        : <div />
      }
      {onNext && (
        <button onClick={onNext} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg px-5 py-2 font-medium transition-colors">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
