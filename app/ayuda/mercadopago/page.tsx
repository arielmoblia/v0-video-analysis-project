"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || images.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [paused, images.length])

  if (images.length === 0) {
    return <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg min-h-[180px] flex items-center justify-center text-xs text-slate-400">Sin imagen</div>
  }

  return (
    <div
      className="relative bg-slate-50 rounded-lg overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img src={images[idx]} alt={`paso ${idx + 1}`} className="w-full h-auto block" />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-slate-700"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-slate-700"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full ${i === idx ? "bg-slate-800" : "bg-slate-400/60"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AyudaMercadoPagoPage() {
  const [tab, setTab] = useState<"viejas" | "nuevas">("viejas")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-medium mb-3">Cómo conectar Mercado Pago a tu tienda</h1>

        <div className="bg-slate-50 rounded-xl p-5 mb-6 text-sm text-slate-600 leading-relaxed">
          Esta guía te lleva paso a paso para que tu tienda en tol.ar pueda cobrar con Mercado Pago. Es <strong className="text-slate-900 font-medium">10 minutos</strong> de configuración por única vez.<br /><br />
          <strong className="text-slate-900 font-medium">Antes de empezar:</strong> tenés que tener una cuenta de Mercado Pago. Si nunca cobraste con MP, eso ya cuenta como cuenta nueva. Si ya recibiste pagos antes (vendiendo en MeLi, Mercado Shops, link de pago, QR, etc.), es cuenta vieja.<br /><br />
          Elegí abajo qué tipo de cuenta tenés:
        </div>

        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setTab("viejas")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${tab === "viejas" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"}`}
          >
            Tengo cuenta vieja
            <span className="block text-xs text-slate-500 font-normal mt-0.5">Ya recibí pagos con MP antes</span>
          </button>
          <button
            onClick={() => setTab("nuevas")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${tab === "nuevas" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"}`}
          >
            Tengo cuenta nueva
            <span className="block text-xs text-slate-500 font-normal mt-0.5">Nunca cobré con MP</span>
          </button>
        </div>

        {tab === "viejas" && <CuentasViejas />}
        {tab === "nuevas" && <CuentasNuevas />}

        <div className="bg-emerald-50 rounded-xl p-6 text-center mt-8">
          <p className="text-base font-medium mb-2">¿Te trabás en algún paso?</p>
          <p className="text-sm text-slate-600 mb-4">Mandame captura por WhatsApp y lo vemos juntos.</p>
          <Link href="/contacto" className="inline-block bg-emerald-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg">
            Contactar a Ariel
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Step({ num, title, children, captionPlaceholder, images }: { num: number; title: string; children: React.ReactNode; captionPlaceholder: string; images?: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start mb-8 pb-8 border-b border-slate-100 last:border-0">
      <div>
        <h3 className="text-base font-medium flex items-center mb-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-medium mr-2">{num}</span>
          {title}
        </h3>
        <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
      </div>
      {images && images.length > 0 ? (
        <Carousel images={images} />
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg min-h-[180px] flex items-center justify-center text-xs text-slate-400 text-center px-4">
          [ {captionPlaceholder} ]
        </div>
      )}
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="bg-amber-50 text-amber-800 font-medium px-1.5 py-0.5 rounded">{children}</span>
}

function CuentasViejas() {
  return (
    <>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-sm text-emerald-900">
        <strong className="font-medium">¡Tenés todo más fácil!</strong> Si ya cobraste con MP antes, tu cuenta ya está habilitada. Solo necesitás copiar tu Access Token y pegarlo en tol.ar. <strong className="font-medium">3 pasos, 5 minutos.</strong>
      </div>

      <Step num={1} title="Entrá al panel de desarrolladores" captionPlaceholder="CAPTURA: pantalla de login de MP">
        <p>Desde una computadora (no celular), entrá a:</p>
        <p><a href="https://www.mercadopago.com.ar/developers/panel/app" target="_blank" rel="noopener" className="text-blue-700 underline break-all">https://www.mercadopago.com.ar/developers/panel/app</a></p>
        <p>Loguéate con tu usuario de Mercado Pago de siempre.</p>
      </Step>

      <Step num={2} title="Creá una aplicación" captionPlaceholder='CAPTURA: formulario "Crear aplicación"'>
        <p>Si todavía no tenés ninguna aplicación creada, tocá <Highlight>+ Crear aplicación</Highlight>.</p>
        <p>Si ya tenés alguna, podés usar esa o crear una nueva exclusiva para tu tienda tol.ar (recomendado).</p>
        <p>Datos para llenar:</p>
        <p>• Nombre: el que quieras (ej: "mi-tienda-tol-ar")<br />• Modelo de integración: <Highlight>CheckoutPro</Highlight><br />• Plataforma de e-commerce: <Highlight>No estoy usando una plataforma de e-commerce</Highlight></p>
      </Step>

      <Step num={3} title="Copiá tu Access Token de producción" captionPlaceholder="CAPTURA: cuadro de credenciales con pestaña Productivas">
        <p>Una vez dentro de tu aplicación:</p>
        <p>1. A la derecha verás el cuadro <Highlight>Credenciales</Highlight>.<br />2. Tocá la pestaña <Highlight>Productivas</Highlight>.<br />3. Copiá el <Highlight>Access Token</Highlight> (empieza con APP_USR-...).</p>
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-800 leading-relaxed mt-2">
          <strong className="font-medium">⚠ Importante:</strong> el Access Token es como tu llave secreta. Nunca se la pases a nadie.
        </div>
      </Step>

      <Step num={4} title="Pegalo en tu admin de tol.ar" captionPlaceholder="CAPTURA: admin tol.ar con MP configurado">
        <p>Andá a tu admin de tol.ar → <Highlight>Cobros</Highlight> → <Highlight>Mercado Pago</Highlight>.</p>
        <p>Activá <Highlight>Modo Producción</Highlight> y pegá el Access Token en el campo correspondiente.</p>
        <p>Tocá <Highlight>Guardar Cambios</Highlight>. Listo. Hacé una compra de prueba en tu tienda para confirmar que funciona.</p>
      </Step>
    </>
  )
}

function CuentasNuevas() {
  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900">
        <strong className="font-medium">Atención:</strong> si tu cuenta MP nunca recibió pagos antes, MP exige que pases por una "habilitación" antes de poder cobrar. Esto es <strong className="font-medium">requisito de Mercado Pago</strong>, no de tol.ar. Te llevamos paso a paso. <strong className="font-medium">10-15 minutos.</strong>
      </div>

      <Step num={1} title="Entrá al panel de desarrolladores" captionPlaceholder="CAPTURA: pantalla de login MP" images={["/MP/Screenshot_1.jpg","/MP/Screenshot_2.jpg","/MP/Screenshot_3.jpg","/MP/Screenshot_4.jpg"]}>
        <p>Desde una computadora (no celular), entrá a:</p>
        <p><a href="https://www.mercadopago.com.ar/developers/panel/app" target="_blank" rel="noopener" className="text-blue-700 underline break-all">https://www.mercadopago.com.ar/developers/panel/app</a></p>
        <p>Loguéate con tu cuenta de Mercado Pago.</p>
      </Step>

      <Step num={2} title="Creá una aplicación" captionPlaceholder="CAPTURA: formulario crear aplicación">
        <p>Tocá <Highlight>+ Crear aplicación</Highlight>.</p>
        <p>Llená los datos:</p>
        <p>• Nombre: el que quieras (ej: "mi-tienda-tol-ar")<br />• Modelo de integración: <Highlight>CheckoutPro</Highlight><br />• Plataforma: <Highlight>No estoy usando una plataforma de e-commerce</Highlight></p>
        <p>Aceptá los términos y dale a Crear.</p>
      </Step>

      <Step num={3} title='Completá las "Etapas de integración"' captionPlaceholder="CAPTURA: lista de etapas de integración">
        <p>Adentro de tu aplicación vas a ver una lista de pasos. Tenés que ir completándolos uno por uno:</p>
        <p>• Configurar ambiente de desarrollo<br />• Realizar integración<br />• Probar la integración<br />• Salir a producción</p>
        <p>Andá tocando <Highlight>Comenzar</Highlight> en cada paso. MP te va guiando.</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 leading-relaxed mt-2">
          <strong className="font-medium">Tip:</strong> en cada etapa MP pide cosas técnicas. Si te trabás, pasá al siguiente paso de esta guía — te muestro qué responder.
        </div>
      </Step>

      <Step num={4} title="Activá las credenciales de producción" captionPlaceholder="CAPTURA: formulario activar credenciales">
        <p>En el menú izquierdo tocá <Highlight>Credenciales de producción</Highlight>.</p>
        <p>Te va a pedir completar:</p>
        <p>• <strong>Industria:</strong> elegí la que más se parezca a lo que vendés.<br />• <strong>Sitio web:</strong> poné la URL de tu tienda tol.ar (ej: <Highlight>arrayan.tol.ar</Highlight>).<br />• Aceptá la Declaración de Privacidad y los Términos y condiciones.<br />• Resolvé el reCAPTCHA.<br />• Tocá <Highlight>Activar credenciales de producción</Highlight>.</p>
      </Step>

      <Step num={5} title="Copiá tu Access Token" captionPlaceholder="CAPTURA: credenciales producción con Access Token">
        <p>Una vez activadas las credenciales productivas, vas a ver:</p>
        <p>• <strong>Public Key</strong> (no la usamos)<br />• <strong>Access Token</strong> ← esta es la que nos importa</p>
        <p>Copiá el Access Token completo (empieza con APP_USR-...).</p>
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-800 leading-relaxed mt-2">
          <strong className="font-medium">⚠ Importante:</strong> es tu llave secreta. No la compartas con nadie.
        </div>
      </Step>

      <Step num={6} title="Pegalo en tu admin de tol.ar" captionPlaceholder="CAPTURA: admin tol.ar con MP listo">
        <p>Andá a tu admin de tol.ar → <Highlight>Cobros</Highlight> → <Highlight>Mercado Pago</Highlight>.</p>
        <p>Activá <Highlight>Modo Producción</Highlight> y pegá el Access Token.</p>
        <p>Tocá <Highlight>Guardar Cambios</Highlight>.</p>
        <p>Hacé una compra de prueba para confirmar que funciona. Si te sigue dando error, ver paso 7.</p>
      </Step>

      <Step num={7} title="Si te sigue dando error UNAUTHORIZED" captionPlaceholder="CAPTURA: dashboard de la app con etapas completadas">
        <p>Eso significa que MP todavía no terminó de habilitar tu cuenta. Volvé al panel de developers y revisá:</p>
        <p>• Que las "Etapas de integración" estén todas en verde.<br />• Que el progreso diga 100%.<br />• Que tengas la "Calidad de la integración" medida.</p>
        <p>Si todo está OK y sigue fallando, escribime y vemos juntos.</p>
      </Step>
    </>
  )
}
