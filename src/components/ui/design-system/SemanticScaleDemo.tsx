"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

// A subset of Tailwind's default typography scale
const tailwindTypographyScale = {
  xs: { rem: 0.75, px: 12 },
  sm: { rem: 0.875, px: 14 },
  base: { rem: 1, px: 16 },
  lg: { rem: 1.125, px: 18 },
  xl: { rem: 1.25, px: 20 },
  "2xl": { rem: 1.5, px: 24 },
  "3xl": { rem: 1.875, px: 30 },
  "4xl": { rem: 2.25, px: 36 },
  "5xl": { rem: 3, px: 48 },
}

const scaleKeys = Object.keys(tailwindTypographyScale)
const scaleValues = Object.values(tailwindTypographyScale)

export function SemanticScaleDemo() {
  const [arbitraryFontSize1, setArbitraryFontSize1] = useState(18) // in px
  const [arbitraryFontSize2, setArbitraryFontSize2] = useState(22) // in px

  const [scaleIndex, setScaleIndex] = useState(scaleKeys.indexOf("lg")) // Corresponds to 'lg' -> 18px

  const handleScaleChange = (newIndex: number[]) => {
    setScaleIndex(newIndex[0])
  }

  const currentScaleKey = scaleKeys[scaleIndex]
  const currentScalePx = scaleValues[scaleIndex].px

  return (
    <div className="w-full bg-background text-foreground my-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Column 1: The Problem with Arbitrary Numbers */}
          <Card className="min-h-[550px]">
            <CardHeader>
              <CardTitle>The Problem: Arbitrary Font Sizes</CardTitle>
              <CardDescription>
                Using random pixel values for text breaks visual hierarchy and rhythm. Can you make these two headings
                feel like they belong together?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    Heading 1 Font Size: <span className="font-mono">{arbitraryFontSize1}px</span>
                  </label>
                  <Slider
                    defaultValue={[arbitraryFontSize1]}
                    max={50}
                    min={12}
                    step={1}
                    onValueChange={(value: number[]) => setArbitraryFontSize1(value[0])}
                    className="my-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Heading 2 Font Size: <span className="font-mono">{arbitraryFontSize2}px</span>
                  </label>
                  <Slider
                    defaultValue={[arbitraryFontSize2]}
                    max={50}
                    min={12}
                    step={1}
                    onValueChange={(value: number[]) => setArbitraryFontSize2(value[0])}
                    className="my-2"
                  />
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4 min-h-[200px] flex flex-col justify-around">
                <motion.p
                  className="font-bold"
                  animate={{ fontSize: `${arbitraryFontSize1}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Developer A's Heading
                </motion.p>
                <motion.p
                  className="font-bold"
                  animate={{ fontSize: `${arbitraryFontSize2}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Developer B's Heading
                </motion.p>
              </div>
            </CardContent>
          </Card>

          {/* Column 2: The Solution with a Scale */}
          <Card className="min-h-[550px]">
            <CardHeader>
              <CardTitle>The Solution: A Typographic Scale</CardTitle>
              <CardDescription>
                Semantic tokens like `text-xl` are easier to remember than arbitrary pixel values, leading to consistent choices across your team and better design outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    Font Size Token: <span className="font-mono">text-{currentScaleKey}</span> (
                    {currentScalePx}px)
                  </label>
                  <Slider
                    defaultValue={[scaleIndex]}
                    max={scaleKeys.length - 1}
                    step={1}
                    onValueChange={handleScaleChange}
                    className="my-2"
                  />
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4 min-h-[200px] flex flex-col justify-around">
                <motion.p
                  className="font-bold"
                  animate={{ fontSize: `${currentScalePx}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Heading with a Token
                </motion.p>
                <motion.p
                  className="font-bold"
                  animate={{ fontSize: `${currentScalePx}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Another Heading with a Token
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 