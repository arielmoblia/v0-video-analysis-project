"use client"
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface VideoPopupProps {
  isOpen: boolean
  onClose: () => void
  videoId?: string
  title?: string
}

export function VideoPopup({ isOpen, onClose, videoId, title }: VideoPopupProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const videoUrl = process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_URL || "/videos/facil.mp4"

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-label="Video tutorial">
      <div className="relative w-auto max-w-[95vw] rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors" aria-label="Cerrar video">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="rounded-lg overflow-hidden border bg-black">
          {videoId ? (
            <iframe src={`https://www.youtube.com/embed/${videoId}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full aspect-video" />
          ) : (
            <video ref={videoRef} controls playsInline className="w-full h-auto max-h-[85vh] block" src={videoUrl}>
              Tu navegador no soporta el video.
            </video>
          )}
        </div>
      </div>
    </div>
  )
}