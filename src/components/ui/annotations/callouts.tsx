import { InlineAnnotation, AnnotationHandler } from "codehike/code"
import { WarningTriangle, XmarkCircle, InfoCircle, GoogleDocs } from "iconoir-react"

// Shared transform function for all callout types
const createCalloutTransform = (name: string) => (annotation: InlineAnnotation) => {
  const { query, lineNumber, fromColumn, toColumn, data } = annotation
  
  // Check if the annotation query contains mark information
  // For example: "!callout[/text/] rgb(255, 0, 0) This is the message"
  const parts = query?.split(' ') || []
  let markColor = null
  let message = query
  
  // Look for a color in the query (rgb, hex, or named color)
  if (parts.length > 1) {
    const possibleColor = parts[0]
    if (possibleColor.startsWith('rgb(') || possibleColor.startsWith('#') || /^[a-z]+$/.test(possibleColor)) {
      markColor = possibleColor
      message = parts.slice(1).join(' ')
    }
  }
  
  // Return only the callout annotation with mark color stored in data
  return {
    name,
    query: message,
    fromLineNumber: lineNumber,
    toLineNumber: lineNumber,
    data: { ...data, column: (fromColumn + toColumn) / 2, markColor },
  }
}

// Shared block component factory
const createCalloutBlock = (
  bgVar: string,
  borderVar: string,
  textVar: string,
  icon: React.ReactNode,
  containerClass: string = "",
  calloutClass: string = ""
) => ({ annotation, children }: any) => {
  const { column, markColor } = annotation.data
  
  // Apply mark styling if mark color is present
  const containerStyle = markColor ? {
    backgroundColor: `color-mix(in srgb, ${markColor} 10%, transparent)`,
    borderLeft: `solid 2px ${markColor}`,
    paddingLeft: '0.5rem',
    paddingRight: '1.5rem',
    marginLeft: '-0.5rem',
    marginRight: '-1.5rem',
    width: 'calc(100% + 1rem)',
  } : {}
  
  // Use different className based on whether mark color is applied
  const containerClassName = markColor 
    ? `w-full ch-callout-container ${containerClass}` // Remove mb-2 when mark color is applied
    : `w-full mb-2 ch-callout-container ${containerClass}` // Keep mb-2 when no mark color
  
  return (
    <>
      {children}
      <div 
        className={containerClassName}
        style={containerStyle}
      >
        <div
          style={{ 
            minWidth: `${column + 2}ch`,
            backgroundColor: `var(${bgVar})`,
            borderColor: `var(${borderVar})`,
            color: `var(${textVar})`
          }}
          className={`w-fit border rounded px-2 py-1 relative -ml-[0.5ch] text-xs shadow-sm ch-callout ${calloutClass}`}
        >
          <div
            style={{ 
              left: `${column}ch`,
              backgroundColor: `var(${bgVar})`,
              borderColor: `var(${borderVar})`
            }}
            className="absolute border-l border-t w-1 h-1 rotate-45 -translate-x-1/2 -translate-y-1/2 -top-0.5"
          />
          <div className="font-medium flex items-center gap-1">
            {icon}
            {annotation.query}
          </div>
        </div>
      </div>
    </>
  )
}

export const callout: AnnotationHandler = {
  name: "callout",
  transform: createCalloutTransform("callout"),
  Block: createCalloutBlock(
    "--ch-callout-bg",
    "--ch-callout-border", 
    "--ch-callout-text",
    <GoogleDocs width="12" height="12" strokeWidth={1.5} />
  ),
}

// Additional callout variants for different types
export const warning: AnnotationHandler = {
  name: "warning",
  transform: createCalloutTransform("warning"),
  Block: createCalloutBlock(
    "--ch-warning-bg",
    "--ch-warning-border",
    "--ch-warning-text", 
    <WarningTriangle width="12" height="12" strokeWidth={1.5} color="var(--ch-warning-border)" />,
    "ch-warning-container",
    "ch-warning"
  ),
}

export const error: AnnotationHandler = {
  name: "error",
  transform: createCalloutTransform("error"),
  Block: createCalloutBlock(
    "--ch-error-bg",
    "--ch-error-border",
    "--ch-error-text",
    <XmarkCircle width="12" height="12" strokeWidth={1.5} color="var(--ch-error-border)" />,
    "ch-error-container", 
    "ch-error"
  ),
}

export const info: AnnotationHandler = {
  name: "info",
  transform: createCalloutTransform("info"),
  Block: createCalloutBlock(
    "--ch-info-bg",
    "--ch-info-border",
    "--ch-info-text",
    <InfoCircle width="12" height="12" strokeWidth={1.5} color="var(--ch-info-border)" />,
    "ch-info-container",
    "ch-info"
  ),
}