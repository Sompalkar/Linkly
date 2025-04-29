"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, loginUser, registerUser, logoutUser } from "@/lib/api"

type User = {
  id: string
  name: string
  email: string
  role: string
  isVerified: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const data = await getCurrentUser(authToken)
      if (data.success) {
        setUser(data.user)
      } else {
        // Token invalid, clear it
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("token", data.token)
  }

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("token", data.token)
  }

  const logout = async () => {
    try {
      if (token) {
        await logoutUser(token)
      }
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      setToken(null)
      window.location.href = "/login"
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
