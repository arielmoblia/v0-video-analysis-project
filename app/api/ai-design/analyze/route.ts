import { createClient } from "@supabase/supabase-js"
import { generateObject } from "ai"
import { z } from "zod"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const designSchema = z.object({
  primaryColor: z.string().describe("Color primario en formato hexadecimal"),
  secondaryColor: z.string().describe("Color secundario en formato hexadecimal"),
  accentColor: z.string().describe("Color de acento en formato hexadecimal"),
  backgroundColor: z.string().describe("Color de fondo principal en formato hexadecimal"),
  textColor: z.string().describe("Color de texto principal en formato hexadecimal"),
  fontStyle: z.enum(["modern", "classic", "minimal", "bold", "elegant"]).describe("Estilo de tipografía"),
  designStyle: z.enum(["minimal", "colorful", "dark", "light", "luxury", "playful"]).describe("Estilo general del diseño"),
  borderRadius: z.enum(["none", "small", "medium", "large", "full"]).describe("Redondeo de bordes"),
  description: z.string().describe("Descripción breve del estilo visual del sitio en español")
})

export async function POST(request: Request) {
  try {
    const { url, storeId } = await request.json()

    if (!url || !storeId) {
      return NextResponse.json({ error: "URL y storeId son requeridos" }, { status: 400 })
    }

    // Verificar que la tienda tiene la feature ai_design
    const { data: purchase } = await supabase
      .from("store_feature_purchases")
      .select("*")
      .eq("store_id", storeId)
      .eq("feature_code", "ai_design")
      .single()

    if (!purchase) {
      return NextResponse.json({ 
        error: "Esta función requiere activar 'Diseño con IA' desde + Planes" 
      }, { status: 403 })
    }

    // Capturar screenshot del sitio usando un servicio gratuito
    const screenshotUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${encodeURIComponent(url)}`

    // Analizar con IA
    const { object: design } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: designSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza el diseño visual de este sitio web y extrae su paleta de colores y estilo. 
              
              URL del sitio: ${url}
              
              Necesito que identifiques:
              1. Los colores principales (primario, secundario, acento, fondo, texto)
              2. El estilo de tipografía (moderna, clásica, minimalista, bold, elegante)
              3. El estilo general del diseño
              4. El nivel de redondeo de bordes
              5. Una descripción breve del estilo visual
              
              Basate en la imagen del sitio para hacer tu análisis.`
            },
            {
              type: "image",
              image: screenshotUrl
            }
          ]
        }
      ]
    })

    // Guardar el diseño en la tienda
    const { error: updateError } = await supabase
      .from("stores")
      .update({
        ai_design: design,
        updated_at: new Date().toISOString()
      })
      .eq("id", storeId)

    if (updateError) {
      console.error("Error guardando diseño:", updateError)
      return NextResponse.json({ error: "Error guardando el diseño" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      design,
      message: "Diseño analizado y aplicado correctamente"
    })

  } catch (error) {
    console.error("Error analizando diseño:", error)
    return NextResponse.json({ 
      error: "Error al analizar el sitio. Verificá que la URL sea válida." 
    }, { status: 500 })
  }
}
