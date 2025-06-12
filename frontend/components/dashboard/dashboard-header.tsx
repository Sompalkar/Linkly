"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/dashboard/user-nav"
import { Bell, Search, Plus } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">Linkly</span>
          </Link>
          <div className="relative w-full max-w-[12rem] md:max-w-[20rem] lg:max-w-[24rem]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search links..." className="w-full pl-8 bg-background" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button size="sm" className="hidden md:flex">
            <Plus className="mr-1 h-4 w-4" /> Create Link
          </Button>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
