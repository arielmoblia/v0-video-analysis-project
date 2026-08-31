import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function looksLikePem(value: string, label: "CERTIFICATE" | "PRIVATE KEY" | "RSA PRIVATE KEY"): boolean {
  return value.includes(`-----BEGIN ${label}-----`)
}

async function requireAdmin(subdomain: string) {
  const cookieStore = await cookies()
  return cookieStore.get(`admin_${subdomain.toLowerCase()}`)?.value === "true"
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { subdomain, cuit, certPem, keyPem } = body || {}

  if (!subdomain || !cuit || !certPem || !keyPem) {
    return NextResponse.json({ error: "Faltan datos: CUIT, certificado o clave privada" }, { status: 400 })
  }
  if (!(await requireAdmin(subdomain))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  if (!looksLikePem(certPem, "CERTIFICATE")) {
    return NextResponse.json({ error: "El archivo de certificado no parece válido (debe empezar con -----BEGIN CERTIFICATE-----)" }, { status: 400 })
  }
  if (!looksLikePem(keyPem, "PRIVATE KEY") && !looksLikePem(keyPem, "RSA PRIVATE KEY")) {
    return NextResponse.json({ error: "El archivo de clave privada no parece válido (debe empezar con -----BEGIN PRIVATE KEY----- o -----BEGIN RSA PRIVATE KEY-----)" }, { status: 400 })
  }

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const { error } = await supabase.from("store_invoicing_certs").upsert({
    store_id: store.id,
    cuit,
    cert_pem: encrypt(certPem),
    key_pem: encrypt(keyPem),
    status: "active",
    updated_at: new Date().toISOString(),
  }, { onConflict: "store_id" })

  if (error) {
    return NextResponse.json({ error: "Error al guardar el certificado", detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain")
  if (!subdomain) return NextResponse.json({ error: "Falta subdomain" }, { status: 400 })

  const { data: store } = await supabase.from("stores").select("id").ilike("subdomain", subdomain).single()
  if (!store) return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 })

  const { data: cert } = await supabase
    .from("store_invoicing_certs")
    .select("cuit, status, uploaded_at, updated_at")
    .eq("store_id", store.id)
    .maybeSingle()

  if (!cert) return NextResponse.json({ exists: false })

  return NextResponse.json({ exists: true, cuit: cert.cuit, status: cert.status, uploadedAt: cert.uploaded_at, updatedAt: cert.updated_at })
}
