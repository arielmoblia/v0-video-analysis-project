"use client"
import { useState, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EditableText, usePageContent } from "@/components/editable-text"

const SignupModal = lazy(() => import("@/components/landing/signup-modal").then(m => ({ default: m.SignupModal })))
const VideoPopup = dynamic(() => import("@/components/landing/video-popup").then(m => ({ default: m.VideoPopup })), { ssr: false, loading: () => null })

interface HeroProps {
  brand?: "tol" | "tiendabasica"
}

export function Hero({ brand = "tol" }: HeroProps) {
  const isTiendaBasica = brand === "tiendabasica"
  const pageKey = isTiendaBasica ? "home-tiendabasica" : "home"
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { isAdmin, get } = usePageContent(pageKey)
  const ET = (field: string, fallback: string, tag = "span", className = "") => (
    <EditableText page={pageKey} field={field} defaultValue={get(field, fallback)} isAdmin={isAdmin} tag={tag} className={className} accentColor="#f59e0b" />
  )

  return (
    <section className="flex-1 overflow-hidden">
      {isAdmin && (
        <div style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)", color: "white", padding: "8px 20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>MODO EDICIÓN</span>
          Pasá el mouse sobre los textos para editarlos
        </div>
      )}
      <div className="container mx-auto flex items-center min-h-[650px]">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.gtag) {
              window.gtag("event", "click_ver_video", { event_category: "home", event_label: "hero_video_button" })
            }
            setIsVideoOpen(true)
          }}
          className="hidden md:flex flex-shrink-0 w-[600px] lg:w-[750px] h-[600px] lg:h-[700px] relative mr-[-120px] self-end cursor-pointer hover:scale-105 transition-transform duration-300"
          type="button"
          aria-label="Ver video tutorial de como crear tu tienda"
        >
          <Image
            src="/images/heroes/hero-woman-video.png"
            alt={isTiendaBasica ? "Ver video tutorial - Cómo hacer tu tienda" : "Ver video tutorial - Cómo hacer una tienda en tol.ar"}
            fill
            className="object-contain object-bottom"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 600px, 750px"
            fetchPriority="high"
          />
        </button>
        <div className="flex-1 text-center pb-8 pt-8 ml-0 md:ml-[40px]">
          <h1 className="text-4xl md:text-5xl mb-2 text-balance">
            <span className="font-bold">
              {isTiendaBasica
                ? ET("hero_h1", "Creá tu Tienda Online Gratis y Sin Comisiones")
                : ET("hero_h1", "Creá tu Tienda Online Gratis y Sin Comisiones en Argentina")}
            </span>
            <span className="block text-xl md:text-2xl font-semibold mt-2">
              {isTiendaBasica ? ET("hero_subtitulo", "en 2 minutos") : ET("hero_subtitulo", "con tol.ar en 2 minutos")}
            </span>
          </h1>
          <p className="text-muted-foreground mb-5 text-base max-w-md mx-auto">
            {isTiendaBasica
              ? ET("hero_desc", "La plataforma más fácil para vender por internet. Sin conocimientos técnicos.")
              : ET("hero_desc", "La plataforma más fácil para vender por internet en Argentina. Sin conocimientos técnicos. Con MercadoPago integrado.")}
          </p>
          <Button
            size="lg"
            className={isTiendaBasica
              ? "bg-black hover:bg-black text-white px-8 py-5 text-base rounded-full"
              : "bg-green-600 hover:bg-green-600 text-white px-8 py-5 text-base rounded-full"}
            onClick={() => setIsModalOpen(true)}
            aria-label="Crear tu tienda online gratis ahora"
          >
            {ET("hero_boton", "hacer tu tienda ya")}
          </Button>
        </div>
      </div>
      <VideoPopup isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      {isModalOpen && (
        <Suspense fallback={null}>
          <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </section>
  )
}
