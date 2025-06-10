"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Globe, Home, LinkIcon, Settings, Sparkles, Zap, HelpCircle, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"

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
    badge: "New",
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
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-background/95 backdrop-blur transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Linkly
            </span>
          </motion.div>
        )}
        {collapsed && (
          <div className="h-8 w-8 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <LinkIcon className="h-4 w-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

       

      <div className="flex-1 overflow-auto py-4">
        <div className="space-y-1 px-3">
          {sidebarLinks.map((link, index) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all relative group",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                  {!collapsed && (
                    <>
                      <span>{link.name}</span>
                      {link.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] py-0 h-4 bg-pink-500/10 text-pink-500 border-pink-500/20"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && link.badge && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[8px] bg-pink-500 text-white">
                      !
                    </Badge>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-popover text-popover-foreground border text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {link.name}
                    </div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {!collapsed && (
          <div className="mt-6 px-3">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">Resources</p>
            <div className="space-y-1">
              {[
                { name: "Documentation", icon: BookOpen, href: "#" },
                { name: "Help & Support", icon: HelpCircle, href: "#" },
              ].map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={cn("p-4 mt-auto", collapsed ? "px-2" : "")}>
        <div
          className={cn(
            "rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4",
            collapsed ? "p-2" : "",
          )}
        >
          {!collapsed && (
            <>
              <div className="flex items-center mb-2">
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Pro Upgrade</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Unlock advanced features and analytics</p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#"
                  className="block text-center text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 px-3 rounded-md"
                >
                  <span className="flex items-center justify-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Upgrade Now
                  </span>
                </Link>
              </motion.div>
            </>
          )}

          {collapsed && (
            <div className="flex flex-col items-center">
              <Sparkles className="h-4 w-4 text-purple-500 mb-2" />
              <Link
                href="#"
                className="block text-center text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 rounded-md w-full"
              >
                <Zap className="h-3 w-3 mx-auto" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
