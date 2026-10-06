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
      <span
        title="Video tutorial: próximamente"
        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground/40 cursor-not-allowed shrink-0"
      >
        <PlayCircle className="h-4 w-4" />
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`Video tutorial: ${title}`}
        className="inline-flex items-center justify-center h-7 w-7 rounded-full border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
      >
        <PlayCircle className="h-4 w-4" />
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
