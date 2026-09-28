import { NextResponse } from "next/server"
import { Resend } from "resend"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

const resend = new Resend(process.env.RESEND_API_KEY)

const API_BASE = "https://api.tiendanube.com/v1"
const USER_AGENT = "tol.ar migraciones (soporte@tiendaonline.com.ar)"
const PER_PAGE = 200
const MAX_PAGES = 50 // hasta 10.000 productos, tope de seguridad

interface TiendanubeImage {
  id: number
  src: string
}

interface TiendanubeVariant {
  price: string
  promotional_price: string | null
  stock: number | null
  sku: string | null
}

interface TiendanubeProduct {
  id: number
  name: Record<string, string> | string
  description?: Record<string, string> | string
  variants: TiendanubeVariant[]
  images: TiendanubeImage[]
}

function textOf(value: Record<string, string> | string | undefined): string {
  if (!value) return ""
  if (typeof value === "string") return value
  return value.es || value.pt || value.en || Object.values(value)[0] || ""
}

async function tiendanubeFetch(url: string, accessToken: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": USER_AGENT,
    },
  })
  return res
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const name = String(data.name || "")
    const email = String(data.email || "")
    const whatsapp = String(data.whatsapp || "")
    const storeUrl = String(data.storeUrl || "")
    const storeId = String(data.storeId || "").trim()
    const accessToken = String(data.accessToken || "").trim()

    if (!name || !email || !whatsapp || !storeUrl || !storeId || !accessToken) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar credenciales contra la tienda antes de traer todo
    const checkRes = await tiendanubeFetch(`${API_BASE}/${storeId}/store`, accessToken)
    if (checkRes.status === 401) {
      return NextResponse.json(
        { error: "El token no es válido o venció. Generá uno nuevo desde tu panel de Tiendanube." },
        { status: 401 }
      )
    }
    if (checkRes.status === 404) {
      return NextResponse.json(
        { error: "No encontramos ninguna tienda con ese ID de tienda. Revisalo e intentá de nuevo." },
        { status: 404 }
      )
    }
    if (!checkRes.ok) {
      return NextResponse.json(
        { error: "Tiendanube no respondió como esperábamos. Probá de nuevo en un rato o usá la opción manual." },
        { status: 502 }
      )
    }

    // Traer todos los productos, paginado
    const products: TiendanubeProduct[] = []
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await tiendanubeFetch(
        `${API_BASE}/${storeId}/products?page=${page}&per_page=${PER_PAGE}&fields=id,name,description,variants,images`,
        accessToken
      )
      if (!res.ok) break
      const batch = (await res.json()) as TiendanubeProduct[]
      if (!Array.isArray(batch) || batch.length === 0) break
      products.push(...batch)
      if (batch.length < PER_PAGE) break
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: "El token es válido pero no encontramos productos para importar. Revisá el permiso de lectura de Productos en la aplicación a medida." },
        { status: 422 }
      )
    }

    const slug = storeUrl
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9.-]+/gi, "-")
      .toLowerCase()
      .substring(0, 60)
    const stamp = new Date().toISOString().replace(/[:.]/g, "-")
    const dir = path.join(process.cwd(), "migraciones-pendientes", `${stamp}_${slug}-auto`)
    const imagesDir = path.join(dir, "fotos")
    await mkdir(imagesDir, { recursive: true })

    // Descargar todas las fotos (no frena la migración si alguna falla)
    let fotosDescargadas = 0
    const catalogo = [] as any[]
    for (const product of products) {
      const imagenesGuardadas: string[] = []
      for (const img of product.images || []) {
        try {
          const imgRes = await fetch(img.src)
          if (!imgRes.ok) continue
          const buffer = Buffer.from(await imgRes.arrayBuffer())
          const ext = path.extname(new URL(img.src).pathname) || ".jpg"
          const filename = `producto-${product.id}-${img.id}${ext}`
          await writeFile(path.join(imagesDir, filename), buffer)
          imagenesGuardadas.push(filename)
          fotosDescargadas++
        } catch {
          // una foto que falla no frena el resto
        }
      }
      catalogo.push({
        id: product.id,
        nombre: textOf(product.name),
        descripcion: textOf(product.description),
        variantes: (product.variants || []).map((v) => ({
          precio: v.price,
          precioPromocional: v.promotional_price,
          stock: v.stock,
          sku: v.sku,
        })),
        fotos: imagenesGuardadas,
      })
    }

    await writeFile(path.join(dir, "catalogo.json"), JSON.stringify(catalogo, null, 2))
    await writeFile(
      path.join(dir, "solicitud.json"),
      JSON.stringify(
        { name, email, whatsapp, storeUrl, storeId, auto: true, productos: products.length, fotos: fotosDescargadas, recibido: new Date().toISOString() },
        null,
        2
      )
    )

    await resend.emails.send({
      from: `tol.ar - Migraciones <ventas@tiendaonline.com.ar>`,
      to: "soporte@tiendaonline.com.ar",
      subject: `[Migración automática Tiendanube] ${name} — ${storeUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Nueva migración automática vía API oficial de Tiendanube</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Tienda actual:</strong> <a href="${storeUrl}">${storeUrl}</a></p>
          <p><strong>Productos importados:</strong> ${products.length}</p>
          <p><strong>Fotos descargadas:</strong> ${fotosDescargadas}</p>
          <p>Catálogo completo y fotos guardados en el servidor en: <code>${dir}</code></p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true, productos: products.length, fotos: fotosDescargadas })
  } catch (err: any) {
    console.error("[migracion-tiendanube/auto] Error:", err)
    return NextResponse.json({ error: "No se pudo procesar la importación automática" }, { status: 500 })
  }
}
