import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { getStorePages } from "@/lib/services/store-pages"
import { StoreHeader } from "@/components/store/store-header"
import { StoreHeaderPink } from "@/components/store/store-header-pink"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreLegalPage } from "@/components/store/store-legal-page"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string }>
}

const SECTIONS: [string, string, string, string][] = [
  ["s1_titulo", "1. Información que Recopilamos", "s1_body", "Recopilamos tu email, nombre y dirección al hacer un pedido. También datos de navegación y uso para mejorar el sitio."],
  ["s2_titulo", "2. Cómo Usamos tu Información", "s2_body", "Para procesar tu pedido, coordinar el envío, procesar el pago, enviarte notificaciones sobre tu compra y prevenir fraude."],
  ["s3_titulo", "3. Compartición de Datos", "s3_body", "Solo con procesadores de pago y de envío necesarios para completar tu compra. Nunca vendemos tus datos a terceros."],
  ["s4_titulo", "4. Seguridad de los Datos", "s4_body", "Usamos encriptación SSL/TLS y las medidas de seguridad provistas por la plataforma tol.ar para proteger tu información."],
  ["s5_titulo", "5. Tus Derechos", "s5_body", "Podés solicitar acceso, rectificación o eliminación de tus datos escribiéndonos desde la sección de contacto de esta tienda."],
  ["s6_titulo", "6. Cookies", "s6_body", "Usamos cookies esenciales para el funcionamiento del carrito y la sesión de compra. No usamos cookies de seguimiento publicitario."],
  ["s7_titulo", "7. Retención de Datos", "s7_body", "Conservamos los datos de tu pedido el tiempo necesario para cumplir con obligaciones legales y comerciales."],
  ["s8_titulo", "8. Menores de Edad", "s8_body", "Esta tienda no está dirigida a menores de 18 años sin supervisión de un adulto responsable de la compra."],
  ["s9_titulo", "9. Cambios en esta Política", "s9_body", "Podemos actualizar esta política periódicamente. Los cambios importantes se reflejarán en esta misma página."],
  ["s10_titulo", "10. Contacto", "s10_body", "Para consultas sobre privacidad, escribinos desde la sección de contacto de esta tienda."],
]

export default async function StorePrivacidadPage({ params }: PageProps) {
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
        page="privacidad"
        titulo="Política de Privacidad"
        fecha="Última actualización: Julio 2026"
        sections={SECTIONS}
      />
      <StoreFooter store={store} />
    </div>
  )
}
