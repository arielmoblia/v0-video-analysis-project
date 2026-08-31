import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateMetadata() {
  const { data } = await supabase
    .from("seo_pages")
    .select("noindex")
    .eq("id", "diseno-ia")
    .single()

  if (data?.noindex) {
    return { robots: { index: false, follow: false } }
  }
  return {}
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "url": "https://tol.ar/diseno-ia",
      "name": "Diseño de tienda online con IA — tol.ar",
      "description": "Pegá la URL de cualquier sitio que te guste y la IA de tol.ar copia los colores, tipografía y estilo a tu tienda online en segundos. Gratis.",
      "inLanguage": "es-AR"
    },
    {
      "@type": "HowTo",
      "name": "Cómo diseñar tu tienda online con IA en tol.ar",
      "description": "Usá la IA de tol.ar para aplicar el diseño de cualquier sitio web a tu tienda online en 4 pasos simples.",
      "url": "https://tol.ar/diseno-ia",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Elegí un sitio de referencia",
          "text": "Buscá en internet un sitio web cuyo diseño te guste. Puede ser de cualquier rubro."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Pegá la URL",
          "text": "Copiá la dirección del sitio y pegala en el campo de diseño IA de tu panel de administración en tol.ar."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "La IA analiza el diseño",
          "text": "La IA de tol.ar analiza los colores, tipografía y estilo del sitio en 15-20 segundos."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Tu tienda queda transformada",
          "text": "Los estilos se aplican automáticamente a tu tienda. Listo para vender con un diseño profesional."
        }
      ]
    }
  ]
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
