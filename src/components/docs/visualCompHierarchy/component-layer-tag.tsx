"use client"

import type React from "react"
import { cn } from "@/lib/utils"

type LayerType = "Page" | "Container" | "Composite" | "Primitive"

interface ComponentLayerTagProps {
  label: LayerType
  description: string
  children: React.ReactNode
  className?: string
  selectedLayer?: LayerType | null
}

const layerStyles: Record<LayerType, { 
  overlayContainer: string;
  overlayLabel: string;
}> = {
  Page: {
    overlayContainer: "border-purple-400 border-4 rounded-xl bg-purple-400/10",
    overlayLabel: "border-purple-400 rounded-xl text-purple-700 text-sm",
  },
  Container: {
    overlayContainer: "border-blue-400 border-3 rounded-lg bg-blue-400/10",
    overlayLabel: "border-blue-400 rounded-lg text-blue-700 text-sm",
  },
  Composite: {
    overlayContainer: "border-green-400 border-2 rounded-md bg-green-400/10",
    overlayLabel: "border-green-400 rounded-md text-green-700 text-xs",
  },
  Primitive: {
    overlayContainer: "border-orange-400 border rounded-xs bg-orange-400/10 -mx-0.5 py-0.5",
    overlayLabel: "border-orange-400 rounded-xs text-orange-700 text-xs px-1 py-0.5 -top-6",
  },
}

export function ComponentLayerTag({ label, description, children, className, selectedLayer }: ComponentLayerTagProps) {
  const styles = layerStyles[label]
  const isHighlighted = selectedLayer === label
  const showOverlay = selectedLayer !== null && isHighlighted

  return (
    <div className={cn("relative not-prose", className)}>
      {children}

      {showOverlay && (
        <div
          className={cn(
            "overlay-container absolute inset-0 pointer-events-none",
            "animate-in fade-in-0 duration-300",
            styles.overlayContainer,
          )}
        >
          <div
            className={cn(
              "overlay-label absolute -top-7 left-0 px-2 py-1 font-medium whitespace-nowrap",
              "bg-white border shadow-lg",
              styles.overlayLabel,
            )}
          >
            {label}: {description}
          </div>
        </div>
      )}
    </div>
  )
}
