// "use client"

// import type React from "react"
// import { useEffect } from "react"
// import { RecoilRoot, useRecoilState } from "recoil"
// import { useRouter, usePathname } from "next/navigation"
// import { authState } from "@/store/atoms"
// import { useToast } from "@/components/ui/use-toast"
// import axios from "axios"

// // Configure axios defaults for cookie-based authentication
// axios.defaults.withCredentials = true
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// // Auth provider component that handles persistent login
// function AuthProviderInner({ children }: { children: React.ReactNode }) {
//   const [auth, setAuth] = useRecoilState(authState)
//   const router = useRouter()
//   const pathname = usePathname()
//   const { toast } = useToast()

//   // Initialize authentication on app load
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         // Check if user is authenticated via cookie
//         const response = await axios.get("/auth/getme")

//         if (response.data.success) {
//           setAuth({
//             user: response.data.user,
//             isAuthenticated: true,
//             isLoading: false,
//           })

//           // Redirect to dashboard if on auth pages
//           if (pathname === "/login" || pathname === "/register") {
//             router.push("/dashboard")
//           }
//         } else {
//           setAuth({
//             user: null,
//             isAuthenticated: false,
//             isLoading: false,
//           })

//           // Redirect to login if on protected pages
//           if (pathname?.startsWith("/dashboard")) {
//             router.push("/login")
//           }
//         }
//       } catch (error) {
//         console.error("Auth initialization error:", error)
//         setAuth({
//           user: null,
//           isAuthenticated: false,
//           isLoading: false,
//         })

//         // Redirect to login if on protected pages
//         if (pathname?.startsWith("/dashboard")) {
//           router.push("/login")
//         }
//       }
//     }

//     initAuth()
//   }, [setAuth, router, pathname])

//   return <>{children}</>
// }

// // Main auth provider with RecoilRoot
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <RecoilRoot>
//       <AuthProviderInner>{children}</AuthProviderInner>
//     </RecoilRoot>
//   )
// }
