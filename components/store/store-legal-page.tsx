"use client"
import { EditableText, useStorePageContent } from "@/components/editable-text"

interface StoreLegalPageProps {
  subdomain: string
  page: string
  titulo: string
  fecha: string
  sections: [string, string, string, string][]
}

export function StoreLegalPage({ subdomain, page, titulo, fecha, sections }: StoreLegalPageProps) {
  const { isAdmin, get } = useStorePageContent(subdomain, page)
  const ET = (field: string, fallback: string) => (
    <EditableText page={page} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} accentColor="#6366f1"
      endpoint="/api/store-page-content" extraBody={{ subdomain }} />
  )

  return (
    <>
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #4338ca, #6366f1)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">{ET("titulo", titulo)}</h1>
          <p className="text-muted-foreground mb-8">{ET("fecha", fecha)}</p>
          <div className="prose prose-slate max-w-none space-y-8">
            {sections.map(([tk, td, bk, bd]) => (
              <section key={tk}>
                <h2 className="text-2xl font-semibold mb-4">{ET(tk, td)}</h2>
                <p className="text-muted-foreground leading-relaxed">{ET(bk, bd)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
