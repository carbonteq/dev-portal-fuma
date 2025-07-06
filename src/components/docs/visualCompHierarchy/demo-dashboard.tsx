"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ComponentLayerTag } from "./component-layer-tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type LayerType = "Page" | "Container" | "Composite" | "Primitive"

interface DemoDashboardProps {
  selectedLayer: LayerType | null
}

export function DemoDashboard({ selectedLayer }: DemoDashboardProps) {
  return (
    <div className="bg-fd-background not-prose">
      <ComponentLayerTag
        label="Page"
        description="Full screen route - /sales/invoices/:id"
        selectedLayer={selectedLayer}
      >
        <motion.div
          className="bg-fd-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Navigation - Part of Page level */}
          <motion.div
            className="bg-fd-card border-b border-fd-border px-6 py-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-xl font-bold text-fd-foreground">Sales Dashboard</h1>
          </motion.div>

          <div className="flex">
            {/* Sidebar */}
            <ComponentLayerTag
              label="Composite"
              description="Navigation menu composite with multiple menu items"
              selectedLayer={selectedLayer}
            >
              <motion.div
                className="w-56 bg-fd-card border-r border-fd-border p-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-4">
                  <motion.h2
                    className="text-base font-bold text-fd-primary not-prose"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Fakebooks
                  </motion.h2>
                </div>

                <nav className="space-y-1">
                  {["Dashboard", "Accounts", "Sales", "Expenses", "Reports"].map((item, index) => (
                    // Only tag one button as an example primitive
                    index === 2 ? (
                      <ComponentLayerTag
                        key={item}
                        label="Primitive"
                        description="Button - UI component from design system"
                        selectedLayer={selectedLayer}
                      >
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <Button variant={item === "Sales" ? "secondary" : "ghost"} className="w-full justify-start text-sm py-1">
                            {item}
                          </Button>
                        </motion.div>
                      </ComponentLayerTag>
                    ) : (
                      <motion.div
                        key={item}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <Button variant={item === "Sales" ? "secondary" : "ghost"} className="w-full justify-start text-sm py-1">
                          {item}
                        </Button>
                      </motion.div>
                    )
                  ))}
                </nav>
              </motion.div>
            </ComponentLayerTag>

            {/* Main Content */}
            <div className="flex-1 p-4">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Invoice Analytics Container */}
                <ComponentLayerTag
                  label="Container"
                  description="Invoice analytics data fetching and state management"
                  selectedLayer={selectedLayer}
                >
                  <ComponentLayerTag
                    label="Composite"
                    description="InvoiceAnalytics - business component showing financial metrics"
                    selectedLayer={selectedLayer}
                  >
                    <motion.div
                      className="grid grid-cols-2 gap-2"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {[
                        { label: "OVERDUE", amount: "$10,800", color: "text-red-400", bgColor: "bg-fd-accent/10 border-fd-accent" },
                        { label: "DUE SOON", amount: "$62,000", color: "text-fd-primary", bgColor: "bg-fd-accent/10 border-fd-accent" },
                      ].map((card, index) => (
                        <motion.div
                          key={card.label}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Card className={`${card.bgColor} border-2 py-4 gap-0`}>
                            <CardHeader>
                              {/* Only tag the first card's label as an example primitive */}
                              {index === 0 ? (
                                <ComponentLayerTag
                                  label="Primitive"
                                  description="Typography - UI component for text display"
                                  selectedLayer={selectedLayer}
                                >
                                  <CardTitle className="text-xs text-fd-muted-foreground font-medium">{card.label}</CardTitle>
                                </ComponentLayerTag>
                              ) : (
                                <CardTitle className="text-xs text-fd-muted-foreground font-medium">{card.label}</CardTitle>
                              )}
                            </CardHeader>
                            <CardContent className="pt-0">
                              {/* Only tag the first card's amount as an example primitive */}
                              {index === 0 ? (
                                <ComponentLayerTag
                                  label="Primitive"
                                  description="Typography - UI component for currency display"
                                  selectedLayer={selectedLayer}
                                >
                                  <div className={`text-base font-bold ${card.color}`}>{card.amount}</div>
                                </ComponentLayerTag>
                              ) : (
                                <div className={`text-base font-bold ${card.color}`}>{card.amount}</div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ComponentLayerTag>
                </ComponentLayerTag>

                {/* Invoice List Container */}
                <ComponentLayerTag
                  label="Container"
                  description="Invoice list data fetching and pagination management"
                  selectedLayer={selectedLayer}
                >
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="bg-fd-card border-fd-border py-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-fd-foreground">INVOICE LIST</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          {
                            name: "Santa Monica",
                            year: "1995",
                            amount: "$10,800",
                            status: "OVERDUE",
                            statusColor: "destructive",
                          },
                          {
                            name: "Stankonia",
                            year: "2000",
                            amount: "$8,000",
                            status: "DUE TODAY",
                            statusColor: "secondary",
                          },
                          {
                            name: "Ocean Avenue",
                            year: "2003",
                            amount: "$9,500",
                            status: "PAID",
                            statusColor: "default",
                          },
                        ].map((invoice, index) => (
                          <ComponentLayerTag
                            key={invoice.name}
                            label="Composite"
                            description="InvoiceListItem - business component for invoice data"
                            selectedLayer={selectedLayer}
                          >
                            <motion.div
                              className="flex items-center justify-between p-2 border border-fd-border rounded-lg hover:bg-fd-muted transition-colors"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.7 + index * 0.05 }}
                              whileHover={{ scale: 1.01, x: 5 }}
                            >
                              <div>
                                {/* Only tag primitives in the first invoice item as examples */}
                                {index === 0 ? (
                                  <>
                                    <ComponentLayerTag
                                      label="Primitive"
                                      description="Typography - UI component for invoice name"
                                      selectedLayer={selectedLayer}
                                    >
                                      <div className="font-semibold text-fd-foreground text-sm leading-tight">{invoice.name}</div>
                                    </ComponentLayerTag>
                                    <div className="text-xs text-fd-muted-foreground">{invoice.year}</div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-fd-foreground text-sm leading-tight">{invoice.name}</div>
                                    <div className="text-xs text-fd-muted-foreground">{invoice.year}</div>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Only tag primitives in the first invoice item as examples */}
                                {index === 0 ? (
                                  <>
                                    <div className="font-semibold text-fd-foreground text-sm">{invoice.amount}</div>
                                    <ComponentLayerTag
                                      label="Primitive"
                                      description="Badge - UI component for status display"
                                      selectedLayer={selectedLayer}
                                    >
                                      <Badge variant={invoice.statusColor as any} className="text-xs">{invoice.status}</Badge>
                                    </ComponentLayerTag>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-semibold text-fd-foreground text-sm">{invoice.amount}</div>
                                    <Badge variant={invoice.statusColor as any} className="text-xs">{invoice.status}</Badge>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          </ComponentLayerTag>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </ComponentLayerTag>

                {/* Pending Invoice Container */}
                <ComponentLayerTag
                  label="Container"
                  description="Selected invoice details data fetching and state management"
                  selectedLayer={selectedLayer}
                >
                  <ComponentLayerTag
                    label="Composite"
                    description="InvoiceDetails - business component showing invoice breakdown"
                    selectedLayer={selectedLayer}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Card className="border-2 border-fd-accent bg-fd-accent/10 py-3">
                        <CardHeader className="pb-1">
                          <CardTitle className="text-base text-fd-foreground">Stankonia</CardTitle>
                          <p className="text-xs text-fd-muted-foreground">DUE TODAY • INVOICED 10/31/2000</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {/* Only tag one primitive as an example */}
                          <ComponentLayerTag
                            label="Primitive"
                            description="Typography - UI component for large amounts"
                            selectedLayer={selectedLayer}
                          >
                            <motion.div
                              className="text-xl font-bold text-fd-foreground"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.9, type: "spring" }}
                            >
                              $8,000
                            </motion.div>
                          </ComponentLayerTag>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-fd-foreground">Custom</span>
                              <span className="text-fd-foreground">$2,000</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t border-fd-border pt-1 text-sm">
                              <span className="text-fd-foreground">Net Total</span>
                              <span className="text-fd-foreground">$8,000</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </ComponentLayerTag>
                </ComponentLayerTag>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </ComponentLayerTag>
    </div>
  )
}
