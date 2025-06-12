"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, LinkIcon, Copy, QrCode } from "lucide-react"
import axios from "axios"

interface CreateLinkCardProps {
  className?: string
}

export function CreateLinkCard({ className }: CreateLinkCardProps) {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState("")
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

    setIsLoading(true)

    try {
      const response = await axios.post("/links", {
        originalUrl: url,
        slug: customSlug || undefined,
      })

      if (response.data.success) {
        setShortUrl(response.data.link.shortUrl)
        toast({
          title: "Link created!",
          description: "Your shortened link is ready to use.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Failed to create link",
        description: error.response?.data?.message || "An error occurred while creating your link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      title: "Copied to clipboard",
      description: "Link has been copied to your clipboard.",
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create Link</CardTitle>
        <CardDescription>Shorten a long URL with a custom slug or generate one automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="url">URL to shorten</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="slug">Custom slug (optional)</Label>
              <Input
                id="slug"
                placeholder="my-custom-link"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Short Link"
            )}
          </Button>
        </form>
      </CardContent>
      {shortUrl && (
        <CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
          <div className="text-sm font-medium">Your shortened link:</div>
          <div className="flex w-full items-center space-x-2">
            <Input value={shortUrl} readOnly className="bg-muted" />
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
