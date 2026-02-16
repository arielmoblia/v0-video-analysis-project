import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function fetchMEPRate(): Promise<number> {
  try {
    // Usar DolarAPI.com para obtener cotización MEP/Bolsa
    const response = await fetch("https://dolarapi.com/v1/dolares/bolsa", {
      next: { revalidate: 3600 }, // Cache por 1 hora
    })

    if (response.ok) {
      const data = await response.json()
      // Usar el promedio entre compra y venta
      const rate = (data.compra + data.venta) / 2
      return Math.round(rate)
    }
  } catch (error) {
    console.error("Error fetching MEP rate:", error)
  }

  // Fallback a una cotización por defecto si falla la API
  return 1100
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "exchange_rate")
      .maybeSingle()

    if (error) throw error

    const settings = data?.value || {}

    if (settings.useAutoRate !== false) {
      const mepRate = await fetchMEPRate()
      return NextResponse.json({
        rate: mepRate,
        useAutoRate: true,
        source: "mep",
        lastUpdate: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      rate: settings.rate || 1100,
      useAutoRate: false,
      source: "manual",
      lastUpdate: settings.lastUpdate || null,
    })
  } catch (error) {
    console.error("Error:", error)
    const mepRate = await fetchMEPRate()
    return NextResponse.json({
      rate: mepRate,
      useAutoRate: true,
      source: "mep",
    })
  }
}

export async function POST(request: Request) {
  try {
    const { rate, useAutoRate } = await request.json()

    if (useAutoRate) {
      const mepRate = await fetchMEPRate()

      await supabase.from("platform_settings").upsert(
        {
          key: "exchange_rate",
          value: {
            rate: mepRate,
            useAutoRate: true,
            lastUpdate: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      return NextResponse.json({
        success: true,
        rate: mepRate,
        useAutoRate: true,
        source: "mep",
      })
    }

    const { error } = await supabase.from("platform_settings").upsert(
      {
        key: "exchange_rate",
        value: {
          rate,
          useAutoRate: false,
          lastUpdate: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    )

    if (error) throw error

    return NextResponse.json({
      success: true,
      rate,
      useAutoRate: false,
      source: "manual",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error guardando cotización" }, { status: 500 })
  }
}
