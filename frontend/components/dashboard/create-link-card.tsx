"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { createLink, fetchDomains } from "@/lib/api"
import { Link2, Copy, QrCode, Settings, Calendar, Lock, Tag, Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useEffect } from "react"

interface Domain {
  id: string
  name: string
  isDefault: boolean
  isVerified: boolean
}

export function CreateLinkCard() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [password, setPassword] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [domains, setDomains] = useState<Domain[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState<any>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadDomains = async () => {
      if (!token) return

      try {
        const data = await fetchDomains(token)
        setDomains(data.data.domains)
        const defaultDomain = data.data.domains.find((d: Domain) => d.isDefault)
        if (defaultDomain) {
          setSelectedDomain(defaultDomain.id)
        }
      } catch (error) {
        console.error("Error loading domains:", error)
      }
    }

    loadDomains()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!originalUrl.trim()) {
      toast({
        title: "URL required",
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
      const linkData: any = {
        originalUrl: originalUrl.trim(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        customSlug: customSlug.trim() || undefined,
        password: password.trim() || undefined,
        expiresAt: expiresAt || undefined,
        domainId: selectedDomain || undefined,
      }

      if (tags.trim()) {
        linkData.tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      }

      const data = await createLink(token, linkData)
      setCreatedLink(data.data.link)

      toast({
        title: "Link created successfully",
        description: "Your short link is ready to use",
      })

      // Reset form
      setOriginalUrl("")
      setCustomSlug("")
      setTitle("")
      setDescription("")
      setTags("")
      setPassword("")
      setExpiresAt("")
      setShowAdvanced(false)
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

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied to clipboard",
      description: "Short URL has been copied to your clipboard",
    })
  }

  const handleDownloadQR = (qrCode: string, title: string) => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `${title || "qr-code"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reset = () => {
    setCreatedLink(null)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-purple-500" />
          Create Short Link
        </CardTitle>
        <CardDescription>Transform your long URLs into short, shareable links</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!createdLink ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="originalUrl">Original URL *</Label>
                <Input
                  id="originalUrl"
                  type="url"
                  placeholder="https://example.com/very-long-url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Domain Selection */}
              {domains.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <select
                    id="domain"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    disabled={isLoading}
                  >
                    {domains.map((domain) => (
                      <option key={domain.id} value={domain.id}>
                        {domain.name} {domain.isDefault && "(Default)"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Slug */}
              <div className="space-y-2">
                <Label htmlFor="customSlug">Custom Slug (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {domains.find((d) => d.id === selectedDomain)?.name || "somn.in"}/
                  </span>
                  <Input
                    id="customSlug"
                    placeholder="my-link"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to generate automatically. Only letters, numbers, hyphens, and underscores allowed.
                </p>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center space-x-2">
                <Switch id="advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} disabled={isLoading} />
                <Label htmlFor="advanced" className="flex items-center cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Options
                </Label>
              </div>

              {/* Advanced Options */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 border-t pt-4"
                  >
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="My Awesome Link"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of your link"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                        rows={3}
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="marketing, social, campaign"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Password Protection
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Optional password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Expiration */}
                    <div className="space-y-2">
                      <Label htmlFor="expiresAt" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Expiration Date
                      </Label>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        disabled={isLoading}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Link...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Create Short Link
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Link Created Successfully!</h3>
                <p className="text-muted-foreground">Your short link is ready to use</p>
              </div>

              {/* Link Details */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Short URL</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopyLink(createdLink.shortUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={createdLink.shortUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="font-mono text-lg text-purple-600 break-all">{createdLink.shortUrl}</div>
                </div>

                {createdLink.title && (
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-muted-foreground">{createdLink.title}</p>
                  </div>
                )}

                {createdLink.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{createdLink.description}</p>
                  </div>
                )}

                {createdLink.tags && createdLink.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {createdLink.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {createdLink.expiresAt && (
                  <div>
                    <Label className="text-sm font-medium">Expires</Label>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(createdLink.expiresAt), "PPP 'at' p")}
                    </p>
                  </div>
                )}

                {/* QR Code */}
                {createdLink.qrCode && (
                  <div className="text-center">
                    <Label className="text-sm font-medium">QR Code</Label>
                    <div className="mt-2">
                      <img
                        src={createdLink.qrCode || "/placeholder.svg"}
                        alt="QR Code"
                        className="mx-auto w-32 h-32 border rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleDownloadQR(createdLink.qrCode, createdLink.title)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center">
                <Button onClick={reset} variant="outline">
                  Create Another Link
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
