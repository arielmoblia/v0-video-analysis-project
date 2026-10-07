import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Pantalla de reconciliación: cada pago que entra a la cuenta de MercadoPago de
// TOL.AR (cositas sueltas + renovaciones de suscripción) ya guarda el store_id
// en la base (ver external_reference en create-preference y el payment_id que
// manda el webhook). Esto solo lo junta con los datos de la tienda para poder
// buscar por monto/fecha/payment_id y encontrar a quién corresponde un cobro
// que aparece en el panel de MercadoPago sin esa referencia visible.
export async function GET() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("super_admin")?.value === "true"
  if (!isAuthenticated) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401, headers: { "Cache-Control": "no-store" } })
  }

  const { data: purchases, error: purchasesError } = await supabase
    .from("feature_purchases")
    .select("id, store_id, feature_name, features, amount_ars, external_reference, payment_id, payment_method, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500)

  const { data: subscriptionCharges, error: subError } = await supabase
    .from("store_purchased_features")
    .select("id, store_id, feature_code, feature_name, payment_method, mp_preapproval_id, payment_id, mp_subscription_status, is_trial, purchased_at, activated_at")
    .eq("payment_method", "mercadopago_subscription")
    .not("payment_id", "is", null)
    .order("purchased_at", { ascending: false })
    .limit(500)

  if (purchasesError || subError) {
    return NextResponse.json({ error: purchasesError?.message || subError?.message }, { status: 500 })
  }

  const storeIds = new Set<string>()
  ;(purchases || []).forEach(p => storeIds.add(p.store_id))
  ;(subscriptionCharges || []).forEach(s => storeIds.add(s.store_id))

  const { data: stores } = await supabase
    .from("stores")
    .select("id, subdomain, email, site_title")
    .in("id", Array.from(storeIds))

  const storeById: Record<string, any> = {}
  ;(stores || []).forEach(s => { storeById[s.id] = s })

  const pagos = [
    ...(purchases || []).map(p => ({
      id: p.id,
      tipo: "cosita" as const,
      fecha: p.created_at,
      store: storeById[p.store_id] || null,
      store_id: p.store_id,
      monto_ars: Number(p.amount_ars) || 0,
      estado: p.status,
      payment_id: p.payment_id,
      external_reference: p.external_reference,
      concepto: Array.isArray(p.features) && p.features.length > 0
        ? p.features.map((f: any) => f.name || f.code).join(", ")
        : (p.feature_name || ""),
    })),
    ...(subscriptionCharges || []).map(s => ({
      id: s.id,
      tipo: "renovacion" as const,
      fecha: s.purchased_at || s.activated_at,
      store: storeById[s.store_id] || null,
      store_id: s.store_id,
      monto_ars: null,
      estado: s.mp_subscription_status,
      payment_id: s.payment_id,
      external_reference: s.mp_preapproval_id,
      concepto: s.feature_name || s.feature_code,
    })),
  ].sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime())

  return NextResponse.json({ pagos }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } })
}
