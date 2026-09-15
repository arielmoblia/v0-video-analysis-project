"use client"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { EditableText, usePageContent } from "@/components/editable-text"

interface Props {
  brand?: "tol" | "tiendabasica"
}

export default function DevolucionesPage({ brand = "tol" }: Props) {
  const { isAdmin, get } = usePageContent("devoluciones")
  const ET = (field: string, fallback: string) => (
    <EditableText page="devoluciones" field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#6366f1" />
  )

  const sections = [
    ["s1_titulo","1. Derecho a Devolución","s1_body","Tenés 10 días corridos desde que recibís el producto para arrepentirte de la compra, según la Ley de Defensa del Consumidor (Ley 24.240) para compras a distancia. No hace falta justificar el motivo."],
    ["s2_titulo","2. Condiciones del Producto","s2_body","El producto debe devolverse sin uso, con su embalaje original y todos los accesorios, manuales y etiquetas incluidos. Si el producto llegó dañado o con fallas de fábrica, el plazo y las condiciones pueden variar: contactanos apenas lo detectes."],
    ["s3_titulo","3. Productos No Sujetos a Devolución","s3_body","Por razones de higiene o personalización no aceptamos devolución de: ropa interior, trajes de baño, productos de cuidado personal abiertos, y artículos hechos a medida o personalizados, salvo que presenten un defecto de fábrica."],
    ["s4_titulo","4. Cómo Solicitar una Devolución","s4_body","Escribinos a la tienda donde compraste indicando tu número de pedido y el motivo de la devolución. Te vamos a confirmar la dirección de envío y los pasos a seguir dentro de las 48 horas hábiles."],
    ["s5_titulo","5. Costos de Envío","s5_body","Si el motivo de la devolución es un arrepentimiento de compra, el costo de envío de vuelta corre por cuenta del comprador. Si el producto llegó con fallas, dañado o distinto a lo pedido, el costo del envío lo cubre la tienda."],
    ["s6_titulo","6. Reembolsos","s6_body","Una vez que recibimos y verificamos el producto devuelto, procesamos el reembolso dentro de los 10 días hábiles, por el mismo medio de pago utilizado en la compra."],
    ["s7_titulo","7. Cambios","s7_body","Si preferís un cambio de talle, color o modelo en lugar de un reembolso, indicalo al solicitar la devolución. El cambio queda sujeto a disponibilidad de stock del producto solicitado."],
    ["s8_titulo","8. Contacto","s8_body","Ante cualquier duda sobre esta política, escribinos a soporte@tiendaonline.com.ar."],
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header brand={brand} />
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">{ET("titulo", "Política de Devoluciones")}</h1>
          <p className="text-muted-foreground mb-8">{ET("fecha", "Última actualización: Julio 2026")}</p>
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
      <Footer brand={brand} />
    </div>
  )
}
