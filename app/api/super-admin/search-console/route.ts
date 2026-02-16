import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Generar JWT para autenticacion con cuenta de servicio
async function generateJWT(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!
  const privateKeyPem = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n")

  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64url")

  const headerB64 = encode(header)
  const payloadB64 = encode(payload)
  const signInput = `${headerB64}.${payloadB64}`

  // Importar la clave privada
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signInput)
  )

  const signatureB64 = Buffer.from(signature).toString("base64url")
  return `${signInput}.${signatureB64}`
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "")
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function getAccessToken(): Promise<string> {
  const jwt = await generateJWT()

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Token error: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

export async function GET() {
  try {
    // Verificar super admin
    const cookieStore = await cookies()
    const superAdmin = cookieStore.get("super_admin")
    if (!superAdmin?.value) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const accessToken = await getAccessToken()
    const siteUrl = "sc-domain:tol.ar"

    // Obtener metricas de los ultimos 28 dias
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 28)

    const formatDate = (d: Date) => d.toISOString().split("T")[0]

    // Query principal - metricas generales
    const metricsRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: [],
          rowLimit: 1,
        }),
      }
    )

    if (!metricsRes.ok) {
      const errorData = await metricsRes.json()
      console.error("[Search Console] API error:", errorData)
      return NextResponse.json({ error: "Error de API", details: errorData }, { status: 500 })
    }

    const metricsData = await metricsRes.json()
    const row = metricsData.rows?.[0] || {}

    // Query por dia para grafico de tendencia
    const dailyRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["date"],
          rowLimit: 28,
        }),
      }
    )

    const dailyData = dailyRes.ok ? await dailyRes.json() : { rows: [] }

    // Query top queries
    const queriesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["query"],
          rowLimit: 10,
        }),
      }
    )

    const queriesData = queriesRes.ok ? await queriesRes.json() : { rows: [] }

    // Query top paginas
    const pagesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["page"],
          rowLimit: 10,
        }),
      }
    )

    const pagesData = pagesRes.ok ? await pagesRes.json() : { rows: [] }

    return NextResponse.json({
      metrics: {
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        position: row.position ? Math.round(row.position * 10) / 10 : 0,
        ctr: row.ctr ? Math.round(row.ctr * 1000) / 10 : 0,
      },
      daily: (dailyData.rows || []).map((r: any) => ({
        date: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      topQueries: (queriesData.rows || []).map((r: any) => ({
        query: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      topPages: (pagesData.rows || []).map((r: any) => ({
        page: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        position: Math.round(r.position * 10) / 10,
        ctr: Math.round(r.ctr * 1000) / 10,
      })),
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
    })
  } catch (error: any) {
    console.error("[Search Console] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
