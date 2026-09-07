"use client"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

const clausulas = [
  {
    numero: 1,
    tk: "c1_titulo",
    td: "Objeto",
    dk: "c1_desc",
    dd: "Tienda Online (tiendaonline.com.ar, operador de tol.ar) publica y vende por internet los productos de tu negocio — fotos, precios, descripciones y stock, tal como figuran en tu sitio o catálogo — en su propia plataforma. Tu negocio no paga nada por esto ni tiene que hacer ningún cambio en su página actual: es un canal de venta adicional.",
  },
  {
    numero: 2,
    tk: "c2_titulo",
    td: "Autorización de uso de fotos, marca y descripciones",
    dk: "c2_desc",
    dd: "Al aceptar estos términos, tu negocio autoriza expresamente a Tienda Online a reproducir y publicar sus fotografías, nombre de marca, logo y descripciones de producto, únicamente dentro de la plataforma tol.ar y con el fin de ofrecer y vender esos productos. Esta autorización no incluye ningún otro uso ni ninguna otra plataforma.",
  },
  {
    numero: 3,
    tk: "c3_titulo",
    td: "Comisión",
    dk: "c3_desc",
    dd: "Tienda Online suma su propio margen de reventa sobre el precio que tu negocio fija, a cargo del comprador. Tu negocio cobra el 100% del precio que puso en cada venta realizada a través de tol.ar — no se le descuenta nada. Si no hay venta, no hay ningún cobro ni costo para tu negocio.",
  },
  {
    numero: 4,
    tk: "c4_titulo",
    td: "Plazo y rescisión",
    dk: "c4_desc",
    dd: "El acuerdo tiene una vigencia inicial de 12 meses desde la aceptación. Cualquiera de las dos partes puede darlo de baja en cualquier momento avisando por escrito (alcanza un mail) con 30 días de anticipación.",
  },
  {
    numero: 5,
    tk: "c5_titulo",
    td: "Actualización de precios y stock",
    dk: "c5_desc",
    dd: "Tienda Online revisa tu página automáticamente todos los días y actualiza solo los precios y el stock en tol.ar según lo que encuentre. No hace falta que nos avises nada: si cambiás un precio o te quedás sin stock de algo, en la próxima revisión diaria ya queda reflejado en tol.ar.",
  },
  {
    numero: 6,
    tk: "c6_titulo",
    td: "Protección de datos",
    dk: "c6_desc",
    dd: "El tratamiento de los datos de los compradores se rige por la Ley 25.326 de Protección de Datos Personales. Tienda Online gestiona los pagos y el contacto con el comprador; tu negocio conserva acceso a los pedidos que le correspondan para su gestión y despacho.",
  },
  {
    numero: 7,
    tk: "c7_titulo",
    td: "Responsabilidades de cada parte",
    dk: "c7_desc",
    dd: "Tienda Online se ocupa de publicar correctamente los productos y de administrar el cobro y la comisión. Tu negocio sigue siendo responsable del stock real, la calidad y la entrega de sus productos.",
  },
  {
    numero: 8,
    tk: "c8_titulo",
    td: "Cómo se acepta (firma electrónica)",
    dk: "c8_desc",
    dd: "Estos términos se aceptan haciendo clic en el botón \"Sí, quiero sumar mi negocio\" en la página del programa de reventa (tol.ar/programa-reventa), a la que se accede desde el mail que te los compartió. Ese clic queda registrado con fecha, hora e IP, y se considera firma electrónica válida, sin necesidad de trámites adicionales.",
  },
  {
    numero: 9,
    tk: "c9_titulo",
    td: "Ley aplicable",
    dk: "c9_desc",
    dd: "Estos términos se rigen por las leyes de la República Argentina, en particular la Ley 25.326 de Protección de Datos Personales y, en lo relativo a la información publicada sobre los productos, la Ley 22.802 de Lealtad Comercial. Ante cualquier desacuerdo, las partes buscan primero una solución directa antes de recurrir a los tribunales de la Ciudad Autónoma de Buenos Aires.",
  },
]

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function ScrapingTerminosClient({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("scraping-terminos-condiciones")

  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page="scraping-terminos-condiciones" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#2563eb" />
  )

  return (
    <>
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #1e3a8a, #2563eb)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-blue-600">tol.ar</Link>
            <span className="mx-2">/</span>
            <span>Términos — Programa de reventa online</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {ET("h1", "Términos y condiciones del programa de reventa online")}
          </h1>
          <p className="text-gray-500 text-sm mb-8">{ET("fecha", "Última actualización: septiembre 2026")}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <p className="text-blue-900 font-semibold text-lg">{ET("resumen_titulo", "En criollo")}</p>
            <p className="text-blue-800 mt-2">
              {ET("resumen_texto", "Tienda Online publica y vende tus productos por internet sin costo para vos. Si vendemos, te pagamos el 100% del precio que vos pusiste — nuestra ganancia la sumamos aparte, a cargo del comprador. Si no vendemos, no pagás nada. Vos seguís vendiendo como siempre, esto es un canal extra. Podés dar de baja el acuerdo cuando quieras avisando con 30 días de anticipación.")}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-8">
              {ET(
                "intro",
                "Estos términos aplican a los negocios que aceptan participar del programa de reventa online de Tienda Online (tiendaonline.com.ar), operador de la plataforma tol.ar. Si tu negocio hizo clic en \"Sí, quiero sumar mi negocio\" en la página a la que te dirigió el mail, estas son las condiciones que rigen esa relación."
              )}
            </p>

            <div className="space-y-6 mb-10">
              {clausulas.map((c) => (
                <div key={c.numero} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                      {c.numero}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{ET(c.tk, c.td)}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{ET(c.dk, c.dd)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm">
              {ET("contacto", "Consultas sobre estos términos: soporte@tiendaonline.com.ar")}
            </p>
          </div>
        </div>
      </main>
      <Footer brand={brand} />
    </>
  )
}
