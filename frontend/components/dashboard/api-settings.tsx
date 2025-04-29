"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { Copy, RefreshCw, Loader2 } from "lucide-react";

export function ApiSettings() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKey();
  }, [token]);

  const fetchApiKey = async () => {
    if (!token) return;

    try {
      setIsLoading(true);

      // In a real app, you would fetch the API key from your backend
      // This is a placeholder implementation
      setTimeout(() => {
        setApiKey("sk_test_" + Math.random().toString(36).substring(2, 15));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching API key:", error);
      toast({
        title: "Error",
        description: "Failed to load API key",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const regenerateApiKey = async () => {
    if (!token) return;

    try {
      setIsRegenerating(true);

      // In a real app, you would call your backend to regenerate the API key
      // This is a placeholder implementation
      setTimeout(() => {
        setApiKey("sk_test_" + Math.random().toString(36).substring(2, 15));
        setIsRegenerating(false);

        toast({
          title: "API key regenerated",
          description: "Your new API key has been generated successfully",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key",
        variant: "destructive",
      });
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The API key has been copied to your clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <CardDescription>Manage your API keys and access</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          <TabsContent value="keys" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Your API Key</Label>
              <div className="flex">
                <Input
                  id="apiKey"
                  value={
                    isLoading
                      ? "Loading..."
                      : apiKey
                      ? apiKey
                      : "No API key available"
                  }
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => apiKey && copyToClipboard(apiKey)}
                  disabled={isLoading || !apiKey}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep your API key secure. Do not share it in public repositories
                or client-side code.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={regenerateApiKey}
                disabled={isRegenerating}
                className="text-amber-600 hover:text-amber-700"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate API Key
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Warning: Regenerating your API key will invalidate your existing
                key. Any applications using the old key will stop working.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="docs" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Our RESTful API allows you to programmatically create, manage,
                  and retrieve analytics for your shortened links.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-medium">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  All API requests require authentication using your API key.
                  Include it in the Authorization header:
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-medium">Base URL</h4>
                <p className="text-sm text-muted-foreground">
                  All API requests should be made to the following base URL:
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  https://api.linkly.app/v1
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-medium">Endpoints</h4>
                <p className="text-sm text-muted-foreground">
                  The API provides the following endpoints:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">GET /links</span> - List all
                    your links
                  </li>
                  <li>
                    <span className="font-medium">POST /links</span> - Create a
                    new link
                  </li>
                  <li>
                    <span className="font-medium">GET /links/:id</span> - Get a
                    specific link
                  </li>
                  <li>
                    <span className="font-medium">PUT /links/:id</span> - Update
                    a link
                  </li>
                  <li>
                    <span className="font-medium">DELETE /links/:id</span> -
                    Delete a link
                  </li>
                  <li>
                    <span className="font-medium">GET /analytics</span> - Get
                    overall analytics
                  </li>
                  <li>
                    <span className="font-medium">GET /analytics/:id</span> -
                    Get analytics for a specific link
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Button variant="outline" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    View Full API Documentation
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
