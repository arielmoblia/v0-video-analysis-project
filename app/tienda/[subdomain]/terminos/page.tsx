import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePages } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreLegalPage } from "@/components/store/store-legal-page"
import { MinorConsentForm } from "@/components/store/minor-consent-form"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string }>
}

const SECTIONS: [string, string, string, string][] = [
  ["s1_titulo", "1. Aceptación de los Términos", "s1_body", "Al acceder y utilizar esta tienda, aceptás estos términos en su totalidad. Si no estás de acuerdo, no debés utilizar el sitio."],
  ["s2_titulo", "2. Descripción del Servicio", "s2_body", "Esta tienda funciona sobre la plataforma tol.ar, que permite crear tiendas online con diferentes planes: Gratis, Cositas, Socio y A Medida."],
  ["s3_titulo", "3. Registro y Cuenta", "s3_body", "Debés proporcionar información veraz al registrarte. Sos responsable de tu contraseña. Nos reservamos el derecho de suspender cuentas que violen estos términos."],
  ["s4_titulo", "4. Uso Aceptable", "s4_body", "No está permitido vender productos ilegales, realizar fraude, violar derechos intelectuales, enviar spam ni intentar acceder a datos de otros usuarios."],
  ["s5_titulo", "5. Pagos y Facturación", "s5_body", "Los precios se muestran en la moneda indicada en cada producto. No ofrecemos reembolsos una vez confirmado el envío, salvo lo previsto en la Política de Devoluciones."],
  ["s6_titulo", "6. Propiedad Intelectual", "s6_body", "El contenido de esta tienda pertenece a su dueño. La marca tol.ar, su logo y el código de la plataforma son propiedad exclusiva de tol.ar."],
  ["s7_titulo", "7. Limitación de Responsabilidad", "s7_body", "El sitio se proporciona tal cual. No garantizamos disponibilidad ininterrumpida ni somos responsables por pérdidas indirectas."],
  ["s8_titulo", "8. Modificaciones", "s8_body", "Podemos modificar estos términos en cualquier momento. Te notificaremos por email sobre cambios importantes."],
  ["s9_titulo", "9. Ley Aplicable", "s9_body", "Estos términos se rigen por las leyes de la República Argentina. Disputas en los tribunales de la Ciudad Autónoma de Buenos Aires."],
  ["s10_titulo", "10. Contacto", "s10_body", "Para consultas sobre estos términos, escribinos a la tienda desde la sección de contacto."],
  ["s11_titulo", "11. Menores de Edad", "s11_body", "Esta tienda funciona sobre tol.ar, destinado a personas mayores de 18 años. Un usuario menor de edad solo puede utilizar esta tienda y sus servicios de pago (incluyendo Mercado Pago u otros medios habilitados) con la autorización expresa de su padre, madre o tutor legal, completando el Formulario de Autorización Parental disponible a continuación. Dicha autorización queda registrada de forma inmutable y disponible para el titular de la tienda. Si el usuario no completa este formulario, se presume que declara ser mayor de edad bajo su exclusiva responsabilidad, quedando tol.ar liberado de responsabilidad frente a declaraciones falsas."],
]

export default async function StoreTerminosPage({ params }: PageProps) {
  const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) notFound()

  const [categories, hasMayoristaMinorista, storePages] = await Promise.all([
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
    getStorePages(store.id),
  ])
  const headerStyle = store.plan_features?.header_style

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {headerStyle === "pink" ? (
        <StoreHeaderPink store={store} categories={categories} storePages={storePages} />
      ) : (
        <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      )}
      <StoreLegalPage
        subdomain={subdomain}
        page="terminos"
        titulo="Términos y Condiciones"
        fecha="Última actualización: Julio 2026"
        sections={SECTIONS}
      />
      <MinorConsentForm subdomain={subdomain} />
      <StoreFooter store={store} />
    </div>
  )
}
