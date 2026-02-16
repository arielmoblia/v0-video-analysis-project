import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import TemplatesPage from "@/app/templates/page"

export default function ArielmobiliaTemplates() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="bg-amber-500 text-black text-center py-2 text-sm font-medium">
        MODO DESARROLLO - Esta es la version completa
      </div>
      <Header fullMenu={true} basePath="/arielmobilia" />
      <div className="flex-1">
        <TemplatesPage />
      </div>
      <Footer />
    </main>
  )
}
