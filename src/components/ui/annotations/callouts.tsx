import { InlineAnnotation, AnnotationHandler } from "codehike/code"
import { WarningTriangle, XmarkCircle, InfoCircle, MessageText } from "iconoir-react"

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ 
            minWidth: `${column + 2}ch`,
            backgroundColor: 'var(--ch-callout-bg)',
            borderColor: 'var(--ch-callout-border)',
            color: 'var(--ch-callout-text)'
          }}
          className="w-fit border rounded px-2 py-1 relative -ml-[0.5ch] mb-2 text-xs shadow-sm"
        >
          <div
            style={{ 
              left: `${column}ch`,
              backgroundColor: 'var(--ch-callout-bg)',
              borderColor: 'var(--ch-callout-border)'
            }}
            className="absolute border-l border-t w-1 h-1 rotate-45 -translate-x-1/2 -translate-y-1/2 -top-0.5"
          />
          <div className="font-medium flex items-center gap-1">
            <MessageText width="12" height="12" strokeWidth={1.5} />
            {annotation.query}
          </div>
        </div>
      </>
    )
  },
}

// Additional callout variants for different types
export const warning: AnnotationHandler = {
  name: "warning",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ 
            minWidth: `${column + 2}ch`,
            backgroundColor: 'var(--ch-warning-bg)',
            borderColor: 'var(--ch-warning-border)',
            color: 'var(--ch-warning-text)'
          }}
          className="w-fit border rounded px-2 py-1 relative -ml-[0.5ch] mb-2 text-xs shadow-sm"
        >
          <div
            style={{ 
              left: `${column}ch`,
              backgroundColor: 'var(--ch-warning-bg)',
              borderColor: 'var(--ch-warning-border)'
            }}
            className="absolute border-l border-t w-1 h-1 rotate-45 -translate-x-1/2 -translate-y-1/2 -top-0.5"
          />
          <div className="font-medium flex items-center gap-1">
            <WarningTriangle width="12" height="12" strokeWidth={1.5} color="var(--ch-warning-border)" />
            {annotation.query}
          </div>
        </div>
      </>
    )
  },
}

export const error: AnnotationHandler = {
  name: "error",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ 
            minWidth: `${column + 2}ch`,
            backgroundColor: 'var(--ch-error-bg)',
            borderColor: 'var(--ch-error-border)',
            color: 'var(--ch-error-text)'
          }}
          className="w-fit border rounded px-2 py-1 relative -ml-[0.5ch] mb-2 text-xs shadow-sm"
        >
          <div
            style={{ 
              left: `${column}ch`,
              backgroundColor: 'var(--ch-error-bg)',
              borderColor: 'var(--ch-error-border)'
            }}
            className="absolute border-l border-t w-1 h-1 rotate-45 -translate-x-1/2 -translate-y-1/2 -top-0.5"
          />
          <div className="font-medium flex items-center gap-1">
            <XmarkCircle width="12" height="12" strokeWidth={1.5} color="var(--ch-error-border)" />
            {annotation.query}
          </div>
        </div>
      </>
    )
  },
}

export const info: AnnotationHandler = {
  name: "info",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ 
            minWidth: `${column + 2}ch`,
            backgroundColor: 'var(--ch-info-bg)',
            borderColor: 'var(--ch-info-border)',
            color: 'var(--ch-info-text)'
          }}
          className="w-fit border rounded px-2 py-1 relative -ml-[0.5ch] mb-2 text-xs shadow-sm"
        >
          <div
            style={{ 
              left: `${column}ch`,
              backgroundColor: 'var(--ch-info-bg)',
              borderColor: 'var(--ch-info-border)'
            }}
            className="absolute border-l border-t w-1 h-1 rotate-45 -translate-x-1/2 -translate-y-1/2 -top-0.5"
          />
          <div className="font-medium flex items-center gap-1">
            <InfoCircle width="12" height="12" strokeWidth={1.5} color="var(--ch-info-border)" />
            {annotation.query}
          </div>
        </div>
      </>
    )
  },
}