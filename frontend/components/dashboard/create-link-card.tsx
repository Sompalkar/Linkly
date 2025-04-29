"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import { fetchDomains, createLink } from "@/lib/api"

export function CreateLinkCard() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "URL is required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      })
      return
    }

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to create links",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get domains
      const domainsData = await fetchDomains(token)

      if (!domainsData.success || !domainsData.domains.length) {
        throw new Error("No domains available")
      }

      // Find default domain or use first one
      const defaultDomain = domainsData.domains.find((d: any) => d.isDefault) || domainsData.domains[0]

      // Create link
      const data = await createLink(token, {
        originalUrl: url,
        domainId: defaultDomain.id,
      })

      toast({
        title: "Link created!",
        description: `Your shortened URL is: ${data.link.shortUrl}`,
      })

      setUrl("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error creating link",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Link2 className="mr-2 h-5 w-5 text-cyan-500" />
            Create a Short Link
          </CardTitle>
          <CardDescription>Enter a URL to generate a shortened link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL to shorten</Label>
              <Input
                id="url"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="transition-all focus-within:border-cyan-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Shorten URL"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
