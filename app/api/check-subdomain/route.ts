import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subdomain = searchParams.get("subdomain")

  if (!subdomain) {
    return NextResponse.json({ available: false, error: "Subdomain requerido" }, { status: 400 })
  }

  // Normalizar el subdominio
  const normalizedSubdomain = subdomain.toLowerCase().trim()

  // Verificar si el subdominio ya existe en stores
  const { data: existingStore } = await supabase
    .from("stores")
    .select("id")
    .eq("subdomain", normalizedSubdomain)
    .maybeSingle()

  if (existingStore) {
    return NextResponse.json({ 
      available: false, 
      message: "Este nombre ya está en uso" 
    })
  }

  return NextResponse.json({ 
    available: true, 
    message: "Nombre disponible" 
  })
}
