import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const CLONE_CONSENT_TERMINOS_VERSION = "v1-2026-10"

// Cobra la "Portada especial" (pago único) con Mercado Pago y guarda el pedido.
// El cobro se hace acá, del lado del servidor, con el cardToken de un solo uso
// que generó el Brick en el navegador — nunca confiamos en un "aprobado" que
// venga del cliente.
export async function POST(request: NextRequest) {
  try {
    const { storeId, url, cardData, amountARS, storeName, subdomain, cloneConsentAccepted } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    // Dictamen del Jurista (03/10/2026): el checkbox general de los Términos
    // no alcanza para autorizar la clonación de una URL de terceros, porque
    // ese pedido puntual no existía al momento de aceptar el contrato marco.
    // Hace falta un consentimiento específico, registrado en este mismo
    // momento — sin eso, ni se cobra ni se clona nada.
    if (cloneConsentAccepted !== true) {
      return NextResponse.json({ error: "Falta la autorización para clonar esa página" }, { status: 400 })
    }

    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return NextResponse.json({ error: "Link inválido" }, { status: 400 })
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Link inválido" }, { status: 400 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const { error: consentError } = await supabase.from("portada_clone_consent").insert({
      store_id: storeId,
      store_name: storeName || null,
      subdomain: subdomain || null,
      url: parsed.toString(),
      terminos_version: CLONE_CONSENT_TERMINOS_VERSION,
      ip_address: ip,
      user_agent: userAgent,
    })

    if (consentError) {
      console.error("[theme-request] Error registrando consentimiento de clonación:", consentError)
      return NextResponse.json({ error: "No pudimos registrar la autorización, probá de nuevo" }, { status: 500 })
    }

    const { data: currentStore } = await supabase
      .from("stores")
      .select("plan_features")
      .eq("id", storeId)
      .single()

    const existing = currentStore?.plan_features?.custom_theme_request
    if (existing?.status === "pendiente" || existing?.status === "listo") {
      return NextResponse.json({ error: "Ya tenés un pedido en camino, esperá a que lo terminemos" }, { status: 409 })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "Mercado Pago no está configurado" }, { status: 500 })
    }

    const amount = Number(amountARS)
    if (!amount || amount <= 0 || !cardData?.token) {
      return NextResponse.json({ error: "Datos de pago inválidos" }, { status: 400 })
    }

    const externalReference = `portada_especial_${storeId}_${Date.now()}`

    const paymentRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": externalReference,
      },
      body: JSON.stringify({
        transaction_amount: amount,
        token: cardData.token,
        description: `Diseño Customizado de Portada tol.ar - Tienda: ${storeName || subdomain}`,
        installments: cardData.installments || 1,
        payment_method_id: cardData.payment_method_id,
        issuer_id: cardData.issuer_id,
        payer: { email: cardData.payer?.email },
        external_reference: externalReference,
      }),
    })

    const payment = await paymentRes.json()

    if (payment.status !== "approved") {
      return NextResponse.json({ error: payment.status_detail || "Pago rechazado. Probá con otra tarjeta." }, { status: 400 })
    }

    const custom_theme_request: Record<string, any> = {
      url: parsed.toString(),
      status: "pendiente",
      requested_at: new Date().toISOString(),
      mp_payment_id: payment.id?.toString() || null,
      amount_ars: amount,
    }

    // Clonado automático: le pedimos a scraping.tol.ar la foto de portada + título +
    // subtítulo de la página de origen y los aplicamos directo a la tienda del cliente,
    // sin que nadie del equipo la arme a mano. Si el sitio de origen bloquea, tarda de
    // más, o no tiene nada rescatable, el pedido queda "pendiente" igual que antes
    // (fallback manual) — nunca rompe el pago ya aprobado.
    const bannerUpdate: Record<string, string> = {}
    let clonedTemplate = false
    let clonedCarousels: Array<{ id: string; type: string; title?: string; phrases?: string[]; ctaText?: string; ctaKind?: string }> | null = null
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const scrapeRes = await fetch("https://scraping.tol.ar/api/scrape-homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.toString() }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (scrapeRes.ok) {
        const scraped = await scrapeRes.json()
        // Solo marcamos "listo" si de verdad rescatamos una FOTO de portada — casi
        // cualquier sitio tiene <title>, así que exigir solo bannerTitle marcaba pedidos
        // como terminados sin haber clonado ninguna imagen (el cliente veía "¡Listo!"
        // con el banner de siempre, solo con el título pisado).
        if (scraped.success && scraped.bannerImageUrl) {
          bannerUpdate.banner_image = scraped.bannerImageUrl
          // Guardamos "" explícito (no dejamos el campo sin tocar) cuando el sitio de
          // origen no tenía texto propio — así el hero sabe que es un clon real sin
          // texto y no cae en el placeholder genérico (el cliente pidió "igualita").
          bannerUpdate.banner_title = scraped.bannerTitle || ""
          bannerUpdate.banner_subtitle = scraped.bannerSubtitle || ""
          custom_theme_request.status = "listo"
          custom_theme_request.applied_at = new Date().toISOString()
          clonedTemplate = true
        } else if (scraped.success && Array.isArray(scraped.carousels) && scraped.carousels.length > 0) {
          // El sitio de referencia no tiene banner clásico, arranca directo con
          // carruseles (caso real: pinkonlineoficial, con 3 de productos, 1 franja
          // de texto y bloques CTA tipo "seguinos en WhatsApp/Instagram"). En vez de
          // dejar el pedido pendiente sin nada, armamos esos mismos bloques acá: con
          // LOS PRODUCTOS REALES de esta tienda (nunca los del sitio ajeno), el texto
          // real de la franja (nunca inventado), y en los CTA el link de contacto
          // real DE ESTA TIENDA (no el del sitio clonado — eso lo resuelve el
          // render con store.social_whatsapp/social_instagram).
          custom_theme_request.status = "listo"
          custom_theme_request.applied_at = new Date().toISOString()
          custom_theme_request.carousels_only = true
          clonedCarousels = scraped.carousels.map((c: any, i: number) => ({
            id: `cloned_${Date.now()}_${i}`,
            type: c.type === "cta" ? "cta" : c.type === "text" ? "text" : "products",
            ...(c.title ? { title: String(c.title).slice(0, 60) } : {}),
            ...(Array.isArray(c.phrases) ? { phrases: c.phrases.slice(0, 6) } : {}),
            ...(c.type === "cta" && c.ctaText ? { ctaText: String(c.ctaText).slice(0, 250) } : {}),
            ...(c.type === "cta" && (c.ctaKind === "whatsapp" || c.ctaKind === "instagram") ? { ctaKind: c.ctaKind } : {}),
          }))
        }
      }
    } catch (e) {
      console.error("[theme-request] Error clonando portada automáticamente:", e)
    }

    // El "modelo" (active_theme) que la tienda tenía antes de comprar esto no tiene nada
    // que ver con la página que el cliente quiere clonar — puede ser "artesano" o "bold",
    // temples con título gigante en bloque que pisan cualquier foto/texto que le pongamos.
    // Al clonar de verdad, pasamos al temple "basico" (overlay clásico, título/subtítulo
    // de tamaño normal) para que el resultado se parezca al sitio de origen en vez de
    // quedar con el estilo tipográfico de lo que hubiera antes.
    const planFeaturesUpdate: Record<string, any> = { ...(currentStore?.plan_features || {}), custom_theme_request }
    if (clonedTemplate) {
      planFeaturesUpdate.active_theme = "basico"
    }
    if (clonedCarousels) {
      planFeaturesUpdate.carousels = clonedCarousels
    }

    const nextPlanFeatures = planFeaturesUpdate

    const { error } = await supabase
      .from("stores")
      .update({ plan_features: nextPlanFeatures, ...bannerUpdate })
      .eq("id", storeId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const autoApplied = custom_theme_request.status === "listo"

    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY || process.env.RESENDAPIKEY)
      await resend.emails.send({
        from: "TOL.AR <ventas@tiendaonline.com.ar>",
        to: "soporte@tiendaonline.com.ar",
        subject: `[Diseño Customizado de Portada] ${storeName || subdomain} pidió clonar una página`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#96305a">Nuevo pedido de Diseño Customizado de Portada</h2>
          <p><strong>Tienda:</strong> ${storeName || subdomain} (${subdomain}.tol.ar)</p>
          <p><strong>Página que quiere clonar:</strong> <a href="${parsed.toString()}">${parsed.toString()}</a></p>
          <p><strong>Pagó:</strong> $${amount.toLocaleString("es-AR")} ARS</p>
          <p><strong>Estado:</strong> ${autoApplied ? "Clonada y aplicada automático ✅ (no hace falta armarla a mano)" : "No se pudo clonar sola, hay que armarla a mano"}</p>
          <p><a href="https://${subdomain}.tol.ar/admin?tab=planes">Ver en el admin de la tienda</a></p>
        </div>`,
      })
    } catch (e) {
      console.error("[theme-request] Error enviando mail de aviso:", e)
    }

    return NextResponse.json({ success: true, custom_theme_request })
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
