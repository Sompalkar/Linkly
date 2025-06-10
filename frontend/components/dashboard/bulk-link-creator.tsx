"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Loader2, Upload, Download, FileText, CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createBulkLinks } from "@/lib/api"

interface BulkResult {
  links: Array<{
    id: string
    originalUrl: string
    shortUrl: string
    title: string
  }>
  errors: Array<{
    url: string
    error: string
  }>
}

export function BulkLinkCreator() {
  const [urls, setUrls] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BulkResult | null>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!urls.trim()) {
      toast({
        title: "URLs required",
        description: "Please enter URLs to shorten",
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
      // Parse URLs from textarea
      const urlList = urls
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((url) => {
          // Check if line has title format: "Title | URL"
          const parts = url.split("|").map((part) => part.trim())
          if (parts.length === 2) {
            return {
              title: parts[0],
              originalUrl: parts[1],
            }
          }
          return {
            originalUrl: url,
          }
        })

      if (urlList.length === 0) {
        toast({
          title: "No valid URLs found",
          description: "Please enter at least one valid URL",
          variant: "destructive",
        })
        return
      }

      if (urlList.length > 100) {
        toast({
          title: "Too many URLs",
          description: "Maximum 100 URLs allowed per batch",
          variant: "destructive",
        })
        return
      }

      const data = await createBulkLinks(token, { urls: urlList })
      setResults(data)

      toast({
        title: "Bulk creation completed",
        description: `Created ${data.links.length} links successfully`,
      })
    } catch (error) {
      console.error("Error creating bulk links:", error)
      toast({
        title: "Error creating links",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadResults = () => {
    if (!results) return

    const csvContent = [
      "Title,Original URL,Short URL,Status",
      ...results.links.map((link) => `"${link.title}","${link.originalUrl}","${link.shortUrl}","Success"`),
      ...results.errors.map((error) => `"","${error.url}","","Error: ${error.error}"`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `bulk-links-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setUrls("")
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-purple-500" />
            Bulk Link Creator
          </CardTitle>
          <CardDescription>
            Create multiple short links at once. Enter one URL per line, or use format "Title | URL"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="urls">URLs to shorten</Label>
                  <Textarea
                    id="urls"
                    placeholder={`Enter URLs (one per line):
https://example.com/page1
My Blog Post | https://example.com/blog/post
https://example.com/page2`}
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{urls.split("\n").filter((line) => line.trim().length > 0).length} URLs entered</span>
                    <span>Maximum 100 URLs per batch</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Format Examples:
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground font-mono">
                    <div>https://example.com/page1</div>
                    <div>My Page Title | https://example.com/page2</div>
                    <div>Another Link | https://example.com/page3</div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating links...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Links
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">{results.links.length}</div>
                          <div className="text-sm text-muted-foreground">Successful</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                          <div className="text-sm text-muted-foreground">Failed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.links.length + results.errors.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Successful Links */}
                {results.links.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Successfully Created Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {results.links.map((link, index) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-900/20"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{link.title}</div>
                              <div className="text-sm text-muted-foreground font-mono">{link.shortUrl}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(link.shortUrl)
                                toast({
                                  title: "Copied to clipboard",
                                  description: "Short URL copied to clipboard",
                                })
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Failed Links */}
                {results.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        Failed Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {results.errors.map((error, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20">
                            <div className="font-medium text-red-600">{error.url}</div>
                            <div className="text-sm text-red-500">{error.error}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={reset}>
                    Create More Links
                  </Button>
                  <Button onClick={handleDownloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}


