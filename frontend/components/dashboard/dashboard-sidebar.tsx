"use client"

import { Button } from "@/components/ui/button"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Globe, Home, LinkIcon, Settings, PlusCircle, Tags, History, FileText } from "lucide-react"

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Links", href: "/dashboard/links", icon: LinkIcon },
  { name: "Domains", href: "/dashboard/domains", icon: Globe },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const quickLinks = [
  { name: "Create Link", href: "/dashboard/links/create", icon: PlusCircle },
  { name: "Manage Tags", href: "/dashboard/tags", icon: Tags },
  { name: "Link History", href: "/dashboard/history", icon: History },
  { name: "API Docs", href: "/dashboard/api-docs", icon: FileText },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col flex-grow p-4 space-y-6">
        <div className="space-y-1">
          <h2 className="px-2 text-lg font-semibold tracking-tight">Main Navigation</h2>
          <div className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === link.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="px-2 text-lg font-semibold tracking-tight">Quick Access</h2>
          <div className="space-y-1">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === link.href ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4">
          <h3 className="font-medium text-sm">Need help?</h3>
          <p className="text-xs text-muted-foreground mt-1">Check our documentation or contact support</p>
          <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs text-cyan-600 dark:text-cyan-400" asChild>
            <Link href="/docs">View Documentation</Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
