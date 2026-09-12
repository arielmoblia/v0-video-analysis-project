import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeId,
      site_title,
      subdomain,
      email,
      banner_image,
      banner_title,
      banner_subtitle,
      show_products_button,
      top_bar_enabled,
      top_bar_text,
      social_instagram,
      social_facebook,
      social_twitter,
      social_tiktok,
      social_whatsapp,
      whatsapp_marketing_consent,
      footer_subtitle,
      address,
      phone,
      custom_domain,
      linked_store_url,
      linked_store_label,
      active_theme,
      category_images,
      template_texts,
    } = body

    if (!storeId) {
      return NextResponse.json({ error: "Store ID requerido" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // plan_features es un jsonb que ya usan otras cositas (ej. dropshipping);
    // hay que leerlo y mergear para no pisar lo que ya tenga guardado.
    let mergedPlanFeatures: Record<string, any> | undefined
    if (active_theme !== undefined || category_images !== undefined || template_texts !== undefined) {
      const { data: currentStore } = await supabase
        .from("stores")
        .select("plan_features")
        .eq("id", storeId)
        .single()
      const nextPlanFeatures: Record<string, any> = { ...(currentStore?.plan_features || {}) }
      if (active_theme !== undefined) nextPlanFeatures.active_theme = active_theme || null
      if (category_images !== undefined) nextPlanFeatures.category_images = category_images
      if (template_texts !== undefined) nextPlanFeatures.template_texts = template_texts
      mergedPlanFeatures = nextPlanFeatures
    }

    // Validar unicidad de subdominio si cambió
    if (subdomain) {
      const normalized = subdomain.toLowerCase()
      const { data: current } = await supabase
        .from("stores")
        .select("subdomain")
        .eq("id", storeId)
        .single()

      if (current && current.subdomain !== normalized) {
        const { data: existing } = await supabase
          .from("stores")
          .select("id")
          .eq("subdomain", normalized)
          .neq("id", storeId)
          .maybeSingle()

        if (existing) {
          return NextResponse.json(
            { error: "Ya existe ese subdominio, elegí otro", field: "subdomain" },
            { status: 409 }
          )
        }
      }
    }

    const { data, error } = await supabase
      .from("stores")
      .update({
        ...(site_title !== undefined && { site_title }),
        ...(subdomain !== undefined && { subdomain: subdomain.toLowerCase() }),
        ...(email !== undefined && { email }),
        banner_image,
        banner_title,
        banner_subtitle,
        show_products_button,
        top_bar_enabled,
        top_bar_text,
        social_instagram,
        social_facebook,
        social_twitter,
        social_tiktok,
        social_whatsapp,
        ...(whatsapp_marketing_consent !== undefined && { whatsapp_marketing_consent }),
        footer_subtitle,
        address,
        phone,
        ...(custom_domain !== undefined && { custom_domain: custom_domain ? custom_domain.trim().toLowerCase() : null }),
        ...(linked_store_url !== undefined && { linked_store_url: linked_store_url ? linked_store_url.trim() : null }),
        ...(linked_store_label !== undefined && { linked_store_label: linked_store_label ? linked_store_label.trim() : null }),
        ...(mergedPlanFeatures !== undefined && { plan_features: mergedPlanFeatures }),
      })
      .eq("id", storeId)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No se encontró la tienda" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
