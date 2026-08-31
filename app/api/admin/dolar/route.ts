import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TIPOS = ["oficial","blue","bolsa","ccl","mayorista","cripto"] as const

export async function GET(request: NextRequest) {
  const storeId = new URL(request.url).searchParams.get("storeId")
  if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })
  const { data } = await supabase.from("stores").select("dolar_tipo").eq("id", storeId).single()
  const tipo = data?.dolar_tipo || "blue"
  try {
    const res = await fetch(`https://dolarapi.com/v1/dolares`, { next: { revalidate: 3600 } })
    const dolares = await res.json()
    return NextResponse.json({ tipo, dolares })
  } catch {
    return NextResponse.json({ tipo, dolares: [] })
  }
}

export async function PATCH(request: NextRequest) {
  const { storeId, tipo, valor } = await request.json()
  if (!storeId || !TIPOS.includes(tipo)) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  const { error } = await supabase.from("stores").update({ dolar_tipo: tipo, dolar_valor: valor }).eq("id", storeId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
