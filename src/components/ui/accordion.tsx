"use client"
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b last:border-b-0", className)} {...props} />
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between py-3 text-sm font-medium font-sans! transition",
          "hover:bg-accent/40 text-foreground",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 px-2 rounded-md",
          "data-[state=open]:text-primary"
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn("text-sm text-muted-foreground px-2 pb-3 pt-0", className)}
      {...props}
    />
  )
}
