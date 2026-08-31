import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Soporte — Documento de trabajo (interno)",
  robots: { index: false, follow: false },
}

function Nivel({
  numero,
  nombre,
  precio,
  color,
  resumen,
  cubre,
  noCubre,
  ejemplo,
}: {
  numero: string
  nombre: string
  precio: string
  color: string
  resumen: string
  cubre: string[]
  noCubre: string[]
  ejemplo: { usuario: string; soporte: string }[]
}) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "28px 32px",
        marginBottom: 32,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span
          style={{
            background: color,
            color: "#fff",
            borderRadius: 999,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {numero}
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{nombre}</h2>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>{precio}</span>
      </div>
      <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.6, marginBottom: 18 }}>{resumen}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", marginBottom: 6 }}>
            Qué cubre
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            {cubre.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", marginBottom: 6 }}>
            Qué NO cubre (pasa al nivel siguiente)
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            {noCubre.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", marginBottom: 10 }}>
          Ejemplo de conversación típica
        </div>
        {ejemplo.map((turno, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14 }}>
              <strong style={{ color: "#111827" }}>Dueño de tienda:</strong>{" "}
              <span style={{ color: "#374151" }}>{turno.usuario}</span>
            </div>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              <strong style={{ color }}>Soporte:</strong> <span style={{ color: "#374151" }}>{turno.soporte}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function SoportePlanPage() {
  return (
    <main
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "48px 24px 96px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fef3c7",
          border: "1px solid #fcd34d",
          borderRadius: 12,
          padding: "14px 18px",
          fontSize: 14,
          color: "#92400e",
          marginBottom: 40,
        }}
      >
        📝 <strong>Documento de trabajo interno — no es una página pública.</strong> Vive en tol.ar-dev, no en
        producción. Ariel y el agente Soporte lo van actualizando juntos a medida que definen los detalles reales en
        control.tol.ar. La mayoría de lo que dice acá todavía es solo un plan — excepto el chat del admin, que ya
        tiene una prueba real corriendo, aislada a una sola tienda (ver sección "Dónde vive cada nivel" más abajo).
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>Cómo va a funcionar Soporte</h1>
      <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.6, marginBottom: 40 }}>
        Soporte es el futuro agente que atiende a los dueños de tienda de tol.ar y tiendaonline.com.ar cuando tienen
        una duda, quieren personalizar algo, o necesitan algo que no existe todavía. La idea central: la mayoría de
        los pedidos se resuelven solos (Gratis), algunos necesitan trabajo pago pero sin código nuevo (Plus), y muy
        pocos necesitan código nuevo de verdad — esos van directo al Programador o a Ariel (Customizado).
      </p>

      <Nivel
        numero="1"
        nombre="Gratis"
        precio="Incluido para todas las tiendas"
        color="#16a34a"
        resumen="Dudas de uso y ayuda para aprovechar lo que la plataforma ya ofrece. Es el 80-90% esperado de los pedidos: el dueño de tienda no sabe cómo hacer algo que la plataforma YA puede hacer."
        cubre={[
          "Cómo usar una función existente (cargar productos, configurar envíos, activar MercadoPago)",
          "Dudas sobre pedidos, pagos, o el funcionamiento general",
          "Ayuda para encontrar dónde está algo en el panel",
          "Errores del usuario (configuración mal hecha, no un bug real)",
        ]}
        noCubre={[
          "Cambiar cómo se ve o se comporta ALGO que ya existe, a medida del dueño",
          "Cualquier cosa que implique tocar su tienda puntual más allá de explicar",
        ]}
        ejemplo={[
          { usuario: "¿Cómo hago para que mi tienda acepte transferencia bancaria además de MercadoPago?", soporte: "Andá a Configuración → Medios de pago → activá 'Transferencia bancaria' y cargá tu CBU/alias. Se activa al toque, sin esperar aprobación." },
          { usuario: "No me aparecen las fotos de un producto que subí ayer.", soporte: "Revisá que el archivo pese menos de 5MB y sea JPG o PNG — si subiste un HEIC de iPhone, por eso no se procesa. Convertilo y volvé a subir." },
        ]}
      />

      <Nivel
        numero="2"
        nombre="Plus"
        precio="Pago (a definir: por hora / por tarea / suscripción)"
        color="#2563eb"
        resumen="Personalización avanzada dentro de lo que la plataforma permite configurar — pero que requiere trabajo real (tiempo, criterio, ida y vuelta), no una sola respuesta. No es código nuevo: es usar herramientas que ya existen para lograr algo a medida."
        cubre={[
          "Rediseño de la tienda dentro de las plantillas/opciones existentes (colores, banners, orden de categorías)",
          "Configuración avanzada de envíos, zonas, o reglas de precio con múltiples casos",
          "Migración o carga masiva de catálogo grande",
          "Ajustes de SEO puntuales de su tienda (títulos, descripciones, URLs)",
        ]}
        noCubre={[
          "Una función que la plataforma no tiene (eso es Customizado)",
          "Integración con un servicio externo no soportado hoy",
        ]}
        ejemplo={[
          { usuario: "Quiero que mi tienda tenga un diseño más 'premium', con otra tipografía y un banner rotativo en el home.", soporte: "Se puede armar con lo que ya tenemos. Es un trabajo de un par de horas — te paso el presupuesto y, si lo aceptás, lo armamos esta semana." },
          { usuario: "Vendo en 3 provincias con reglas de envío distintas y quiero que el cálculo sea automático según el código postal.", soporte: "Es configurable con reglas de zona que ya existen en el motor de envíos, pero armar las reglas para las 3 provincias lleva trabajo de mi lado. Te cotizo la tarea." },
        ]}
      />

      <Nivel
        numero="3"
        nombre="Customizado"
        precio="Depende — deriva a Programador/Ariel"
        color="#9333ea"
        resumen="El dueño de tienda pide algo que la plataforma HOY no puede hacer, ni configurando ni personalizando — hace falta programar algo nuevo. Soporte NUNCA promete plazos ni precios acá: solo detecta que es Customizado, junta el contexto, y deriva."
        cubre={[
          "Detectar que el pedido requiere código nuevo (no una configuración)",
          "Juntar el detalle completo del pedido (qué quiere, para qué, urgencia)",
          "Explicarle al dueño de tienda que esto se evalúa aparte, sin comprometer nada",
          "Derivar el pedido completo al Programador o a Ariel",
        ]}
        noCubre={[
          "Cotizar, prometer fecha, o decir 'sí, se puede' — eso lo decide el Programador/Ariel",
          "Empezar a programar nada — Soporte no toca código",
        ]}
        ejemplo={[
          { usuario: "Necesito que mi tienda se integre con mi sistema de facturación de AFIP para que emita factura automática en cada venta.", soporte: "Eso no existe hoy en la plataforma — es una integración nueva. Te tomo el detalle completo y se lo paso al equipo técnico para que lo evalúen; te contactan con viabilidad y tiempos, sin compromiso todavía." },
          { usuario: "Quiero un programa de puntos/fidelización para mis clientes que se acumulen y canjeen por descuentos.", soporte: "Es una función que no existe en la plataforma todavía. Anoté el pedido con el detalle — el equipo técnico lo va a evaluar y te avisa si y cuándo se puede armar." },
        ]}
      />

      <section style={{ marginTop: 48, borderTop: "1px solid #e5e7eb", paddingTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Dónde vive cada nivel: los dos chats</h2>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
          No es un solo chat que hace las tres cosas. Son dos superficies distintas del mismo criterio Soporte,
          según si hay o no una tienda puntual identificada:
        </p>
        <ul style={{ fontSize: 15, color: "#374151", lineHeight: 1.9, paddingLeft: 22, marginBottom: 16 }}>
          <li>
            <strong>Chat público de tol.ar</strong> (el que ya existe hoy, con los agentes Tomi/Belkis/etc. —{" "}
            <code>/api/chat-soporte</code>) — vive en la home institucional, sin sesión de ninguna tienda. Solo
            Gratis informativo general de la plataforma. No cambia.
          </li>
          <li>
            <strong>Chat dentro del admin de cada tienda</strong> — acá el dueño ya inició sesión y se sabe de qué
            tienda se trata, así que puede tener permiso real sobre esa tienda puntual (Plus) además de responder
            dudas (Gratis).
          </li>
        </ul>
        <div
          style={{
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4338ca", textTransform: "uppercase", marginBottom: 8 }}>
            Estado real — prueba aislada en prueba3.tol.ar
          </div>
          <ul style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>
              El botón del chat del admin (<code>components/admin/admin-chat.tsx</code>) solo aparece en el admin de{" "}
              <strong>prueba3.tol.ar</strong> — en el resto de las tiendas el admin sigue igual que siempre, sin
              botón.
            </li>
            <li>
              Hoy solo hace <strong>Gratis</strong>: tutorial viviente, contesta dudas de cómo usar el panel
              (productos, pagos, envíos, pedidos, etc.). No inventa videos — si preguntan por uno, dice con
              honestidad que todavía no hay videos cargados.
            </li>
            <li>
              <strong>Plus (cambiar cosas reales, como el color de la cabecera) queda pospuesto a propósito.</strong>{" "}
              El prompt del chat (<code>/api/chat-admin</code>) tiene la instrucción explícita de no tocar nada
              todavía: si piden un cambio, explica cómo hacerlo manualmente paso a paso en el panel, en vez de
              hacerlo él.
            </li>
            <li>Motor: DeepSeek (mismo que el chat público), en tol.ar-dev. Nunca tocó producción.</li>
          </ul>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginTop: 12 }}>
          Si la prueba en prueba3 funciona bien, el paso siguiente (a definir con Ariel) es: primero extender Gratis
          a más tiendas, y recién después — con acuerdo explícito — sumar Plus.
        </p>
      </section>

      <section style={{ marginTop: 48, borderTop: "1px solid #e5e7eb", paddingTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Cómo distingue Soporte un nivel de otro</h2>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.7, marginBottom: 12 }}>
          Punto de partida para definir juntos el criterio real (esto es lo primero para charlar y ajustar):
        </p>
        <ol style={{ fontSize: 15, color: "#374151", lineHeight: 1.9, paddingLeft: 22 }}>
          <li>¿La plataforma ya hace esto tal cual, solo hay que activarlo o explicarlo? → <strong>Gratis</strong></li>
          <li>¿La plataforma tiene las piezas para lograrlo, pero arma­rlo lleva trabajo real de configuración/tiempo? → <strong>Plus</strong></li>
          <li>¿No existe ninguna forma de lograrlo hoy, ni configurando? → <strong>Customizado</strong></li>
        </ol>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginTop: 16 }}>
          Pendiente de definir con Ariel: qué pasa en el límite entre niveles cuando no es obvio, cómo se cobra
          exactamente Plus (por hora, por tarea, suscripción mensual), y qué información mínima tiene que juntar
          Soporte antes de derivar un Customizado.
        </p>
      </section>
    </main>
  )
}
