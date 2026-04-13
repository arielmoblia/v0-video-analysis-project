"use client"
import React, { createContext, useContext } from "react"
import {
  DndContext, DragEndEvent, DragOverEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core"
import {
  SortableContext, useSortable,
  verticalListSortingStrategy, rectSortingStrategy, arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const SectionCtx = createContext<any>(null)
const CardCtx = createContext<any>(null)

function DotsIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" style={{ display:"block" }}>
      <circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/>
      <circle cx="3" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/>
      <circle cx="3" cy="11" r="1.5"/><circle cx="7" cy="11" r="1.5"/>
      <circle cx="3" cy="15" r="1.5"/><circle cx="7" cy="15" r="1.5"/>
    </svg>
  )
}

function SectionHandle({ style }: { style?: React.CSSProperties }) {
  const ctx = useContext(SectionCtx)
  if (!ctx) return null
  return (
    <div {...ctx.attributes} {...ctx.listeners}
      style={{ cursor:"grab", display:"flex", alignItems:"center", padding:"4px 6px",
        color:"#bbb", touchAction:"none", userSelect:"none", flexShrink:0, ...style }}>
      <DotsIcon />
    </div>
  )
}

function CardHandle({ style }: { style?: React.CSSProperties }) {
  const ctx = useContext(CardCtx)
  if (!ctx) return null
  return (
    <div {...ctx.attributes} {...ctx.listeners}
      style={{ cursor:"grab", display:"flex", alignItems:"center", padding:"2px",
        color:"#ccc", touchAction:"none", userSelect:"none", ...style }}>
      <DotsIcon />
    </div>
  )
}

function SortableSectionNode({ id, children, style }: { id:string; children:React.ReactNode; style?:React.CSSProperties }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, data: { type:"section" } })
  return (
    <SectionCtx.Provider value={{ attributes, listeners }}>
      <div ref={setNodeRef} style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.6 : 1,
        outline: isDragging ? "2px dashed #d1d5db" : "none",
        borderRadius:"16px", ...style,
      }}>
        {children}
      </div>
    </SectionCtx.Provider>
  )
}

function SortableCardNode({ id, children, style }: { id:string; children:React.ReactNode; style?:React.CSSProperties }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, data: { type:"card" } })
  return (
    <CardCtx.Provider value={{ attributes, listeners }}>
      <div ref={setNodeRef} style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.4 : 1, ...style,
      }}>
        {children}
      </div>
    </CardCtx.Provider>
  )
}

export interface SectionConfig {
  id: string
  cardIds: string[]
}

interface DragDropBoardProps {
  sections: SectionConfig[]
  onSectionsChange: (sections: SectionConfig[]) => void
  renderSectionHeader: (sectionId: string) => React.ReactNode
  renderCard: (cardId: string, sectionId: string) => React.ReactNode
  getCardStyle?: (cardId: string) => React.CSSProperties
  sectionStyle?: React.CSSProperties
  gridColumns?: string
}

export function DragDropBoard({
  sections, onSectionsChange,
  renderSectionHeader, renderCard,
  getCardStyle, sectionStyle = {},
  gridColumns = "repeat(4, 1fr)",
}: DragDropBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance:8 } }))
  const sectionIds = sections.map(s => s.id)

  const cardToSection: Record<string, string> = {}
  sections.forEach(s => s.cardIds.forEach(c => { cardToSection[c] = s.id }))

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || active.data.current?.type === "section") return
    const activeSec = cardToSection[active.id as string]
    const overId = over.id as string
    const overSec = cardToSection[overId] ?? (sectionIds.includes(overId) ? overId : null)
    if (!activeSec || !overSec || activeSec === overSec) return
    onSectionsChange(sections.map(s => {
      if (s.id === activeSec) return { ...s, cardIds: s.cardIds.filter(id => id !== active.id) }
      if (s.id === overSec) {
        const overIdx = s.cardIds.indexOf(overId)
        const cards = [...s.cardIds]
        overIdx >= 0 ? cards.splice(overIdx, 0, active.id as string) : cards.push(active.id as string)
        return { ...s, cardIds: cards }
      }
      return s
    }))
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    if (active.data.current?.type === "section") {
      const oldIdx = sectionIds.indexOf(active.id as string)
      const newIdx = sectionIds.indexOf(over.id as string)
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx)
        onSectionsChange(arrayMove(sections, oldIdx, newIdx))
      return
    }
    const activeSec = cardToSection[active.id as string]
    if (!activeSec) return
    const sec = sections.find(s => s.id === activeSec)
    if (!sec) return
    const oldIdx = sec.cardIds.indexOf(active.id as string)
    const newIdx = sec.cardIds.indexOf(over.id as string)
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx)
      onSectionsChange(sections.map(s =>
        s.id === activeSec ? { ...s, cardIds: arrayMove(s.cardIds, oldIdx, newIdx) } : s
      ))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter}
      onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
        {sections.map(s => (
          <SortableSectionNode key={s.id} id={s.id} style={{ marginBottom:"24px" }}>
            <div style={{ background:"#f8fafc", borderRadius:"16px", padding:"24px", ...sectionStyle }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
                <SectionHandle />
                {renderSectionHeader(s.id)}
              </div>
              <SortableContext items={s.cardIds} strategy={rectSortingStrategy}>
                <div style={{ display:"grid", gridTemplateColumns:gridColumns, gap:"16px" }}>
                  {s.cardIds.map(cardId => (
                    <SortableCardNode key={cardId} id={cardId}
                      style={{ ...getCardStyle?.(cardId), position:"relative" }}>
                      <div style={{ position:"absolute", top:"8px", left:"8px", zIndex:10 }}>
                        <CardHandle />
                      </div>
                      {renderCard(cardId, s.id)}
                    </SortableCardNode>
                  ))}
                </div>
              </SortableContext>
            </div>
          </SortableSectionNode>
        ))}
      </SortableContext>
    </DndContext>
  )
}
