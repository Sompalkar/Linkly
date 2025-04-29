"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DomainVerificationGuide() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    })
  }

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle>Domain Verification Guide</CardTitle>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        <CardDescription>Learn how to verify your domain ownership</CardDescription>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="dns" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dns">DNS Verification</TabsTrigger>
              <TabsTrigger value="hosting">Hosting Setup</TabsTrigger>
            </TabsList>
            <TabsContent value="dns" className="mt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 1: Add a TXT Record</h3>
                <p className="text-sm text-muted-foreground">
                  To verify your domain, you need to add a TXT record to your domain's DNS settings. This proves that
                  you own the domain.
                </p>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Record Type: TXT</p>
                      <p className="text-sm font-medium">Host/Name: @</p>
                      <p className="text-sm font-medium">Value: shortener-verify=YOUR_VERIFICATION_TOKEN</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("shortener-verify=YOUR_VERIFICATION_TOKEN")}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Replace YOUR_VERIFICATION_TOKEN with the token shown in your domain's row in the table below.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 2: Wait for DNS Propagation</h3>
                <p className="text-sm text-muted-foreground">
                  DNS changes can take up to 24-48 hours to propagate, but often happen much faster. After adding the
                  TXT record, click "Verify" on your domain.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Step 3: Set Up Domain Forwarding</h3>
                <p className="text-sm text-muted-foreground">
                  Once verified, you'll need to set up your domain to forward requests to our servers. This can be done
                  with either CNAME records or A records.
                </p>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Record Type: CNAME</p>
                      <p className="text-sm font-medium">Host/Name: @</p>
                      <p className="text-sm font-medium">Value: linkly-app.vercel.app</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("linkly-app.vercel.app")}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a href="https://docs.example.com/domain-verification" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Detailed Documentation
                  </a>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="hosting" className="mt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Option 1: Redirect with CNAME</h3>
                <p className="text-sm text-muted-foreground">
                  The simplest way to set up your domain is to use a CNAME record that points to our servers.
                </p>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Record Type: CNAME</p>
                      <p className="text-sm font-medium">Host/Name: @</p>
                      <p className="text-sm font-medium">Value: linkly-app.vercel.app</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("linkly-app.vercel.app")}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: Some DNS providers don't allow CNAME records for the root domain (@). In that case, use Option
                  2.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Option 2: Redirect with A Records</h3>
                <p className="text-sm text-muted-foreground">
                  If you can't use a CNAME record, you can set up A records that point to our IP addresses.
                </p>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Record Type: A</p>
                      <p className="text-sm font-medium">Host/Name: @</p>
                      <p className="text-sm font-medium">Value: 76.76.21.21</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("76.76.21.21")}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Option 3: Using a Subdomain</h3>
                <p className="text-sm text-muted-foreground">
                  If you want to use a subdomain (e.g., links.yourdomain.com), you can set up a CNAME record for that
                  subdomain.
                </p>
                <div className="bg-muted p-4 rounded-md mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Record Type: CNAME</p>
                      <p className="text-sm font-medium">Host/Name: links</p>
                      <p className="text-sm font-medium">Value: linkly-app.vercel.app</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("linkly-app.vercel.app")}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}
