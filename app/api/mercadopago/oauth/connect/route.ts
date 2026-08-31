import { type NextRequest, NextResponse } from "next/server"

// Arranca el login OAuth de Mercado Pago para que el dueño de la tienda conecte
// su cuenta al marketplace de tol.ar (split de pagos). Solo disponible para
// tiendas habilitadas vía MP_MARKETPLACE_TEST_STORE_ID mientras está en prueba.
export async function GET(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId")

  if (!storeId) {
    return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  }

  const testStoreId = process.env.MP_MARKETPLACE_TEST_STORE_ID
  if (storeId !== testStoreId) {
    return NextResponse.json({ error: "Split de pagos aún no habilitado para esta tienda" }, { status: 403 })
  }

  const clientId = process.env.MP_MARKETPLACE_CLIENT_ID
  const redirectUri = process.env.MP_MARKETPLACE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Marketplace de Mercado Pago no configurado" }, { status: 500 })
  }

  const authUrl = new URL("https://auth.mercadopago.com.ar/authorization")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("platform_id", "mp")
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("state", storeId)

  return NextResponse.redirect(authUrl.toString())
}
