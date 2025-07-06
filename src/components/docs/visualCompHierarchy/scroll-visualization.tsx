"use client"

import { useRef, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { DemoDashboard } from "./demo-dashboard"
import { LayerLegend } from "./layer-legend"

type LayerType = "Page" | "Container" | "Composite" | "Primitive"

const layers: LayerType[] = ["Page", "Container", "Composite", "Primitive"]

export function ScrollVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLayer, setSelectedLayer] = useState<LayerType | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Update state when scroll progress changes
  scrollYProgress.on("change", (progress) => {
    setScrollProgress(progress)

    // Map progress to layer selection with better timing
    if (progress <= 0.1) {
      setSelectedLayer(null)
    } else if (progress <= 0.35) {
      setSelectedLayer("Page")
    } else if (progress <= 0.65) {
      setSelectedLayer("Container")
    } else if (progress <= 0.85) {
      setSelectedLayer("Composite")
    } else {
      setSelectedLayer("Primitive")
    }
  })

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky visualization container */}
      <motion.div
        className="sticky top-0 z-40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LayerLegend selectedLayer={selectedLayer} scrollProgress={scrollProgress} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DemoDashboard selectedLayer={selectedLayer} />
        </motion.div>
      </motion.div>

      {/* Scroll spacer with visual feedback - increased height to maintain stickiness */}
      <div className="h-[250vh] relative">
        {/* Visual scroll indicators */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-4">
          {layers.map((layer, index) => (
            <motion.div
              key={layer}
              className="w-2 h-12 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="w-full rounded-full"
                style={{
                  backgroundColor: layer === "Page"
                    ? "hsl(280, 100%, 70%)"
                    : layer === "Container"
                      ? "hsl(210, 100%, 70%)"
                      : layer === "Composite"
                        ? "hsl(140, 100%, 70%)"
                        : "hsl(30, 100%, 70%)",
                  height: `${Math.max(0, Math.min(100, (scrollProgress - index * 0.2) * 5 * 100))}%`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating layer indicators - adjusted positioning */}
        <motion.div
          className="absolute left-8 top-1/4 transform -translate-y-1/2"
          style={{
            y: `${scrollProgress * -200}px`,
          }}
        >
          {layers.map((layer, index) => (
            <motion.div
              key={layer}
              className="mb-6 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border"
              style={{
                opacity: Math.max(0, Math.min(1, (scrollProgress - index * 0.2) * 5)),
                scale: Math.max(0.8, Math.min(1, (scrollProgress - index * 0.2) * 5)),
              }}
            >
              <div
                className="w-4 h-4 rounded mb-2"
                style={{
                  backgroundColor: layer === "Page"
                    ? "hsl(280, 100%, 70%)"
                    : layer === "Container"
                      ? "hsl(210, 100%, 70%)"
                      : layer === "Composite"
                        ? "hsl(140, 100%, 70%)"
                        : "hsl(30, 100%, 70%)",
                }}
              />
              <div className="font-semibold text-sm">{layer}</div>
              <div className="text-xs text-gray-600">
                {layer === "Page" && "Routes & Layouts"}
                {layer === "Container" && "Data & State"}
                {layer === "Composite" && "Business Components"}
                {layer === "Primitive" && "UI Components"}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
