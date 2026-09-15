"use client"
import { useEffect, useRef } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Search, Play, MapPin, Monitor, Clock, MousePointer, FileText } from "lucide-react"
import Link from "next/link"

function AnimatedDashboard() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const waypoints = [
      {x:30,y:40,wait:800},{x:55,y:35,wait:600,click:true},
      {x:60,y:55,wait:1000},{x:40,y:65,wait:800},
      {x:35,y:75,wait:600,click:true},{x:60,y:75,wait:800,click:true},
      {x:70,y:60,wait:600},{x:65,y:40,wait:800},
      {x:45,y:30,wait:600,click:true},{x:30,y:50,wait:1000},
    ]
    let wpIdx = 0
    let elapsed = 0
    const totalTime = 165
    let cursorTimer: ReturnType<typeof setTimeout>
    let tlTimer: ReturnType<typeof setTimeout>

    function moveCursor() {
      if (!cursorRef.current || !ringRef.current || !frameRef.current || !areaRef.current) return
      const wp = waypoints[wpIdx % waypoints.length]
      const frame = frameRef.current.getBoundingClientRect()
      const area = areaRef.current.getBoundingClientRect()
      const fx = frame.left - area.left + frame.width * wp.x / 100
      const fy = frame.top - area.top + frame.height * wp.y / 100
      cursorRef.current.style.left = fx + 'px'
      cursorRef.current.style.top = fy + 'px'
      if (wp.click) {
        setTimeout(() => {
          if (!ringRef.current) return
          ringRef.current.style.left = fx + 'px'
          ringRef.current.style.top = fy + 'px'
          ringRef.current.classList.remove('ring-animate')
          void ringRef.current.offsetWidth
          ringRef.current.classList.add('ring-animate')
        }, 800)
      }
      wpIdx++
      cursorTimer = setTimeout(moveCursor, wp.wait + 800)
    }

    function updateTL() {
      elapsed += 0.5
      if (elapsed > totalTime) elapsed = 0
      if (fillRef.current) fillRef.current.style.width = (elapsed / totalTime * 100) + '%'
      if (timeRef.current) {
        const m = Math.floor(elapsed / 60)
        const s = Math.floor(elapsed % 60)
        timeRef.current.textContent = m + ':' + String(s).padStart(2, '0')
      }
      tlTimer = setTimeout(updateTL, 500)
    }

    cursorTimer = setTimeout(moveCursor, 500)
    tlTimer = setTimeout(updateTL, 500)
    return () => { clearTimeout(cursorTimer); clearTimeout(tlTimer) }
  }, [])

  return (
    <div className="bg-gray-100 rounded-xl p-4">
      <style>{`
        .lupa-cursor { position:absolute; width:12px; height:12px; pointer-events:none; z-index:10; transition: left 0.8s cubic-bezier(.4,0,.2,1), top 0.8s cubic-bezier(.4,0,.2,1); }
        .lupa-ring { position:absolute; width:20px; height:20px; border-radius:50%; border:2px solid #1565c0; pointer-events:none; z-index:9; opacity:0; transform:translate(-50%,-50%) scale(0.5); }
        .ring-animate { animation: lupaClick 0.5s ease-out forwards; }
        @keyframes lupaClick { 0%{opacity:1;transform:translate(-50%,-50%) scale(0.5)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2)} }
      `}</style>
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-[#1a237e] px-4 py-2.5 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          <span className="text-white/70 text-xs ml-2"><span className="text-white font-medium">lupa</span> · mitienda.tol.ar</span>
        </div>
        <div className="flex" style={{height: '320px'}}>
          <div className="w-36 border-r border-gray-100 p-3 flex-shrink-0">
            <div className="text-sm font-medium mb-3"><span className="text-[#1565c0]">lupa</span></div>
            <div className="text-[9px] text-gray-400 uppercase tracking-wider px-2 mb-1">Sesiones</div>
            <div className="px-2 py-1.5 rounded-md bg-[#1a237e] text-white text-[11px] flex justify-between mb-1">
              <span>mitienda.tol.ar</span><span className="opacity-70">24</span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider px-2 mb-1">Filtros</div>
              <div className="px-2 py-1 rounded-md bg-[#1a237e] text-white text-[10px] mb-0.5">Completadas</div>
              <div className="px-2 py-1 text-gray-500 text-[10px]">Activas</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap text-[10px] text-gray-500">
              <span className="font-mono text-gray-800">a4f2b1c8...</span>
              <span className="text-gray-300">|</span>
              <span>10:32 AM</span>
              <span className="text-gray-300">|</span>
              <span>12 clicks</span>
              <span className="text-gray-300">|</span>
              <span>2:45</span>
              <span className="text-gray-300">|</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[9px]">Buenos Aires, AR</span>
            </div>
            <div className="flex-1 bg-gray-300 relative overflow-hidden flex items-center justify-center" ref={areaRef}>
              <div className="bg-white rounded" style={{width:'75%',height:'85%'}} ref={frameRef}>
                <div className="bg-black h-7 flex items-center px-3 gap-2">
                  <span className="text-white/80 text-[9px] font-medium tracking-wider">MI TIENDA</span>
                  <div className="flex gap-2 ml-auto">
                    <span className="text-white/50 text-[8px]">Inicio</span>
                    <span className="text-white/50 text-[8px]">Productos</span>
                  </div>
                </div>
                <div className="h-20 bg-gray-100 flex items-center px-3 gap-2">
                  <div className="w-14 h-16 bg-gray-300 rounded flex-shrink-0"></div>
                  <div>
                    <div className="text-[9px] font-semibold text-gray-800 mb-1">Tu tienda online</div>
                    <div className="text-[7px] text-gray-500 mb-1.5 leading-relaxed">Los mejores productos.<br/>Envíos a todo el país.</div>
                    <div className="bg-black text-white text-[7px] px-2 py-1 rounded inline-block">Ver productos</div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-[8px] text-gray-400 text-center mb-1.5 uppercase tracking-wider">Productos</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[['#e8d5c4','$2.500'],['#c4d5e8','$3.800'],['#c4e8c4','$1.900']].map(([bg,price],i) => (
                      <div key={i} className="bg-gray-100 rounded overflow-hidden">
                        <div className="h-8" style={{background:bg}}></div>
                        <div className="p-1">
                          <div className="text-[6px] text-gray-600 font-medium">Prod {i+1}</div>
                          <div className="text-[6px] text-blue-700">{price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lupa-cursor" ref={cursorRef}>
                <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
                  <path d="M1 1l4 10 2-4 4-2L1 1z" fill="#1565c0" stroke="#fff" strokeWidth="0.8"/>
                </svg>
              </div>
              <div className="lupa-ring" ref={ringRef}></div>
            </div>
            <div className="border-t border-gray-100 px-3 py-2 bg-white">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1565c0] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white fill-white"/>
                </div>
                <span className="text-[10px] text-gray-500" ref={timeRef}>0:00</span>
                <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-[#1565c0] rounded transition-all duration-500" ref={fillRef} style={{width:'0%'}}></div>
                </div>
                <span className="text-[10px] text-gray-500">2:45</span>
              </div>
            </div>
            <div className="border-t border-gray-100">
              {[
                ['a4f2b1...','10:32','12','2:45','Buenos Aires'],
                ['b7e3d2...','09:15','5','1:20','Rosario'],
              ].map(([id,time,clicks,dur,city],i) => (
                <div key={i} className={`px-3 py-1.5 flex items-center gap-2 text-[10px] text-gray-500 border-b border-gray-50 ${i===0?'bg-blue-50':''}`}>
                  <span className="font-mono text-gray-800">{id}</span>
                  <span>{time}</span>
                  <span>{clicks} clicks</span>
                  <span>{dur}</span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[9px]">{city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: Play, title: "Grabaciones de sesiones", desc: "Reproducí cada visita como un video, con movimientos de mouse y clicks." },
  { icon: MapPin, title: "Ciudad y país", desc: "Sabé desde dónde te visitan: ciudad, país, dispositivo y navegador." },
  { icon: Monitor, title: "Celular o computadora", desc: "Detectamos si entran desde móvil, tablet o desktop automáticamente." },
  { icon: Clock, title: "Duración real", desc: "Cuánto tiempo estuvo en tu tienda y en qué páginas pasó más tiempo." },
  { icon: MousePointer, title: "Clicks registrados", desc: "Cada click queda marcado en la línea de tiempo para análisis rápido." },
  { icon: FileText, title: "Páginas visitadas", desc: "Sabé cuántas páginas recorrió y en qué orden las visitó." },
]

const USE_CASES = [
  { title: "¿Por qué no compran?", desc: "Mirá dónde se frenan y qué los hace irse sin comprar." },
  { title: "¿Qué productos miran más?", desc: "Descubrí cuáles son los más visitados aunque no tengan ventas." },
  { title: "¿Desde dónde entran?", desc: "Conocé las ciudades y provincias de tus visitantes." },
  { title: "¿Celular o computadora?", desc: "Optimizá tu tienda para el dispositivo que más usan tus clientes." },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function LupaPageClient({ brand = "tol" }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />

      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Search className="h-4 w-4" />
            3 meses gratis para tiendas tol.ar
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-[#1565c0]">Lupa</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
            Mirá exactamente cómo navegan tus clientes en tu tienda. Grabaciones reales de cada visita, sin instalaciones ni configuración.
          </p>
          <p className="text-gray-400 text-sm mb-8">Activalo y empezá a entender a tus clientes hoy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#1565c0] hover:bg-[#1248a0] text-lg px-8 py-6" asChild>
              <Link href="/plan-cositas">Activar Lupa</Link>
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-4">3 meses gratis, después $1 USD / mes. Sin tarjeta para empezar.</p>
        </div>
      </section>

      {/* Dashboard animado */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-xs text-[#1565c0] uppercase tracking-widest mb-2">El dashboard</p>
            <h2 className="text-2xl font-bold">Todo en un solo lugar</h2>
          </div>
          <AnimatedDashboard />
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-[#1565c0] uppercase tracking-widest mb-2">Para qué sirve</p>
            <h2 className="text-3xl font-bold mb-4">Dejá de adivinar, empezá a ver</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Cada visita a tu tienda queda grabada. Podés ver exactamente qué hizo cada cliente y por qué no compró.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-6 hover:border-blue-100 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[#1565c0]" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs text-[#1565c0] uppercase tracking-widest mb-2">Casos de uso</p>
            <h2 className="text-3xl font-bold">¿Para qué lo usan los dueños de tiendas?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {USE_CASES.map((u, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6">
                <h3 className="font-semibold mb-2">{u.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-[#1565c0] uppercase tracking-widest mb-2">Precio</p>
          <h2 className="text-3xl font-bold mb-10">Simple y accesible</h2>
          <div className="border-2 border-[#1565c0] rounded-2xl p-8 max-w-sm mx-auto">
            <div className="inline-block bg-[#1565c0] text-white text-xs px-4 py-1.5 rounded-full mb-4">3 meses gratis</div>
            <h3 className="text-lg font-semibold mb-2">Para dueños de tiendas tol.ar</h3>
            <div className="text-5xl font-bold text-[#1565c0] mb-1">$1 <span className="text-xl text-gray-400 font-normal">USD / mes</span></div>
            <p className="text-green-600 text-sm mb-6">Los primeros 3 meses son gratis. Sin sorpresas.</p>
            <ul className="text-left space-y-3 mb-8">
              {['Grabaciones ilimitadas','Todas tus páginas monitoreadas','Ciudad, país y dispositivo','Historial completo de sesiones','Sin límite de visitas'].map((item,i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M3 8l3.5 3.5L13 5" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-[#1565c0] hover:bg-[#1248a0] py-6 text-base" asChild>
              <Link href="/plan-cositas">Activar Lupa</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#1a237e] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Querés saber qué hacen tus clientes?</h2>
          <p className="text-white/70 text-lg mb-8">Activá Lupa en tu tienda tol.ar y empezá a ver hoy mismo.</p>
          <Button size="lg" className="bg-white text-[#1565c0] hover:bg-gray-100 text-base px-8 py-6" asChild>
            <Link href="/plan-cositas">Empezar gratis</Link>
          </Button>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  )
}
