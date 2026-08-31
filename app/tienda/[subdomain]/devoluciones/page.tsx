import { notFound } from "next/navigation"
import { getStoreBySubdomain, getStoreCategories } from "@/lib/store-context"
import { hasStoreFeature } from "@/lib/services/stores"
import { StoreHeader } from "@/components/store/store-header"
import { StoreFooter } from "@/components/store/store-footer"
import { StoreLegalPage } from "@/components/store/store-legal-page"

export const revalidate = 0

interface PageProps {
  params: Promise<{ subdomain: string }>
}

const SECTIONS: [string, string, string, string][] = [
  ["s1_titulo", "1. Derecho a Devolución", "s1_body", "Tenés 10 días corridos desde que recibís el producto para arrepentirte de la compra, según la Ley de Defensa del Consumidor (Ley 24.240) para compras a distancia. No hace falta justificar el motivo."],
  ["s2_titulo", "2. Condiciones del Producto", "s2_body", "El producto debe devolverse sin uso, con su embalaje original y todos los accesorios, manuales y etiquetas incluidos. Si el producto llegó dañado o con fallas de fábrica, el plazo y las condiciones pueden variar: contactanos apenas lo detectes."],
  ["s3_titulo", "3. Productos No Sujetos a Devolución", "s3_body", "Por razones de higiene o personalización no aceptamos devolución de: ropa interior, trajes de baño, productos de cuidado personal abiertos, y artículos hechos a medida o personalizados, salvo que presenten un defecto de fábrica."],
  ["s4_titulo", "4. Cómo Solicitar una Devolución", "s4_body", "Escribinos a la tienda donde compraste indicando tu número de pedido y el motivo de la devolución. Te vamos a confirmar la dirección de envío y los pasos a seguir dentro de las 48 horas hábiles."],
  ["s5_titulo", "5. Costos de Envío", "s5_body", "Si el motivo de la devolución es un arrepentimiento de compra, el costo de envío de vuelta corre por cuenta del comprador. Si el producto llegó con fallas, dañado o distinto a lo pedido, el costo del envío lo cubre la tienda."],
  ["s6_titulo", "6. Reembolsos", "s6_body", "Una vez que recibimos y verificamos el producto devuelto, procesamos el reembolso dentro de los 10 días hábiles, por el mismo medio de pago utilizado en la compra."],
  ["s7_titulo", "7. Cambios", "s7_body", "Si preferís un cambio de talle, color o modelo en lugar de un reembolso, indicalo al solicitar la devolución. El cambio queda sujeto a disponibilidad de stock del producto solicitado."],
  ["s8_titulo", "8. Contacto", "s8_body", "Ante cualquier duda sobre esta política, escribinos a soporte@tiendaonline.com.ar."],
]

export default async function StoreDevolucionesPage({ params }: PageProps) {
  const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain)
  if (!store) notFound()

  const [categories, hasMayoristaMinorista] = await Promise.all([
    getStoreCategories(store.id),
    hasStoreFeature(store.id, "mayorista_minorista"),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader store={store} categories={categories} hasMayoristaMinorista={hasMayoristaMinorista} />
      <StoreLegalPage
        subdomain={subdomain}
        page="devoluciones"
        titulo="Política de Devoluciones"
        fecha="Última actualización: Julio 2026"
        sections={SECTIONS}
      />
      <StoreFooter store={store} />
    </div>
  )
}
