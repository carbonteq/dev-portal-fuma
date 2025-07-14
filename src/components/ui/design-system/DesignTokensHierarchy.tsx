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
    description: "Essential design elements",
    details:
      "Here, we start giving meaning to those raw values. We turn #FFDF38 into something more understandable, like yellow-100.",
    hasDecision: true,
  },
  {
    level: "3. Integration Tokens",
    token: "link-color-default",
    description: "Basic tokens, ready for context",
    details:
      "This layer is where we make decisions about our visual language. We map our semantic scale values to specific contexts, like making 'yellow-100' our default link color.",
  },
  {
    level: "4. Component-Level Tokens",
    token: "button-bg-primary",
    description: "The building blocks of our design system",
    details:
      "This is the most specific level, where we define the design details for individual components. These are the precise controls you can tweak for each component.",
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
    <motion.div ref={ref} style={{ scale, opacity, y }} className="flex flex-col items-center text-center">
      <div className="max-w-md w-full">
        <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-500">{item.level}</h3>
        <div className="relative mt-4">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),_0_4px_6px_-2px_rgba(0,0,0,0.1)] px-6 py-3 flex items-center gap-4 w-fit mx-auto">
            <span className="w-5 h-5 rounded-full bg-[#FFDF38]" />
            <span className="font-mono font-semibold text-lg text-gray-800 dark:text-gray-200">{item.token}</span>
          </div>
          {item.hasDecision && (
            <motion.div
              className="absolute -right-4 sm:-right-12 top-0 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
            >
              <span className="text-2xl transform -scale-x-100">👉</span>
              <p className="font-serif italic text-gray-600 dark:text-gray-300 text-sm">Our decisions</p>
            </motion.div>
          )}
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
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex flex-col items-center">
        {tokens.map((token, i) => (
          <AnimatedTokenCard key={i} item={token} isLast={i === tokens.length - 1} />
        ))}
      </div>
    </div>
  )
} 