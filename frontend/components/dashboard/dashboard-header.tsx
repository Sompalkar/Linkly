"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, User, LogOut, Settings, Search, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Linkly
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            >
              Linkly
            </motion.span>
          </Link>
          <div className="relative w-64 ml-6">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex items-center gap-1 text-xs bg-muted/40 hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            New Link
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] flex items-center justify-center text-white font-medium">
                  {notificationCount}
                </span>
              )}
            </Button>
          </motion.div>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t"
        >
          <div className="flex flex-col p-4 space-y-2">
            {[
              { name: "Dashboard", href: "/dashboard", icon: <User className="h-4 w-4" /> },
              { name: "Links", href: "/dashboard/links", icon: <User className="h-4 w-4" /> },
              { name: "Domains", href: "/dashboard/domains", icon: <User className="h-4 w-4" /> },
              { name: "Analytics", href: "/dashboard/analytics", icon: <User className="h-4 w-4" /> },
              { name: "Settings", href: "/dashboard/settings", icon: <User className="h-4 w-4" /> },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted"
                onClick={() => setShowMobileMenu(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  )
}
