"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type LayerType = "Page" | "Container" | "Composite" | "Primitive"

interface LayerLegendProps {
  selectedLayer: LayerType | null
  scrollProgress: number
}

const layerInfo: Record<LayerType, { color: string; bgColor: string; description: string }> = {
  Page: {
    color: "hsl(280, 100%, 70%)",
    bgColor: "hsl(280, 100%, 95%)",
    description: "Routes & Layouts",
  },
  Container: {
    color: "hsl(210, 100%, 70%)",
    bgColor: "hsl(210, 100%, 95%)",
    description: "Data & State",
  },
  Composite: {
    color: "hsl(140, 100%, 70%)",
    bgColor: "hsl(140, 100%, 95%)",
    description: "Business Components",
  },
  Primitive: {
    color: "hsl(30, 100%, 70%)",
    bgColor: "hsl(30, 100%, 95%)",
    description: "UI Components",
  },
}

export function LayerLegend({ selectedLayer, scrollProgress }: LayerLegendProps) {
  return (
    <div className="bg-fd-background border-b border-fd-border p-6 not-prose">
      <div className="max-w-6xl mx-auto space-y-4">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-base font-semibold text-fd-foreground">Component Hierarchy</h3>
          <div className="flex items-center gap-6">
            {(Object.keys(layerInfo) as LayerType[]).map((layer, index) => {
              const info = layerInfo[layer]
              const isSelected = selectedLayer === layer

              return (
                <motion.div
                  key={layer}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isSelected ? 1.05 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: isSelected ? info.color : info.bgColor,
                      borderColor: info.color,
                    }}
                    animate={{
                      scale: isSelected ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="flex flex-col">
                    <span 
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isSelected ? "text-fd-foreground" : "text-fd-muted-foreground"
                      )}
                    >
                      {layer}
                    </span>
                    <span className="text-xs text-fd-muted-foreground">
                      {info.description}
                    </span>
                  </div>
                  {index < Object.keys(layerInfo).length - 1 && (
                    <span className="text-fd-muted-foreground text-lg mx-2">→</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-sm text-fd-muted-foreground">Scroll Progress:</span>
          <div className="flex-1 bg-fd-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${layerInfo.Page.color}, ${layerInfo.Container.color}, ${layerInfo.Composite.color}, ${layerInfo.Primitive.color})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-fd-muted-foreground min-w-[3ch] tabular-nums">
            {Math.round(scrollProgress * 100)}%
          </span>
        </motion.div>
      </div>
    </div>
  )
}
