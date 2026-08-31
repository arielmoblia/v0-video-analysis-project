import { createClient } from "@supabase/supabase-js"
import { encryptFields } from "@/lib/crypto"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// El dueño de la tienda vuelve acá después de autorizar en Mercado Pago.
// Canjeamos el code por el access_token de su cuenta y lo guardamos para
// poder armar el split (marketplace_fee) en create-preference.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const storeId = request.nextUrl.searchParams.get("state")
  const mpError = request.nextUrl.searchParams.get("error")

  const { data: store } = storeId
    ? await supabase.from("stores").select("subdomain").eq("id", storeId).single()
    : { data: null }

  const adminUrl = store ? `https://${store.subdomain}.tol.ar/admin` : "https://tol.ar"

  if (mpError || !code || !storeId) {
    return NextResponse.redirect(`${adminUrl}?mp_oauth=error`)
  }

  const testStoreId = process.env.MP_MARKETPLACE_TEST_STORE_ID
  if (storeId !== testStoreId) {
    return NextResponse.redirect(`${adminUrl}?mp_oauth=error`)
  }

  try {
    const tokenResponse = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.MP_MARKETPLACE_CLIENT_ID,
        client_secret: process.env.MP_MARKETPLACE_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.MP_MARKETPLACE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error("[mp-oauth] Error canjeando code:", errorData)
      return NextResponse.redirect(`${adminUrl}?mp_oauth=error`)
    }

    const tokenData = await tokenResponse.json()

    const encrypted = encryptFields(
      {
        mercadopago_oauth_access_token: tokenData.access_token as string,
        mercadopago_oauth_refresh_token: tokenData.refresh_token as string,
      },
      ["mercadopago_oauth_access_token", "mercadopago_oauth_refresh_token"],
    )

    const { data: existing } = await supabase.from("payment_methods").select("id").eq("store_id", storeId).single()

    const payload = {
      ...encrypted,
      mercadopago_oauth_user_id: String(tokenData.user_id ?? ""),
      mercadopago_oauth_connected: true,
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      await supabase.from("payment_methods").update(payload).eq("store_id", storeId)
    } else {
      await supabase.from("payment_methods").insert({ store_id: storeId, ...payload })
    }

    return NextResponse.redirect(`${adminUrl}?mp_oauth=success`)
  } catch (error) {
    console.error("[mp-oauth] Error en callback:", error)
    return NextResponse.redirect(`${adminUrl}?mp_oauth=error`)
  }
}
