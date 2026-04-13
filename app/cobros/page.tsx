"use client"
import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

const MP_DEBITO  = 1.49 * 1.21
const MP_CREDITO = 6.29 * 1.21

interface Metodo {
  id: string; logo: string; nombre: string; desc: string
  comisionLabel: string; comision: number; acreditacion: string
  pasos: string[]; nota?: string; proximo?: boolean; variable?: boolean
}

const METODOS: Metodo[] = [
  { id:"efectivo", logo:"💵", nombre:"Efectivo", desc:"El cliente paga en mano",
    comisionLabel:"0%", comision:0, acreditacion:"Inmediata",
    pasos:["El cliente elige Efectivo al comprar.","Recibis el dinero cuando entregas el pedido.","Confirmas el pago desde tu panel."],
    nota:"Sin intermediarios. Cero comision." },
  { id:"transferencia", logo:"🏦", nombre:"Transferencia bancaria", desc:"CVU o CBU, sin intermediarios",
    comisionLabel:"0%", comision:0, acreditacion:"Generalmente inmediata",
    pasos:["El cliente elige Transferencia al comprar.","Ve tus datos bancarios automaticamente.","Confirmas el pago en tu panel cuando lo recibis."],
    nota:"Sin comision de ningun intermediario." },
  { id:"mp-debito", logo:"🔵", nombre:"MercadoPago — debito / QR / saldo", desc:"Tarjeta de debito, QR o saldo MP",
    comisionLabel:(1.49*1.21).toFixed(2)+"% c/IVA", comision:1.49*1.21, acreditacion:"35 dias habiles",
    pasos:["El cliente paga con debito, QR o saldo de MP.","MercadoPago descuenta su comision automaticamente.","Recibis el dinero en tu cuenta MP a los 35 dias habiles."],
    nota:"Comision base 1,49% + IVA 21%. Fuente: mercadopago.com.ar/ayuda/220 (vigente desde 6/3/2026)." },
  { id:"mp-credito-1", logo:"🔵", nombre:"MercadoPago — credito 1 cuota", desc:"Tarjeta de credito, acreditacion inmediata",
    comisionLabel:(6.29*1.21).toFixed(2)+"% c/IVA", comision:6.29*1.21, acreditacion:"Inmediata",
    pasos:["El cliente paga con tarjeta de credito en 1 cuota.","MercadoPago descuenta su comision automaticamente.","Recibis el dinero en tu cuenta MP de inmediato."],
    nota:"Comision base 6,29% + IVA 21%. Fuente: mercadopago.com.ar/ayuda/220 (vigente desde 6/3/2026)." },
  { id:"mp-credito-3", logo:"🔵", nombre:"MercadoPago — credito 3 cuotas", desc:"El cliente paga en cuotas",
    comisionLabel:(6.29*1.21).toFixed(2)+"% + interes banco", comision:6.29*1.21, acreditacion:"14 dias habiles",
    pasos:["El cliente paga con tarjeta de credito en 3 cuotas.","El banco financia las cuotas.","Recibis el dinero a los 14 dias habiles."],
    nota:"Comision base 6,29% + IVA. El interes de cuotas puede variar por banco." },
  { id:"tarjeta-presencial", logo:"💳", nombre:"Tarjeta presencial", desc:"Con tu propio posnet o datafono",
    comisionLabel:"Variable segun posnet", comision:0, variable:true, acreditacion:"Variable segun banco",
    pasos:["Cobras con tu propio posnet al momento de la entrega.","La comision la define tu banco, no tol.ar.","tol.ar no cobra nada adicional."],
    nota:"tol.ar cobra 0%. Las comisiones son unicamente las de tu banco." },
  { id:"mobbex", logo:"MX", nombre:"Mobbex", desc:"Menor comision que MercadoPago",
    comisionLabel:"~3-4%", comision:0, variable:true, acreditacion:"Variable", proximo:true,
    pasos:[], nota:"Proximamente disponible." },
  { id:"modo", logo:"MD", nombre:"MODO", desc:"QR desde la app del banco",
    comisionLabel:"0%", comision:0, acreditacion:"Inmediata", proximo:true,
    pasos:[], nota:"Proximamente disponible." },
]

export default function CobrosPage() {
  const [abierto, setAbierto]         = useState<string | null>(null)
  const [precio, setPrecio]           = useState<number>(10000)
  const [popupMetodo, setPopupMetodo] = useState<Metodo | null>(null)
  const [popupBanner, setPopupBanner] = useState(false)

  const fmt = (n: number) => n.toLocaleString("es-AR", { minimumFractionDigits:0, maximumFractionDigits:0 })
  const neto = (p: number, c: number) => p - p * (c / 100)
  const metodosCalc = METODOS.filter((m) => !m.proximo && !m.variable)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">

        <section className="bg-[#f0faf4] py-16 px-4 text-center">
          <p className="text-xs font-semibold text-[#00a650] uppercase tracking-widest mb-3">Para duenos de tiendas</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Cobra como quieras,<br /><span className="text-[#00a650]">sin complicaciones</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Elegi como te pagan tus clientes. Podes activar o desactivar cada metodo cuando queres, sin perder nada.
          </p>
        </section>

        <section className="py-10 px-4 bg-white">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[{icon:"🛒",val:"8",label:"metodos de cobro"},{icon:"✅",val:"0%",label:"comision tol.ar por venta"},{icon:"🔧",val:"Siempre",label:"podes cambiarlos cuando queres"}].map((b)=>(
              <div key={b.val} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center gap-2">
                <span className="text-3xl">{b.icon}</span>
                <p className="text-2xl font-extrabold text-gray-900">{b.val}</p>
                <p className="text-sm text-gray-500">{b.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 px-4 bg-[#f8f9fa]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Toca cada metodo para saber mas</h2>
            <p className="text-xs text-center text-gray-400 mb-6">* Comisiones incluyen IVA (21%). Valores aproximados, pueden variar por provincia.</p>
            <div className="flex flex-col gap-2">
              {METODOS.map((m)=>(
                <div key={m.id} className={"border rounded-xl overflow-hidden " + (m.proximo ? "border-gray-100 opacity-50" : "border-gray-200")}>
                  <button disabled={m.proximo} onClick={()=>setAbierto(abierto===m.id?null:m.id)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 transition-colors text-left disabled:cursor-default disabled:hover:bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0">
                        <span className={m.logo.length <= 2 ? "text-base" : "text-xs"}>{m.logo}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{m.nombre}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {m.proximo
                        ? <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">Proximamente</span>
                        : <span className={"text-sm font-bold " + (m.comision===0 && !m.variable ? "text-[#00a650]" : "text-orange-500")}>{m.comisionLabel}</span>}
                      {!m.proximo && <span className="text-gray-300 text-sm">{abierto===m.id ? "▲" : "▼"}</span>}
                    </div>
                  </button>
                  {abierto===m.id && (
                    <div className="px-4 pb-5 pt-3 bg-gray-50 border-t border-gray-100">
                      {m.nota && <p className="text-xs text-gray-400 italic mb-3">{m.nota}</p>}
                      <div className="flex flex-col gap-2">
                        {m.pasos.map((p,i)=>(
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-[#00a650] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                            {p}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">Acreditacion: <span className="font-medium">{m.acreditacion}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">
              Comisiones de MercadoPago vigentes desde el 6/3/2026.{" "}
              <a href="https://www.mercadopago.com.ar/ayuda/220" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Ver fuente oficial</a>
            </p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Cuanto te queda realmente?</h2>
            <p className="text-sm text-center text-gray-400 mb-6">Ingresa el precio de tu producto y ve lo que recibis como vendedor</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 max-w-xs mx-auto mb-6">
              <span className="text-gray-400 font-semibold text-lg">$</span>
              <input type="number" value={precio} onChange={(e)=>setPrecio(Math.max(0,Number(e.target.value)))}
                className="flex-1 text-xl font-bold text-gray-900 bg-transparent outline-none" min={0} />
            </div>
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                <span>Metodo</span><span className="text-center">Comision</span><span className="text-right">Te quedas</span>
              </div>
              {metodosCalc.map((m)=>{
                const resultado = neto(precio, m.comision)
                const perdida   = resultado - precio
                return (
                  <button key={m.id} onClick={()=>setPopupMetodo(m)}
                    className="w-full grid grid-cols-3 items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors text-left">
                    <span className="text-sm text-gray-800 font-medium truncate pr-2">{m.nombre.split("—")[0].trim()}</span>
                    <span className={"text-sm font-bold text-center " + (m.comision===0 ? "text-[#00a650]" : "text-orange-500")}>
                      {m.comision===0 ? "0%" : "-"+m.comision.toFixed(2)+"%"}
                    </span>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${fmt(resultado)}</p>
                      {perdida<0 && <p className="text-xs text-red-400">-${fmt(Math.abs(perdida))}</p>}
                    </div>
                  </button>
                )
              })}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 italic">* Toca cada fila para ver el desglose.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-14 px-4 text-center">
          <button onClick={()=>setPopupBanner(true)} className="group">
            <p className="text-white text-3xl md:text-4xl font-extrabold">El <span className="text-[#00a650]">0%</span> no existe.</p>
            <p className="text-white text-3xl md:text-4xl font-extrabold mb-3">Alguien siempre paga.</p>
            <p className="text-gray-400 text-sm underline group-hover:text-gray-200 transition-colors">La comision que nadie nunca te cuenta bien →</p>
          </button>
        </section>

        <section className="py-16 px-4 text-center bg-white">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Listo para cobrar como queres?</h2>
          <p className="text-gray-400 mb-8">Configura tus metodos en menos de 5 minutos</p>
          <Link href="/registro" className="inline-block bg-[#00a650] hover:bg-[#008f45] text-white font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-lg">
            Crear mi tienda gratis
          </Link>
          <p className="mt-10 text-sm text-gray-300 italic">Claros donde otros son confusos a proposito</p>
        </section>

      </main>
      <Footer />

      {popupMetodo && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4" onClick={()=>setPopupMetodo(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">{popupMetodo.logo}</div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{popupMetodo.nombre}</h3>
                <p className="text-xs text-gray-400">{popupMetodo.acreditacion}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Precio de venta</span>
                <span className="font-semibold">${fmt(precio)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Comision ({popupMetodo.comisionLabel})</span>
                <span className="text-red-500 font-semibold">-${fmt((precio*popupMetodo.comision)/100)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span>Te quedas</span>
                <span className="text-[#00a650]">${fmt(neto(precio,popupMetodo.comision))}</span>
              </div>
            </div>
            {popupMetodo.nota && <p className="text-xs text-gray-400 italic mb-4">{popupMetodo.nota}</p>}
            <button onClick={()=>setPopupMetodo(null)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      {popupBanner && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-4" onClick={()=>setPopupBanner(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-xl font-extrabold text-gray-900 mb-4">El 0% no existe. Alguien siempre paga.</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Cuando un procesador de pagos dice "0% de comision", se refiere a lo que le cobra al <strong>comprador</strong>. A vos, como vendedor, siempre te descuenta algo.</p>
              <p>Hay comisiones por acreditacion inmediata, por usar tarjeta de credito, por cuotas. Siempre hay algo. La diferencia esta en quien te lo explica claramente.</p>
              <p className="font-semibold text-[#00a650]">tol.ar cobra 0% sobre tus ventas. Siempre. Ganamos con la suscripcion mensual, no con un porcentaje de lo que vendes.</p>
              <p className="text-gray-400 text-xs">Las comisiones que ves en esta pagina son exclusivamente de los procesadores de pago, no de tol.ar.</p>
            </div>
            <button onClick={()=>setPopupBanner(false)} className="w-full mt-5 bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">Entendido</button>
          </div>
        </div>
      )}

    </div>
  )
}
