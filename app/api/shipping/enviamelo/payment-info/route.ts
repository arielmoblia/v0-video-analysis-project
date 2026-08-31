import { NextResponse } from "next/server"

// Datos de la cuenta de Enviamelo para que el vendedor le transfiera a mano (desde su
// Mercado Pago) el costo del envío después de generar la guía real. Todavía no están
// cargados en ningún lado del sistema — se leen de variables de entorno para no inventar
// un valor. Cuando Enviamelo/tol.ar confirme el alias/CBU real, completar
// ENVIAMELO_PAYMENT_ALIAS / ENVIAMELO_PAYMENT_CBU en .env.local (dev) y en el entorno de
// producción.
export async function GET() {
  return NextResponse.json({
    alias: process.env.ENVIAMELO_PAYMENT_ALIAS || "",
    cbu: process.env.ENVIAMELO_PAYMENT_CBU || "",
  })
}
