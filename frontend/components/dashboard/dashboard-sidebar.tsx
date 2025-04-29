"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Globe, Home, LinkIcon, Settings } from "lucide-react"
import { motion } from "framer-motion"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Links",
    href: "/dashboard/links",
    icon: LinkIcon,
  },
  {
    name: "Domains",
    href: "/dashboard/domains",
    icon: Globe,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
      <div className="flex flex-col gap-2 p-4">
        {sidebarLinks.map((link, index) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-lg bg-cyan-500/10 p-4">
          <h4 className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-2">Pro Upgrade</h4>
          <p className="text-xs text-muted-foreground mb-3">Unlock advanced features and analytics</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="#"
              className="block text-center text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-3 rounded-md"
            >
              Upgrade Now
            </Link>
          </motion.div>
        </div>
      </div>
    </aside>
  )
}
