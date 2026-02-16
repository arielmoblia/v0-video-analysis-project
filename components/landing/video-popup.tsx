"use client"

import { X } from "lucide-react"

interface VideoPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function VideoPopup({ isOpen, onClose }: VideoPopupProps) {
  if (!isOpen) return null

  // URL del video - solo se evalua cuando el componente se monta
  const videoUrl = process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_URL || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/tutorial-tienda-40dBQDfu3ZHxYDJ4jeRNIgOhWoESqV.mp4"

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Video tutorial"
    >
      <div 
        className="relative w-full max-w-4xl rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
          aria-label="Cerrar video"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-black">
          <video
            controls
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
            src={videoUrl}
          >
            Tu navegador no soporta el video.
          </video>
        </div>
      </div>
    </div>
  )
}
