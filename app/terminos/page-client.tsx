"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"
import { MinorConsentForm } from "@/components/store/minor-consent-form"

export default function TerminosPage() {
  const { isAdmin, get } = usePageContent("terminos")
  const ET = (field: string, fallback: string) => (
    <EditableText page="terminos" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#6366f1" />
  )

  const sections = [
    ["s1_titulo","1. Aceptación de los Términos","s1_body","Al acceder y utilizar tol.ar, aceptás estos términos en su totalidad. Si no estás de acuerdo, no debés utilizar nuestros servicios."],
    ["s2_titulo","2. Descripción del Servicio","s2_body","tol.ar es una plataforma que permite crear tiendas online con diferentes planes: Gratis, Cositas, Socio y A Medida."],
    ["s3_titulo","3. Registro y Cuenta","s3_body","Debés proporcionar información veraz al registrarte. Sos responsable de tu contraseña. Nos reservamos el derecho de suspender cuentas que violen estos términos. Para ser titular de una cuenta en tol.ar debés ser mayor de 18 años, o tener entre 16 y 17 años y usar la tienda como tu propio emprendimiento (empleo, profesión o industria), caso en el cual la ley presume que contás con la autorización de tus padres o tutores para los actos y contratos vinculados a esa actividad (art. 683, Código Civil y Comercial de la Nación). Los menores de 16 años no pueden ser titulares de una cuenta: la tienda debe ser creada y administrada por un padre, madre o tutor legal. Tener una cuenta de Mercado Pago habilitada para menores no reemplaza este requisito, ya que es una condición del procesador de pagos y no otorga por sí sola capacidad legal para contratar con tol.ar."],
    ["s4_titulo","4. Uso Aceptable","s4_body","No está permitido vender productos ilegales, realizar fraude, violar derechos intelectuales, enviar spam ni intentar acceder a datos de otros usuarios. Queda expresamente prohibido el uso de scraping, extracción automatizada, rastreo (crawling) o cualquier técnica similar para copiar, reproducir o recolectar contenido de tol.ar o de las tiendas alojadas en la plataforma (textos, imágenes, precios, catálogos, stock) sin autorización previa y por escrito. Esta conducta puede constituir una infracción a la Ley 11.723 de Propiedad Intelectual y, según el caso, a la Ley 26.388 de Delitos Informáticos, y habilita a tol.ar a suspender el acceso del infractor e iniciar las acciones legales correspondientes. Asimismo, si utiliza herramientas de tol.ar para extraer, copiar o recolectar información de sitios web de terceros, usted es el único responsable de contar con la autorización correspondiente del titular de dicho sitio. tol.ar no se responsabiliza por el uso que los usuarios hagan de estas herramientas sobre sitios de terceros sin la autorización debida, y podrá suspender el acceso ante un reclamo fundado de un tercero afectado."],
    ["s5_titulo","5. Pagos y Facturación","s5_body","Los precios están en USD. Pagos procesados por Stripe y MercadoPago. Las cositas son de pago único. No ofrecemos reembolsos una vez activada una funcionalidad."],
    ["s6_titulo","6. Propiedad Intelectual","s6_body","El contenido de tu tienda es tuyo. La marca tol.ar, su logo y el código de la plataforma son propiedad exclusiva nuestra."],
    ["s7_titulo","7. Limitación de Responsabilidad","s7_body","tol.ar se proporciona tal cual. No garantizamos disponibilidad ininterrumpida ni somos responsables por pérdidas indirectas."],
    ["s8_titulo","8. Modificaciones","s8_body","Podemos modificar estos términos en cualquier momento. Te notificaremos por email sobre cambios importantes."],
    ["s9_titulo","9. Ley Aplicable","s9_body","Estos términos se rigen por las leyes de la República Argentina. Disputas en los tribunales de la Ciudad Autónoma de Buenos Aires."],
    ["s10_titulo","10. Contacto","s10_body","Para consultas sobre estos términos: soporte@tiendaonline.com.ar"],
    ["s11_titulo","11. Menores de Edad","s11_body","tol.ar está destinado a personas mayores de 18 años. Un usuario menor de edad solo puede utilizar la plataforma y sus servicios de pago (incluyendo Mercado Pago u otros medios habilitados) con la autorización expresa de su padre, madre o tutor legal, completando el Formulario de Autorización Parental disponible en los Términos y Condiciones de la tienda correspondiente. Dicha autorización queda registrada de forma inmutable y disponible para el titular de la tienda. Si el usuario no completa este formulario, se presume que declara ser mayor de edad bajo su exclusiva responsabilidad, quedando tol.ar liberado de responsabilidad frente a declaraciones falsas."],
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
          <h1 className="text-4xl font-bold mb-8">{ET("titulo", "Términos y Condiciones")}</h1>
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
      <MinorConsentForm />
      <Footer />
    </div>
  )
}
