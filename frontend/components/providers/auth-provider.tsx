"use client"

import type React from "react"

import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { authState } from "@/store/atoms/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useRecoilState(authState)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setAuth((prev) => ({ ...prev, isLoading: false }))
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/getme`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAuth({
            user: data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          localStorage.removeItem("token")
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("token")
        setAuth({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    initAuth()
  }, [setAuth])

  return <>{children}</>
}
