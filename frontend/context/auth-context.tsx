"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

// Configure axios defaults
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
  createdAt: string
}

// Auth context interface
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // State
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/me")

        if (response.data.success) {
          setUser(response.data.user)
          setIsAuthenticated(true)

          // Redirect to dashboard if on auth pages
          if (pathname === "/login" || pathname === "/register") {
            router.push("/dashboard")
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)

          // Redirect to login if on protected pages
          if (pathname?.startsWith("/dashboard")) {
            router.push("/login")
          }
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)

        // Redirect to login if on protected pages
        if (pathname?.startsWith("/dashboard")) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", { email, password })

      if (response.data.success) {
        setUser(response.data.user)
        router.push("/dashboard")
        setIsAuthenticated(true)

        toast({
          title: "Welcome back!",
          description: `Hello ${response.data.user.name}, you're successfully logged in.`,
        })

      
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid credentials. Please try again."
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      })
      throw error
    }
  }

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("/auth/register", { name, email, password })

      if (response.data.success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Linkly! Please sign in to continue.",
        })
        router.push("/login")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Please try again."
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      })
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/auth/logout")
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
