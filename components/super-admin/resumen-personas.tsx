"use client"
import type { PersonasResumenData } from "./personas-resumen-types"

export function ResumenPersonas({ data, loading }: { data: PersonasResumenData | null; loading: boolean }) {
  const fila = (label: string, valor: number | null) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "2px 10px", minWidth: 56, textAlign: "center" }}>
        {loading ? "…" : valor?.toLocaleString("es-AR") ?? "—"}
      </span>
    </div>
  )

  const grupo = (titulo: string) => (
    <h4 style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginTop: 14, marginBottom: 2 }}>{titulo}</h4>
  )

  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Personas (no visitas ni clicks)</h3>

      {grupo("Tol.ar")}
      {fila("Personas que entraron a tol.ar", data?.tolarTotal ?? null)}
      {fila("Sin señal de interés en crear tienda", data?.tolarSinSenal ?? null)}
      {fila("Con señal de interés en crear tienda", data?.tolarConSenal ?? null)}

      {grupo("Tiendas ya hechas")}
      {fila("Tiendas creadas", data?.tiendasCreadas ?? null)}
      {fila("Tiendas con su dueño activo en el panel", data?.tiendasConAdminActivo ?? null)}
      {fila("Personas que entraron a una tienda", data?.personasEnTiendas ?? null)}
      {fila("Personas que compraron", data?.personasQueCompraron ?? null)}

      <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 10, lineHeight: 1.4 }}>
        Cada número cuenta personas distintas, no visitas ni páginas miradas. "Señal de interés" es haber entrado a
        plan gratis, templates, pagos, plan cositas, contacto o crear tienda. "Tiendas con su dueño activo" cuenta
        tiendas (no personas) porque el ingreso al panel no guarda un identificador de persona — si el mismo dueño
        entra desde el celular y la computadora, hoy no se puede distinguir.
      </p>
    </div>
  )
}
