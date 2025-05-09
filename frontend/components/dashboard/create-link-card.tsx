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
import { Loader2, Link2, Copy, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchDomains, createLink } from "@/lib/api"

export function CreateLinkCard() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null)
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
      // For development, use a default domain
      let domainId = "default-dev-domain"

      try {
        // Try to fetch domains from API
        const domainsData = await fetchDomains(token)

        if (domainsData.success && domainsData.domains.length > 0) {
          // Find default domain or use first one
          const defaultDomain = domainsData.domains.find((d: any) => d.isDefault) || domainsData.domains[0]
          domainId = defaultDomain.id
        }
      } catch (error) {
        console.error("Error fetching domains:", error)
        // Continue with default domain
      }

      // Prepare URL if needed
      let originalUrl = url
      if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
        originalUrl = "https://" + originalUrl
      }

      // Create link
      const data = await createLink(token, {
        originalUrl,
        domainId,
      })

      console.log("Link created:", data)

      // Set the created link for display
      setCreatedLink(data.link.shortUrl)

      toast({
        title: "Link created!",
        description: `Your shortened URL is ready to use`,
      })

      // Don't clear the URL field yet so user can see what they shortened
    } catch (error) {
      console.error("Error creating link:", error)
      toast({
        title: "Error creating link",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink)
      toast({
        title: "Copied to clipboard",
        description: "The link has been copied to your clipboard",
      })
    }
  }

  const openLink = () => {
    if (createdLink) {
      window.open(createdLink, "_blank")
    }
  }

  const createNewLink = () => {
    setUrl("")
    setCreatedLink(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="hover-card overflow-hidden border-gradient">
        <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
          <CardTitle className="flex items-center">
            <Link2 className="mr-2 h-5 w-5 text-purple-500" />
            Create a Short Link
          </CardTitle>
          <CardDescription>Enter a URL to generate a shortened link</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {!createdLink ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="url">URL to shorten</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="transition-all focus-within:border-purple-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
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
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="shortUrl">Your shortened URL</Label>
                  <div className="flex">
                    <Input
                      id="shortUrl"
                      value={createdLink}
                      readOnly
                      className="flex-1 bg-muted/50 font-mono text-sm"
                      onClick={() => copyToClipboard()}
                    />
                    <Button variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy link</span>
                    </Button>
                    <Button variant="outline" size="icon" className="ml-2" onClick={openLink}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open link</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Click the link to copy it to your clipboard</p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={createNewLink}>
                    Create Another Link
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/links")}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                  >
                    View All Links
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
