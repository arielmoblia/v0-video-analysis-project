import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generatePassword } from "@/lib/utils/generate-password"

// Mapeo de template seleccionado -> subdomain de tienda template a clonar
const TEMPLATE_MAPPING: Record<string, string> = {
  "cosmetics": "perfumes",     // Cosmeticos -> clona de perfumes
  "clothing": "ropa",          // Ropa -> clona de ropa
  "footwear": "zapatos",       // Calzado -> clona de zapatos
  "electronics": "electronicos", // Electronicos -> clona de electronicos
  "default": "base"            // Fallback -> clona de base
}

const TEMPLATE_SUBDOMAIN = TEMPLATE_MAPPING["default"] // Declare TEMPLATE_SUBDOMAIN variable

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, subdomain, siteTitle, allowIndexing, template } = body

    // Validate required fields
    if (!username || !email || !subdomain || !siteTitle || !template) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }
    
    // Determinar que tienda template clonar segun la seleccion del usuario
    const templateSubdomain = TEMPLATE_MAPPING[template] || TEMPLATE_SUBDOMAIN
    console.log(`[v0] Creando tienda con template: ${template} -> clonando de: ${templateSubdomain}`)

    // Validate username (min 4 chars, alphanumeric)
    if (username.length < 4 || !/^[a-zA-Z0-9]+$/.test(username)) {
      return NextResponse.json(
        { error: "El nombre de usuario debe tener al menos 4 caracteres y solo letras/números" },
        { status: 400 },
      )
    }

    // Validate subdomain (min 4 chars, alphanumeric)
    if (subdomain.length < 4 || !/^[a-zA-Z0-9]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "El subdominio debe tener al menos 4 caracteres y solo letras/números" },
        { status: 400 },
      )
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if subdomain already exists
    const { data: existingSubdomain } = await supabase
      .from("stores")
      .select("id")
      .eq("subdomain", subdomain.toLowerCase())
      .single()

    if (existingSubdomain) {
      return NextResponse.json({ error: "El subdominio ya está en uso" }, { status: 400 })
    }

const { data: templateStore } = await supabase
      .from("stores")
      .select("*")
      .eq("subdomain", templateSubdomain)
      .single()

    // Generate admin password
    const adminPassword = generatePassword(12)

    const subdomainLower = subdomain.toLowerCase()
    const storeUrl = `https://${subdomainLower}.tol.ar/`
    const adminUrl = `https://${subdomainLower}.tol.ar/admin`

    // Calcular fecha de expiracion del trial (7 dias)
    const trialExpiresAt = new Date()
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 7)

    const storeData: any = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      subdomain: subdomainLower,
      site_title: siteTitle,
      allow_indexing: allowIndexing === "yes",
      template,
      admin_password: adminPassword,
      store_url: storeUrl,
      admin_url: adminUrl,
      // Campos de trial
      is_trial: true,
      trial_expires_at: trialExpiresAt.toISOString(),
      last_activity_at: new Date().toISOString(),
      warning_emails_sent: 0,
    }

    // Clone banner and customization settings from template if available
    if (templateStore) {
      storeData.banner_image = templateStore.banner_image
      storeData.banner_title = templateStore.banner_title
      storeData.banner_subtitle = templateStore.banner_subtitle
      storeData.top_bar_text = templateStore.top_bar_text
      storeData.top_bar_enabled = templateStore.top_bar_enabled
      storeData.footer_subtitle = templateStore.footer_subtitle
    }

    // Insert store into database
    const { data: store, error: insertError } = await supabase.from("stores").insert(storeData).select().single()

    if (insertError) {
      console.error("Error inserting store:", insertError)
      return NextResponse.json({ error: "Error al crear la tienda: " + insertError.message }, { status: 500 })
    }

    if (templateStore) {
      const { data: templateCategories } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", templateStore.id)

      if (templateCategories && templateCategories.length > 0) {
        const newCategories = templateCategories.map((cat: any) => ({
          store_id: store.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        }))

        await supabase.from("categories").insert(newCategories)
      }

      // Get new categories mapping (old id -> new id)
      const { data: newCategoriesData } = await supabase.from("categories").select("*").eq("store_id", store.id)

      const categoryMap: Record<string, string> = {}
      if (templateCategories && newCategoriesData) {
        templateCategories.forEach((oldCat: any, index: number) => {
          if (newCategoriesData[index]) {
            categoryMap[oldCat.id] = newCategoriesData[index].id
          }
        })
      }

      const { data: templateProducts } = await supabase.from("products").select("*").eq("store_id", templateStore.id)

      if (templateProducts && templateProducts.length > 0) {
        const newProducts = templateProducts.map((prod: any) => ({
          store_id: store.id,
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          image_url: prod.image_url,
          category_id: prod.category_id ? categoryMap[prod.category_id] || null : null,
          sizes: prod.sizes,
          active: prod.active,
        }))

        await supabase.from("products").insert(newProducts)
      }

      const { data: templatePayments } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("store_id", templateStore.id)
        .single()

      if (templatePayments) {
        await supabase.from("payment_methods").insert({
          store_id: store.id,
          cash_enabled: templatePayments.cash_enabled,
          cash_instructions: templatePayments.cash_instructions,
          card_enabled: templatePayments.card_enabled,
          card_instructions: templatePayments.card_instructions,
          transfer_enabled: templatePayments.transfer_enabled,
          // No copiar datos bancarios (son personales)
          mercadopago_enabled: false, // Desactivar hasta que configure sus credenciales
          modo_enabled: false,
          uala_enabled: false,
          rapipago_enabled: templatePayments.rapipago_enabled,
          rapipago_instructions: templatePayments.rapipago_instructions,
        })
      }

      const { data: templateShipping } = await supabase
        .from("shipping_methods")
        .select("*")
        .eq("store_id", templateStore.id)
        .single()

      if (templateShipping) {
        await supabase.from("shipping_methods").insert({
          store_id: store.id,
          pickup_enabled: templateShipping.pickup_enabled,
          pickup_address: null, // No copiar dirección (es personal)
          pickup_hours: templateShipping.pickup_hours,
          pickup_instructions: templateShipping.pickup_instructions,
          own_delivery_enabled: templateShipping.own_delivery_enabled,
          own_delivery_cost: templateShipping.own_delivery_cost,
          own_delivery_zones: null, // No copiar zonas (son personales)
          own_delivery_time: templateShipping.own_delivery_time,
          own_delivery_instructions: templateShipping.own_delivery_instructions,
          delivery_enabled: templateShipping.delivery_enabled,
          // No copiar tokens de empresas de envío
          enviamelo_enabled: false,
          andreani_enabled: false,
          oca_enabled: false,
          correo_enabled: false,
        })
      }
    }

    let emailSent = false
    const resendApiKey = process.env.RESEND_API_KEY || process.env.RESENDAPIKEY
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)

        const trialExpireDate = trialExpiresAt.toLocaleDateString('es-AR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })

        await resend.emails.send({
          from: "TOL.AR <ventas@tiendaonline.com.ar>",
          to: email,
          bcc: "hola@tiendaonline.com.ar",
          subject: `Tu tienda ${siteTitle} esta lista en TOL.AR - Tenes 7 dias para configurarla`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #8b5cf6;">Tu tienda online esta creada!</h1>
              
              <p>Hola ${username},</p>
              
              <!-- ADVERTENCIA EN ROJO -->
              <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0;">IMPORTANTE: Tenes 7 dias para configurar tu tienda</h3>
                <p style="color: #dc2626; margin: 0; font-weight: bold;">
                  Las tiendas que no tengan actividad en 7 dias seran ELIMINADAS automaticamente 
                  para dar lugar a otras empresas que realmente esten interesadas en tener su tienda online.
                </p>
                <p style="color: #991b1b; margin: 10px 0 0 0;">
                  <strong>Fecha limite: ${trialExpireDate}</strong>
                </p>
                <p style="color: #7f1d1d; margin: 10px 0 0 0; font-size: 13px;">
                  Recibiras recordatorios diarios para que no te olvides de trabajar en tu tienda.
                </p>
              </div>
              
              <p>Tu tienda viene con <strong>productos de ejemplo</strong> para que veas como se ve. Podes editarlos o eliminarlos desde el panel de administracion.</p>
              
              <h2>Tu tienda esta lista:</h2>
              <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">
                <a href="${storeUrl}" style="color: #8b5cf6; font-weight: bold;">${storeUrl}</a>
              </p>
              
              <h2>Podes administrar tu tienda en:</h2>
              <p style="background: #f3f4f6; padding: 10px; border-radius: 5px;">
                <a href="${adminUrl}" style="color: #8b5cf6; font-weight: bold;">${adminUrl}</a>
              </p>
              
              <h2>Tus credenciales de acceso:</h2>
              <ul style="background: #f3f4f6; padding: 15px 30px; border-radius: 5px;">
                <li><strong>Usuario:</strong> ${username.toLowerCase()}</li>
                <li><strong>Contraseña:</strong> ${adminPassword}</li>
              </ul>
              
              <h2>Proximos pasos (hacelos antes del ${trialExpireDate}):</h2>
              <ol>
                <li>Entra al panel de administracion</li>
                <li>Edita o elimina los productos de ejemplo</li>
                <li>Agrega tus propios productos</li>
                <li>Configura Mercado Pago en la seccion Pagos</li>
                <li>Configura tus metodos de envio</li>
              </ol>
              
              <p>Esperamos que disfrutes tu nueva tienda!</p>
              
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                Powered by TOL.AR - Tu tienda online facil
              </p>
            </div>
          `,
        })
        emailSent = true
      } catch (emailError) {
        console.error("Error sending email:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      store: {
        id: store.id,
        username: username.toLowerCase(),
        subdomain: store.subdomain,
        siteTitle: store.site_title,
        storeUrl,
        adminUrl,
        adminPassword,
      },
    })
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
