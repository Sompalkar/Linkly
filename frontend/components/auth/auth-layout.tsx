"use client"

import type React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex gradient-bg text-white"
      >
        <div className="flex flex-col justify-between p-10 w-full relative overflow-hidden">
          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <Link href="/" className="text-2xl font-bold">
              Linkly
            </Link>
          </div>
          <div className="space-y-6 relative z-10">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl font-bold"
            >
              Transform your links, elevate your brand
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/80"
            >
              Create branded short links with powerful analytics to grow your brand and monitor performance.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="glass p-4 rounded-lg">
                <div className="text-3xl font-bold">5M+</div>
                <div className="text-white/80">Links created</div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-white/80">Active users</div>
              </div>
            </motion.div>
          </div>
          <div className="text-sm text-white/60 relative">
            © {new Date().getFullYear()} Linkly. All rights reserved.
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col min-h-screen"
      >
        <div className="flex items-center justify-between p-4 md:p-6">
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <span className="text-xl font-bold gradient-text">Linkly</span>
          </Link>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 md:p-6">{children}</div>
      </motion.div>
    </div>
  )
}
