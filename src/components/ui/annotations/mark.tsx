import { AnnotationHandler, InnerLine } from "codehike/code"

export const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)" // Default blue color
    
    // Check if this is a multi-line annotation
    const isMultiLine = annotation && 
      annotation.fromLineNumber !== annotation.toLineNumber
    
    // Determine position within the mark
    const isFirstLine = annotation && 
      props.lineNumber === annotation.fromLineNumber
    const isLastLine = annotation && 
      props.lineNumber === annotation.toLineNumber
    const isMiddleLine = annotation && 
      props.lineNumber > annotation.fromLineNumber && 
      props.lineNumber < annotation.toLineNumber

    // Build margin classes based on position
    let marginClasses = ""
    if (isMultiLine) {
      if (isFirstLine) {
        marginClasses = "pt-2" // Add top margin to first line
      } else if (isLastLine) {
        marginClasses = "pb-2" // Add bottom margin to last line
      }
      // Middle lines get no extra margin to maintain continuity
    }

    // For overlapping marks, we need to be more conservative with margins
    // Check if there are adjacent marks by examining nearby annotations
    const hasAdjacentMark = (direction: 'above' | 'below') => {
      // This would need access to other annotations to detect adjacency
      // For now, we'll use a more conservative approach
      return false
    }

    // Adjust margins if there are adjacent marks
    if (isFirstLine && hasAdjacentMark('above')) {
      marginClasses = marginClasses.replace('mt-2', 'mt-1')
    }
    if (isLastLine && hasAdjacentMark('below')) {
      marginClasses = marginClasses.replace('mb-2', 'mb-1')
    }

    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `color-mix(in srgb, ${color} 10%, transparent)`,
        }}
        className={`px-2 -mx-2 ${marginClasses}`}
      >
        <InnerLine merge={props} />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)" // Default blue color
    return (
      <span
        style={{
          outline: `solid 1px color-mix(in srgb, ${color} 50%, transparent)`,
          background: `color-mix(in srgb, ${color} 13%, transparent)`,
          borderRadius: "2px",
        }}
        className="px-1 -mx-0.5"
      >
        {children}
      </span>
    )
  },
}

// Alternative approach using CSS custom properties for better control
export const markWithCustomSpacing: AnnotationHandler = {
  name: "mark",
  Block: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    
    return (
      <div 
        style={{
          '--mark-color': color,
          marginTop: 'var(--mark-spacing-top, 0)',
          marginBottom: 'var(--mark-spacing-bottom, 0)',
        } as React.CSSProperties}
        className="mark-block"
      >
        {children}
      </div>
    )
  },
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    
    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `color-mix(in srgb, ${color} 10%, transparent)`,
        }}
        className="px-2 -mx-2"
      >
        <InnerLine merge={props} />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    return (
      <span
        style={{
          outline: `solid 1px color-mix(in srgb, ${color} 50%, transparent)`,
          background: `color-mix(in srgb, ${color} 13%, transparent)`,
          borderRadius: "2px",
        }}
        className="px-1 -mx-0.5"
      >
        {children}
      </span>
    )
  },
} 