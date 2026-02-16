import { NextResponse } from "next/server"

// Conversions API (CAPI) - Server-side tracking
// Funciona aunque el usuario tenga AdBlock
export async function POST(request: Request) {
  try {
    const { eventName, data, metaPixelId, googleAnalyticsId } = await request.json()

    const results = { meta: false, google: false }

    // Meta Conversions API (server-to-server)
    if (metaPixelId && process.env.META_CAPI_TOKEN) {
      try {
        const eventData = {
          data: [{
            event_name: eventName === "ViewContent" ? "ViewContent" 
              : eventName === "AddToCart" ? "AddToCart" 
              : eventName === "Purchase" ? "Purchase" : eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: data?.url || "",
            user_data: {
              client_ip_address: request.headers.get("x-forwarded-for") || "",
              client_user_agent: request.headers.get("user-agent") || "",
            },
            custom_data: {
              currency: "ARS",
              value: data?.total || data?.price || 0,
              content_ids: data?.productIds || (data?.id ? [data.id] : []),
              content_type: "product",
              content_name: data?.name || "",
              num_items: data?.numItems || 1,
            }
          }]
        }

        const res = await fetch(
          `https://graph.facebook.com/v18.0/${metaPixelId}/events?access_token=${process.env.META_CAPI_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          }
        )
        results.meta = res.ok
      } catch (e) {
        console.error("CAPI Meta error:", e)
      }
    }

    // Google Analytics Measurement Protocol (server-side)
    if (googleAnalyticsId && process.env.GA_MEASUREMENT_SECRET) {
      try {
        const gaEvent = {
          client_id: data?.clientId || "server",
          events: [{
            name: eventName === "ViewContent" ? "view_item"
              : eventName === "AddToCart" ? "add_to_cart"
              : eventName === "Purchase" ? "purchase" : eventName,
            params: {
              currency: "ARS",
              value: data?.total || data?.price || 0,
              items: data?.items || [{ item_id: data?.id, item_name: data?.name, price: data?.price }],
              ...(eventName === "Purchase" && { transaction_id: data?.orderId }),
            }
          }]
        }

        const measurementId = googleAnalyticsId.replace("G-", "")
        const res = await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${googleAnalyticsId}&api_secret=${process.env.GA_MEASUREMENT_SECRET}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gaEvent),
          }
        )
        results.google = res.ok
      } catch (e) {
        console.error("CAPI Google error:", e)
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (error) {
    console.error("CAPI error:", error)
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
