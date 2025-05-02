"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 border-b bg-background/95"></div>
        <div className="flex flex-1">
          <div className="hidden md:flex w-64 flex-col border-r bg-muted/40"></div>
          <main className="flex-1 p-6 md:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/95">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 md:p-8 overflow-auto"
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </div>
  )
}
