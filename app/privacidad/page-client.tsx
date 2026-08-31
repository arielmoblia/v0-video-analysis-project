"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

export default function PrivacidadPage() {
  const { isAdmin, get } = usePageContent("privacidad")
  const ET = (field: string, fallback: string) => (
    <EditableText page="privacidad" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#6366f1" />
  )

  const sections = [
    ["s1_titulo","1. Información que Recopilamos","s1_body","Recopilamos email, nombre de tienda y contraseña al registrarte. También datos de tu tienda, pedidos, uso y datos técnicos para seguridad."],
    ["s2_titulo","2. Cómo Usamos tu Información","s2_body","Para proporcionar el servicio, procesar pagos, enviarte notificaciones, mejorar funcionalidades y prevenir fraude."],
    ["s3_titulo","3. Compartición de Datos","s3_body","Solo con procesadores de pago (Stripe, MercadoPago) y servicios de infraestructura (Supabase). Nunca vendemos tus datos a terceros."],
    ["s4_titulo","4. Seguridad de los Datos","s4_body","Usamos encriptación SSL/TLS, contraseñas hasheadas, rate limiting, Row Level Security y backups regulares."],
    ["s5_titulo","5. Tus Derechos","s5_body","Podés solicitar acceso, rectificación, eliminación, portabilidad y oponerte a ciertos usos. Escribinos a soporte@tiendaonline.com.ar."],
    ["s6_titulo","6. Cookies","s6_body","Usamos cookies esenciales para sesión y autenticación. No usamos cookies de seguimiento publicitario."],
    ["s7_titulo","7. Retención de Datos","s7_body","Conservamos tus datos mientras tu cuenta esté activa. Si eliminás tu cuenta, borramos los datos en 30 días."],
    ["s8_titulo","8. Menores de Edad","s8_body","Para crear una tienda en tol.ar hay que ser mayor de 18 años, o tener entre 16 y 17 años y operarla como un emprendimiento propio, con conocimiento de tus padres o tutores (art. 683 y 684, Código Civil y Comercial de la Nación). Los menores de 16 años no pueden ser titulares de una cuenta: la tienda debe estar a nombre de un padre, madre o tutor legal. Si detectamos una cuenta que no cumple estos requisitos, podemos suspenderla o pedir la verificación correspondiente."],
    ["s9_titulo","9. Cambios en esta Política","s9_body","Podemos actualizar esta política periódicamente. Te notificaremos por email sobre cambios significativos."],
    ["s10_titulo","10. Contacto","s10_body","Para consultas sobre privacidad: soporte@tiendaonline.com.ar"],
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">{ET("titulo", "Política de Privacidad")}</h1>
          <p className="text-muted-foreground mb-8">{ET("fecha", "Última actualización: Enero 2026")}</p>
          <div className="prose prose-slate max-w-none space-y-8">
            {sections.map(([tk, td, bk, bd]) => (
              <section key={tk}>
                <h2 className="text-2xl font-semibold mb-4">{ET(tk, td)}</h2>
                <p className="text-muted-foreground leading-relaxed">{ET(bk, bd)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
