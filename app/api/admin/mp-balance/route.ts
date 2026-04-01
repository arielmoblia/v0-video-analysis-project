import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })

    const { data: pm } = await supabase
      .from("payment_methods")
      .select("mercadopago_access_token")
      .eq("store_id", storeId)
      .single()

    if (!pm?.mercadopago_access_token) return NextResponse.json({ error: "Sin token" }, { status: 400 })

    const token = pm.mercadopago_access_token

    const [balanceRes, movRes] = await Promise.all([
      fetch("https://api.mercadopago.com/v1/account/balance", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch("https://api.mercadopago.com/v1/account/movements/search?limit=1", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])

    const balance = await balanceRes.json()
    const mov = await movRes.json()

    const lastMovDate = mov?.results?.[0]?.date_created
    const lastMovAgo = lastMovDate ? formatAgo(new Date(lastMovDate)) : null

    return NextResponse.json({
      available: balance?.available_balance || 0,
      pending: balance?.unavailable_balance || 0,
      lastMovAgo
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al consultar MP" }, { status: 500 })
  }
}

function formatAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hs = Math.floor(mins / 60)
  if (hs < 24) return `hace ${hs} hs`
  return `hace ${Math.floor(hs / 24)} días`
}
