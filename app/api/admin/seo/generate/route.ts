import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"

export async function POST(request: NextRequest) {
  const { storeId, storeName, subdomain, field } = await request.json()
  
  if (!storeId || !storeName) {
    return NextResponse.json({ error: "Datos requeridos" }, { status: 400 })
  }

  const supabase = await createClient()
  
  // Obtener info de la tienda y productos para contexto
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single()

  const { data: products } = await supabase
    .from("products")
    .select("name, description, category:categories(name)")
    .eq("store_id", storeId)
    .eq("is_active", true)
    .limit(20)

  const { data: categories } = await supabase
    .from("categories")
    .select("name")
    .eq("store_id", storeId)
    .limit(10)

  // Construir contexto
  const productNames = products?.map(p => p.name).join(", ") || ""
  const categoryNames = categories?.map(c => c.name).join(", ") || ""
  
  const context = `
Tienda: ${storeName}
URL: ${subdomain}.tol.ar
Descripción actual: ${store?.description || "Tienda online"}
Categorías: ${categoryNames || "Productos varios"}
Productos destacados: ${productNames || "Varios productos"}
  `.trim()

  let prompt = ""
  
  if (field === "title" || field === "all") {
    prompt += `
Generá un título SEO optimizado para esta tienda online.
- Máximo 60 caracteres
- Incluí la palabra clave principal
- Debe ser atractivo para hacer click
- Formato: [Producto/Categoría principal] | [Nombre tienda] o similar

${context}

Respondé SOLO con el título, sin explicaciones.
`
  }

  if (field === "description" || field === "all") {
    prompt += `
Generá una meta descripción SEO para esta tienda.
- Entre 150-160 caracteres
- Incluí un call-to-action (Comprá, Descubrí, Encontrá)
- Mencioná beneficios si es posible (envío gratis, cuotas, etc.)
- Debe ser persuasiva y generar clicks

${context}

Respondé SOLO con la descripción, sin explicaciones.
`
  }

  if (field === "keywords" || field === "all") {
    prompt += `
Generá una lista de 10 palabras clave SEO relevantes para esta tienda.
- Incluí keywords de cola larga (3-4 palabras)
- Incluí variaciones y sinónimos
- Pensá en qué buscaría un cliente
- Separalas por comas

${context}

Respondé SOLO con las keywords separadas por comas, sin explicaciones ni números.
`
  }

  try {
    const { text } = await generateText({
      model: gateway("anthropic/claude-sonnet-4"),
      prompt: prompt,
      maxTokens: 500,
    })

    // Parsear respuesta según el campo
    const lines = text.split("\n").filter(l => l.trim())
    
    const result: Record<string, string> = {}
    
    if (field === "all") {
      // Intentar extraer cada parte
      if (lines[0]) result.title = lines[0].trim().slice(0, 60)
      if (lines[1]) result.description = lines[1].trim().slice(0, 160)
      if (lines[2]) result.keywords = lines[2].trim()
    } else {
      result[field] = text.trim()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generando SEO con IA:", error)
    
    // Fallback con sugerencias genéricas basadas en el nombre
    const fallback: Record<string, string> = {}
    
    if (field === "title" || field === "all") {
      fallback.title = `${storeName} | Tienda Online - Los Mejores Productos`
    }
    if (field === "description" || field === "all") {
      fallback.description = `Descubrí los mejores productos en ${storeName}. Comprá online con envío a todo el país. ¡Visitá nuestra tienda ahora!`
    }
    if (field === "keywords" || field === "all") {
      fallback.keywords = `${storeName.toLowerCase()}, comprar online, tienda online, productos, ofertas, envío gratis`
    }
    
    return NextResponse.json(fallback)
  }
}
