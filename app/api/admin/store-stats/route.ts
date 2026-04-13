import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function detectDevice(ua: string): "celular" | "tablet" | "computadora" {
  if (!ua) return "computadora"
  const u = ua.toLowerCase()
  if (/tablet|ipad/.test(u)) return "tablet"
  if (/mobile|android|iphone/.test(u)) return "celular"
  return "computadora"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")
  const days = parseInt(searchParams.get("days") || "30")
  if (!storeId) return NextResponse.json({ error: "storeId requerido" }, { status: 400 })

  const since = new Date()
  since.setDate(since.getDate() - days)

  const prevSince = new Date(since)
  prevSince.setDate(prevSince.getDate() - days)

  try {
    // Visitas del período actual
    const { data: views } = await supabase
      .from("page_views")
      .select("created_at, visitor_id, page_path, user_agent")
      .eq("store_id", storeId)
      .gte("created_at", since.toISOString())

    // Visitas del período anterior (para deltas)
    const { data: prevViews } = await supabase
      .from("page_views")
      .select("visitor_id")
      .eq("store_id", storeId)
      .gte("created_at", prevSince.toISOString())
      .lt("created_at", since.toISOString())

    // Pedidos del período actual
    const { data: orders } = await supabase
      .from("orders")
      .select("created_at")
      .eq("store_id", storeId)
      .gte("created_at", since.toISOString())

    // Pedidos del período anterior
    const { data: prevOrders } = await supabase
      .from("orders")
      .select("id")
      .eq("store_id", storeId)
      .gte("created_at", prevSince.toISOString())
      .lt("created_at", since.toISOString())

    const vws = views || []
    const pvws = prevViews || []
    const ords = orders || []
    const pords = prevOrders || []

    // Métricas principales
    const totalVisitas = vws.length
    const totalUnicos = new Set(vws.map(v => v.visitor_id).filter(Boolean)).size
    const totalPedidos = ords.length
    const conversion = totalVisitas > 0 ? parseFloat(((totalPedidos / totalVisitas) * 100).toFixed(1)) : 0

    const prevVisitas = pvws.length
    const prevUnicos = new Set(pvws.map(v => v.visitor_id).filter(Boolean)).size
    const prevPedidos = pords.length
    const prevConversion = prevVisitas > 0 ? parseFloat(((prevPedidos / prevVisitas) * 100).toFixed(1)) : 0

    // Visitas por día
    const byDay: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      byDay[d.toISOString().split("T")[0]] = 0
    }
    vws.forEach(v => {
      const day = v.created_at.split("T")[0]
      if (byDay[day] !== undefined) byDay[day]++
    })
    const dailyViews = Object.entries(byDay).map(([date, count]) => ({ date, count }))

    // Horarios pico
    const byHour: Record<number, number> = {}
    for (let h = 0; h < 24; h++) byHour[h] = 0
    vws.forEach(v => {
      const h = new Date(v.created_at).getHours()
      byHour[h]++
    })
    const horasPico = Object.entries(byHour)
      .map(([h, count]) => ({ hora: `${h.padStart(2,"0")}hs`, count }))
      .filter(h => h.count > 0)
      .sort((a, b) => parseInt(a.hora) - parseInt(b.hora))

    // Dispositivos
    const devices = { celular: 0, tablet: 0, computadora: 0 }
    vws.forEach(v => { devices[detectDevice(v.user_agent || "")]++ })
    const totalDevices = Object.values(devices).reduce((a, b) => a + b, 1)
    const dispositivos = [
      { name: "Celular",     pct: Math.round(devices.celular      / totalDevices * 100) },
      { name: "Computadora", pct: Math.round(devices.computadora  / totalDevices * 100) },
      { name: "Tablet",      pct: Math.round(devices.tablet       / totalDevices * 100) },
    ]

    // Productos más vistos
    const pathCount: Record<string, number> = {}
    vws.forEach(v => {
      if (v.page_path && v.page_path.includes("/producto/")) {
        pathCount[v.page_path] = (pathCount[v.page_path] || 0) + 1
      }
    })
    const maxViews = Math.max(...Object.values(pathCount), 1)
    const topProductos = Object.entries(pathCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, views]) => ({
        name: decodeURIComponent(path.split("/producto/")[1] || path),
        views,
        pct: Math.round(views / maxViews * 100)
      }))

    // Función delta
    const delta = (curr: number, prev: number) => {
      if (prev === 0) return { txt: "sin datos anteriores", cls: "neutral" }
      const d = curr - prev
      const pct = Math.round(Math.abs(d) / prev * 100)
      return { txt: `${d >= 0 ? "+" : "-"}${pct}% vs período anterior`, cls: d >= 0 ? "up" : "down" }
    }

    return NextResponse.json({
      visitas:    { val: totalVisitas, delta: delta(totalVisitas, prevVisitas) },
      unicos:     { val: totalUnicos,  delta: delta(totalUnicos, prevUnicos) },
      pedidos:    { val: totalPedidos, delta: delta(totalPedidos, prevPedidos) },
      conversion: { val: conversion,   delta: delta(conversion, prevConversion) },
      dailyViews,
      horasPico,
      dispositivos,
      topProductos,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
