"use client"

import { useState, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Cargar SignupModal solo cuando se necesita
const SignupModal = lazy(() => import("@/components/landing/signup-modal").then(m => ({ default: m.SignupModal })))

// Video popup cargado dinamicamente - NO se incluye en el bundle inicial ni en el HTML del servidor
const VideoPopup = dynamic(() => import("@/components/landing/video-popup").then(m => ({ default: m.VideoPopup })), {
  ssr: false,
  loading: () => null
})

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="flex-1 overflow-hidden">
      <div className="container mx-auto flex items-center min-h-[650px]">
        {/* Contenedor izquierdo - Imagen clickeable para video */}
        <button
          onClick={() => setIsVideoOpen(true)}
          className="hidden md:flex flex-shrink-0 w-[600px] lg:w-[750px] h-[600px] lg:h-[700px] relative mr-[-120px] self-end cursor-pointer hover:scale-105 transition-transform duration-300"
          type="button"
          aria-label="Ver video tutorial de como crear tu tienda"
        >
          <Image
            src="/images/heroes/hero-woman-video.png"
            alt="Ver video tutorial - Cómo hacer una tienda en tol.ar"
            fill
            className="object-contain object-bottom"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 600px, 750px"
            fetchPriority="high"
          />
        </button>

        {/* Contenedor derecho - Contenido */}
        <div className="flex-1 text-center pb-8 pt-8 ml-0 md:ml-[40px]">
          <h1 className="text-4xl md:text-5xl mb-2 text-balance">
            <span className="font-bold">Crea tu Tienda Online Gratis en Argentina</span>
            <span className="block text-xl md:text-2xl font-semibold mt-2">
              con <span className="font-bold">tol</span><span className="font-normal text-gray-400">.ar</span> en solo 2 minutos
            </span>
          </h1>
          <p className="text-muted-foreground mb-5 text-base max-w-md mx-auto">
            La plataforma mas facil para vender por internet en Argentina. 
            Sin conocimientos tecnicos. Con MercadoPago integrado.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 text-base rounded-full"
            onClick={() => setIsModalOpen(true)}
            aria-label="Crear tu tienda online gratis ahora"
          >
            hacer tu tienda ya
          </Button>
        </div>
      </div>

      {/* Video Popup - Cargado dinamicamente, NO esta en el HTML inicial */}
      <VideoPopup isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

      {/* Modal cargado de forma diferida */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </section>
  )
}
