"use client"

import { useState } from "react"
import { PlayCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoTutorialButtonProps {
  title: string
  // ID del video de YouTube (lo que va después de /embed/). Si no se pasa,
  // el botón se muestra apagado como "Próximamente" hasta que se grabe.
  youtubeId?: string
}

export function VideoTutorialButton({ title, youtubeId }: VideoTutorialButtonProps) {
  const [open, setOpen] = useState(false)

  if (!youtubeId) {
    return (
      <div className="flex flex-col items-center gap-1 w-28 shrink-0">
        <span className="text-[11px] text-muted-foreground/50 text-center leading-tight">
          Video: próximamente
        </span>
        <div className="w-full aspect-video rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center">
          <PlayCircle className="h-5 w-5 text-muted-foreground/30" />
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Video tutorial: ${title}`}
        className="flex flex-col items-center gap-1 w-28 shrink-0 group"
      >
        <span className="text-[11px] text-muted-foreground group-hover:text-foreground text-center leading-tight line-clamp-1 transition-colors">
          {title}
        </span>
        <div className="relative w-full aspect-video rounded-md overflow-hidden border group-hover:border-foreground transition-colors">
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
            <PlayCircle className="h-6 w-6 text-white drop-shadow" />
          </div>
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden border">
            {open && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
