export async function notifyGoogleIndex(url: string) {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!email || !privateKey) {
      console.log("[Google Indexing] Credenciales no configuradas, saltando notificacion")
      return
    }

    // Crear JWT para autenticacion con Google
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
    const now = Math.floor(Date.now() / 1000)
    const claim = btoa(
      JSON.stringify({
        iss: email,
        scope: "https://www.googleapis.com/auth/indexing",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    )

    // Importar clave privada para firmar
    const pemContent = privateKey
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s/g, "")

    const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0))

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const signatureInput = new TextEncoder().encode(`${header}.${claim}`)
    const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, signatureInput)
    const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    const jwt = `${header}.${claim}.${signature}`

    // Obtener access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error("[Google Indexing] Error obteniendo token:", tokenData)
      return
    }

    // Notificar a Google Indexing API
    const indexRes = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED",
      }),
    })

    const indexData = await indexRes.json()

    if (indexRes.ok) {
      console.log(`[Google Indexing] Notificacion exitosa para: ${url}`)
    } else {
      console.error(`[Google Indexing] Error:`, indexData)
    }
  } catch (error) {
    console.error(`[Google Indexing] Error:`, error)
  }
}
