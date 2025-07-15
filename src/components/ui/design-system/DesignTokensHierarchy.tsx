"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const tokens = [
  {
    level: "1. Raw Values",
    token: "#FFDF38",
    description: "Core values, ready for use",
    details:
      "These are the most basic, no-frills values. Just the literal hex code or pixel value, without any special meaning yet.",
  },
  {
    level: "2. Semantic Scale",
    token: "yellow-100",
    description: "Also referred to as primitive or base tokens",
    details:
      "These tokens are meant to replace the raw values with semantic scale values which are easier to understand and use.",
    hasDecision: true,
  },
  {
    level: "3. Integration Tokens",
    token: "link-color-default",
    description: "Semantic tokens bringing consistency",
    details:
      "These tokens apply semantic values across contexts to ensure consistency throughout the UI.",
  },
  {
    level: "4. Component-Level Tokens",
    token: "button-bg-primary",
    description: "Building blocks of extensions in the current system",
    details:
      "These tokens define component-specific extensions, allowing for flexible customization of individual UI components.",
  },
]

function AnimatedTokenCard({
  item,
  isLast,
}: {
  item: (typeof tokens)[0]
  isLast: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const lineHeigh = useTransform(scrollYProgress, [0.5, 1], ["0%", "100%"])

  return (
    <motion.div ref={ref} style={{ scale, opacity, y }} className="flex flex-col items-center text-center not-prose">
      <div className="max-w-md w-full">
        <h3 className="text-sm font-bold uppercase tracking-widest">{item.level}</h3>
        <div className="relative mt-2">
          <div className="bg-white dark:bg-gray-700 rounded-full shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(255,223,56,0.2),_0_4px_6px_-2px_rgba(156,163,175,0.3)] px-6 py-3 flex items-center gap-4 w-fit mx-auto">
            <span className="w-5 h-5 rounded-full bg-[#FFDF38]" />
            <span className="font-mono font-semibold text-lg text-gray-800 dark:text-gray-200">{item.token}</span>
          </div>
        </div>
        <p className="mt-4 font-serif italic text-gray-500 dark:text-gray-400">{item.description}</p>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm max-w-xs mx-auto">{item.details}</p>
      </div>
      {!isLast && (
        <motion.div style={{ height: lineHeigh }} className="w-0.5 bg-gray-300 dark:bg-gray-700 mt-12 mb-12" />
      )}
    </motion.div>
  )
}

export function DesignTokensHierarchy() {
  return (
    <div className="w-full max-w-md mx-auto px-4 my-24">
      <div className="flex flex-col items-center ">
        {tokens.map((token, i) => (
          <AnimatedTokenCard key={i} item={token} isLast={i === tokens.length - 1} />
        ))}
      </div>
    </div>
  )
} 