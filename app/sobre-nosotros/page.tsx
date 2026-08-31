import type { Metadata } from "next"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { SeoExtraBlock } from "@/components/seo-extra-block"

export const metadata: Metadata = {
  title: "Sobre Nosotros — tol.ar, la tienda online sin comisiones de Argentina",
  description:
    "Conocé la historia de tol.ar: una plataforma de tiendas online construida completamente con inteligencia artificial, sin empleados, con el objetivo de democratizar el comercio digital en Argentina.",
  openGraph: {
    title: "Sobre Nosotros — tol.ar",
    description:
      "tol.ar es una empresa argentina sin empleados: una plataforma de ecommerce construida y operada con inteligencia artificial.",
    url: "https://tol.ar/sobre-nosotros",
    type: "website",
  },
  alternates: {
    canonical: "https://tol.ar/sobre-nosotros",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://tol.ar/sobre-nosotros",
      name: "Sobre Nosotros — tol.ar",
      url: "https://tol.ar/sobre-nosotros",
      description:
        "Historia y misión de tol.ar: plataforma de tiendas online argentina construida 100% con inteligencia artificial.",
      inLanguage: "es-AR",
      isPartOf: { "@id": "https://tol.ar" },
    },
    {
      "@type": "Organization",
      "@id": "https://tol.ar/#organization",
      name: "tol.ar",
      url: "https://tol.ar",
      logo: "https://tol.ar/tol-logo.png",
      foundingDate: "2024",
      foundingLocation: {
        "@type": "Place",
        addressCountry: "AR",
        addressLocality: "Buenos Aires",
      },
      description:
        "tol.ar es la plataforma argentina que permite crear tiendas online gratis, sin comisiones por venta. Construida y operada completamente con inteligencia artificial.",
      sameAs: [
        "https://www.instagram.com/tol.ar",
        "https://twitter.com/tolar_ar",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "soporte@tiendaonline.com.ar",
        contactType: "customer support",
        availableLanguage: "Spanish",
      },
    },
  ],
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)",
            color: "white",
            padding: "80px 20px 60px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "30px",
                padding: "6px 18px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                marginBottom: "20px",
              }}
            >
              🇦🇷 Empresa argentina
            </div>
            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              Una plataforma de ecommerce
              <br />
              construida con IA
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                opacity: 0.9,
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              tol.ar nació con una idea simple: que cualquier persona en Argentina pueda vender online, sin pagar comisiones y sin necesitar saber de tecnología.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "60px 20px" }}>

          {/* Historia */}
          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "16px", color: "#1e1b4b" }}>
              Cómo nació tol.ar
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151", marginBottom: "16px" }}>
              tol.ar empezó como una pregunta: ¿por qué en Argentina hay que pagar comisión por cada venta para poder tener una tienda online? La mayoría de las principales plataformas — las argentinas, las internacionales, los marketplaces — cobra un porcentaje de cada venta. Para un emprendedor que recién empieza, eso es una barrera enorme.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151", marginBottom: "16px" }}>
              La respuesta fue tol.ar: una plataforma donde podés crear tu tienda online gratis, sin comisiones por venta, con tu propio dominio y con herramientas de diseño intuitivas.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151" }}>
              Lo que hace diferente a tol.ar no es solo el modelo de negocio. Es cómo fue construida.
            </p>
          </section>

          {/* IA */}
          <section
            style={{
              background: "linear-gradient(135deg, #f0f0ff 0%, #ede9fe 100%)",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "56px",
              border: "1px solid #c7d2fe",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
              <div
                style={{
                  fontSize: "3rem",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "14px", color: "#3730a3" }}>
                  Una empresa sin empleados
                </h2>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#4b5563", marginBottom: "14px" }}>
                  tol.ar es probablemente la primera empresa de ecommerce en Argentina construida y operada <strong>100% con inteligencia artificial</strong>. No tenemos empleados. El código fue escrito por IA. El diseño fue creado por IA. El soporte al cliente es manejado por IA.
                </p>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#4b5563", marginBottom: "14px" }}>
                  Esto no es un experimento — es el modelo. Al no tener estructura de empleados, podemos mantener los precios bajos (o directamente gratis) y enfocarnos en lo que importa: que vos puedas vender más.
                </p>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#4b5563" }}>
                  La IA no reemplaza a un equipo humano en tol.ar — <em>es</em> el equipo. Y eso nos permite iterar más rápido, disponibles las 24 horas, sin los costos que encarecen otras plataformas.
                </p>
              </div>
            </div>
          </section>

          {/* Misión */}
          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "16px", color: "#1e1b4b" }}>
              Nuestra misión
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151", marginBottom: "16px" }}>
              Democratizar el comercio digital en Argentina. Que una mamá que vende ropa en Tucumán tenga las mismas herramientas que una marca grande de Buenos Aires. Que una pequeña empresa de Mendoza pueda competir online sin que cada venta le cueste una comisión.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#374151" }}>
              tol.ar no cobra comisión por venta. El 100% de cada transacción es tuyo.
            </p>
          </section>

          {/* Valores / Cards */}
          <section style={{ marginBottom: "56px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "28px", color: "#1e1b4b" }}>
              Lo que nos define
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                {
                  icon: "🚫💸",
                  titulo: "Sin comisiones",
                  texto: "Nunca cobramos un porcentaje de tus ventas. Lo que vendés, lo ganás vos.",
                },
                {
                  icon: "🤖",
                  titulo: "IA nativa",
                  texto: "Plataforma construida con IA: el diseño, el código, la atención — todo automatizado.",
                },
                {
                  icon: "⚡",
                  titulo: "Simple de usar",
                  texto: "Tu tienda lista en minutos, sin saber de programación ni diseño.",
                },
                {
                  icon: "🇦🇷",
                  titulo: "Hecha en Argentina",
                  texto: "Pagos con MercadoPago y Stripe, envíos con Andreani, facturación local.",
                },
              ].map((v) => (
                <div
                  key={v.titulo}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "28px 24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{v.icon}</div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px", color: "#1f2937" }}>
                    {v.titulo}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.6 }}>{v.texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section
            style={{
              background: "#1e1b4b",
              color: "white",
              borderRadius: "20px",
              padding: "40px",
              marginBottom: "56px",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "32px" }}>
              tol.ar en números
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "24px",
              }}
            >
              {[
                { num: "0%", label: "Comisión por venta" },
                { num: "100%", label: "Operado con IA" },
                { num: "24/7", label: "Disponibilidad" },
                { num: "Argentina", label: "Origen" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#818cf8", marginBottom: "6px" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.75 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "14px", color: "#1e1b4b" }}>
              ¿Querés abrir tu tienda?
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#6b7280", marginBottom: "28px" }}>
              Es gratis, sin comisiones y se crea en minutos.
            </p>
            <a
              href="/registro"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #4338ca, #6366f1)",
                color: "white",
                padding: "16px 40px",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1.05rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              }}
            >
              Crear mi tienda gratis
            </a>
          </section>

        </div>
      </main>

      <SeoExtraBlock page="sobre-nosotros" />
      <Footer />
    </div>
  )
}
