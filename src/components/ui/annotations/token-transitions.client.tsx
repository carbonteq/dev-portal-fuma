"use client"

import { CustomPreProps, InnerPre, getPreRef } from "codehike/code"
import {
  TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions"
import React, { useRef, useLayoutEffect, useMemo, useCallback } from "react"

const MAX_TRANSITION_DURATION = 1000 // milliseconds

// Helper function to validate numeric values and prevent NaN
const safeNumericValue = (value: any): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? 0 : num
}

// Helper function to create safe translate values
const createSafeTranslateValue = (x: any, y: any): string => {
  const safeX = safeNumericValue(x)
  const safeY = safeNumericValue(y)
  return `${safeX}px ${safeY}px`
}

// Custom hook for managing animations with cleanup
const useAnimationCleanup = () => {
  const animationsRef = useRef<Animation[]>([])
  
  const addAnimation = useCallback((animation: Animation) => {
    animationsRef.current.push(animation)
  }, [])
  
  const cleanupAnimations = useCallback(() => {
    animationsRef.current.forEach(animation => {
      try {
        if (animation.playState !== 'finished') {
          animation.cancel()
        }
      } catch (error) {
        // Silently handle cleanup errors
        console.warn('Error cleaning up animation:', error)
      }
    })
    animationsRef.current = []
  }, [])
  
  return { addAnimation, cleanupAnimations }
}

export const SmoothPre: React.FC<CustomPreProps> = (props) => {
  const ref = useMemo(() => getPreRef(props), [])
  const prevSnapshotRef = useRef<TokenTransitionsSnapshot | null>(null)
  const { addAnimation, cleanupAnimations } = useAnimationCleanup()
  
  // Use layoutEffect to ensure DOM measurements are accurate
  useLayoutEffect(() => {
    if (!ref.current) return
    
    // Cleanup previous animations before starting new ones
    cleanupAnimations()
    
    // Get current snapshot and compare with previous
    const currentSnapshot = getStartingSnapshot(ref.current)
    
    if (prevSnapshotRef.current) {
      try {
        const transitions = calculateTransitions(ref.current, prevSnapshotRef.current)
        
        transitions.forEach(({ element, keyframes, options }) => {
          // Validate element before animating
          if (!element || !element.animate) {
            return
          }
          
          const { translateX, translateY, ...kf } = keyframes as any
          
          // Handle translate values with proper validation
          if (translateX && translateY && Array.isArray(translateX) && Array.isArray(translateY)) {
            // Validate all translate values
            const isValidTranslate = translateX.every((x: any) => 
              x !== null && x !== undefined && !isNaN(Number(x))
            ) && translateY.every((y: any) => 
              y !== null && y !== undefined && !isNaN(Number(y))
            )
            
            if (isValidTranslate) {
              kf.transform = [
                `translate3d(${safeNumericValue(translateX[0])}px, ${safeNumericValue(translateY[0])}px, 0)`,
                `translate3d(${safeNumericValue(translateX[1])}px, ${safeNumericValue(translateY[1])}px, 0)`
              ]
            }
          }
          
          // Ensure proper hardware acceleration properties
          const optimizedKeyframes = {
            ...kf,
            // Force hardware acceleration
            willChange: 'transform, opacity',
            // Use transform instead of left/top for better performance
            ...(kf.transform && { transform: kf.transform }),
          }
          
          // Validate animation options
          const safeDuration = Math.max(0, safeNumericValue(options.duration) * MAX_TRANSITION_DURATION)
          const safeDelay = Math.max(0, safeNumericValue(options.delay) * MAX_TRANSITION_DURATION)
          
          try {
            const animation = element.animate(optimizedKeyframes, {
              duration: safeDuration,
              delay: safeDelay,
              easing: options.easing || 'ease-out',
              fill: 'both',
              // Enable hardware acceleration
              composite: 'replace',
            })
            
            // Add animation to cleanup list
            addAnimation(animation)
            
            // Handle animation completion
            animation.addEventListener('finish', () => {
              try {
                // Reset will-change to auto for better performance
                if (element.style) {
                  element.style.willChange = 'auto'
                }
              } catch (error) {
                console.warn('Error resetting will-change:', error)
              }
            }, { once: true })
            
          } catch (error) {
            console.warn('Error creating animation:', error)
          }
        })
      } catch (error) {
        console.warn('Error calculating transitions:', error)
      }
    }
    
    // Store current snapshot for next update
    prevSnapshotRef.current = currentSnapshot
    
    // Cleanup on unmount
    return cleanupAnimations
  })
  
  // Cleanup animations on unmount
  useLayoutEffect(() => {
    return cleanupAnimations
  }, [cleanupAnimations])
  
  return <InnerPre merge={props} style={{ position: "relative" }} />
}

// Keep the old class component as a fallback export for backward compatibility
export class SmoothPreClass extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement>
  constructor(props: CustomPreProps) {
    super(props)
    this.ref = getPreRef(this.props)
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: "relative" }} />
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!)
  }

  componentDidUpdate(
    prevProps: never,
    prevState: never,
    snapshot: TokenTransitionsSnapshot
  ) {
    const transitions = calculateTransitions(this.ref.current!, snapshot)
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ]
      }
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      })
    })
  }
}