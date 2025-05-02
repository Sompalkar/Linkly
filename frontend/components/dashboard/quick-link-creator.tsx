"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, Link2, Copy, ExternalLink, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchDomains, createLink } from "@/lib/api"

export function QuickLinkCreator() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

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

  const reset = () => {
    setUrl("")
    setCreatedLink(null)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
      >
        <Link2 className="mr-2 h-4 w-4" />
        Quick Shorten
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-50 w-80 bg-background border rounded-lg shadow-lg p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <Link2 className="mr-2 h-4 w-4 text-purple-500" />
                Quick Link Creator
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {!createdLink ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  <Input
                    placeholder="Enter URL to shorten"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="transition-all focus-within:border-purple-500"
                  />
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
                  className="space-y-3"
                >
                  <div className="flex">
                    <Input
                      value={createdLink}
                      readOnly
                      className="flex-1 bg-muted/50 font-mono text-sm"
                      onClick={() => copyToClipboard()}
                    />
                    <Button variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="ml-2" onClick={openLink}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={reset}>
                      Create Another
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
