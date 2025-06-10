import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RecoilProvider } from "@/components/providers/recoil-provider"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Linkly - Modern URL Shortener",
  description: "Shorten, brand, and track your links with our powerful URL shortener",
  keywords: "url shortener, link shortener, custom domains, link analytics, branded links",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RecoilProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }
            >
              {children}
            </Suspense>
            <Toaster />
          </RecoilProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
