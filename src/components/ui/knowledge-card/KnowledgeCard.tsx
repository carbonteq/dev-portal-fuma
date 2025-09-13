import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { 
  Settings, 
  HelpCircle,
  LucideIcon
} from "lucide-react"

type Subcomponent = { 
  id: string
  name: string
  description?: string
  href?: string
  status?: "core" | "optional"
  icon?: LucideIcon
}

type Item = { 
  id: string
  text: React.ReactNode
}

type SubcategoryItem = {
  id: string
  name: string
  href: string
  badge?: "default" | "secondary"
}

type Subcategory = {
  id: string
  name: string
  href?: string
  shortDescription?: string
  description?: React.ReactNode
  items?: SubcategoryItem[]
  defaultOpen?: boolean
}


export function KnowledgeCard({
  title,
  purpose,
  subcomponents = [],
  practices = [],
  gotchas = [],
  subcategories = [],
  actions,
  className,
}: {
  title: string
  purpose: React.ReactNode
  subcomponents?: Subcomponent[]
  practices?: Item[]
  gotchas?: Item[]
  subcategories?: Subcategory[]
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <TooltipProvider>
      <Card className={cn("rounded-xl mb-6 gap-4", className)}>
        <CardHeader className="gap-1">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl font-sans! mb-1">{title}</CardTitle>
            {actions ? <div data-slot="card-action">{actions}</div> : null}
          </div>
          <div className="text-sm text-foreground">{purpose}</div>
        </CardHeader>

      {subcomponents.length > 0 && (
        <CardContent className="space-y-1">
          <div className="space-y-1">
            {subcomponents.map(s => {
              const IconComponent = s.icon || Settings
              const content = (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="text-sm text-muted-foreground">:</span>
                      <span className="text-sm text-muted-foreground">{s.description}</span>
                      {s.status === "optional" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optional component</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              )
              
              return (
                <div key={s.id}>
                  {s.href ? (
                    <a href={s.href} className="block hover:bg-accent/40 rounded-md p-2 -m-2 transition-colors no-underline">
                      {content}
                    </a>
                  ) : (
                    <div className="p-2 -m-2">
                      {content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      )}

      {(practices.length > 0 || gotchas.length > 0) && (
        <>
          <Separator className="my-1 not-prose" />
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <section aria-label="Key practices" className="space-y-1">
              <h5 className="font-semibold! text-primary font-sans!">Key practices</h5>
              <ul className="list-disc pl-5 space-y-1">
                {practices.map(p => (
                  <li key={p.id} className="text-sm text-muted-foreground">
                    {p.text}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label="Gotchas" className="space-y-1">
              <h5 className="font-semibold! text-accent-foreground font-sans!">Gotchas</h5>
              <ul className="list-disc pl-5 space-y-1">
                {gotchas.map(g => (
                  <li key={g.id} className="text-sm text-muted-foreground">
                    {g.text}
                  </li>
                ))}
              </ul>
            </section>
          </CardContent>
        </>
      )}

      {subcategories.length > 0 && (
        <>
          <Separator className="my-0 not-prose" />
          <div className="space-y-0 px-6">
            <Accordion type="multiple" className="w-full">
              {subcategories.map(sc => (
                <AccordionItem key={sc.id} value={sc.id} data-open={sc.defaultOpen ? "true" : undefined}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start text-left">
                      <div>
                        {sc.href ? (
                          <a href={sc.href} className="no-underline">
                            {sc.name}
                          </a>
                        ) : (
                          sc.name
                        )}
                      </div>
                      {sc.shortDescription && (
                        <div className="text-xs text-muted-foreground mt-1 font-normal">
                          {sc.shortDescription}
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  {(sc.description || sc.items?.length) && (
                    <AccordionContent>
                      {sc.description && <div className="mb-1">{sc.description}</div>}
                      {sc.items?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {sc.items.map(it => (
                            <a key={it.id} href={it.href} className="no-underline">
                              <Badge variant="secondary" className="hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm transition-all duration-200">
                                {it.name}
                              </Badge>
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}
      </Card>
    </TooltipProvider>
  )
}
