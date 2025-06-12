// "use client"

// import type React from "react"
// import { createContext, useContext, useEffect } from "react"
// import { RecoilRoot, useRecoilState } from "recoil"
// import { useRouter } from "next/navigation"
// // import { authState, type User } from "@/store/atoms"
// import  {authState, User}  from "@/store/atoms"
// import { useToast } from "@/components/ui/use-toast"
// import axios from "axios"

// // Configure axios defaults for cookie-based authentication
// axios.defaults.withCredentials = true
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// // Auth context interface
// interface AuthContextType {
//   user: User | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (name: string, email: string, password: string) => Promise<void>
//   logout: () => Promise<void>
// }

// // Create auth context
// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // Auth provider component that handles all authentication logic
// function AuthProviderInner({ children }: { children: React.ReactNode }) {
//   const [auth, setAuth] = useRecoilState(authState)
//   const router = useRouter()
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
//         } else {
//           setAuth({
//             user: null,
//             isAuthenticated: false,
//             isLoading: false,
//           })
//         }
//       } catch (error) {
//         console.error("Auth initialization error:", error)
//         setAuth({
//           user: null,
//           isAuthenticated: false,
//           isLoading: false,
//         })
//       }
//     }

//     initAuth()
//   }, [setAuth])

//   // Login function
//   const login = async (email: string, password: string) => {
//     try {
//       const response = await axios.post("/auth/login", { email, password })

//       if (response.data.success) {
//         setAuth({
//           user: response.data.user,
//           isAuthenticated: true,
//           isLoading: false,
//         })

//         toast({
//           title: "Login successful",
//           description: "Welcome back to Linkly!",
//         })

//         router.push("/dashboard")
//       }
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Invalid credentials. Please try again."
//       toast({
//         title: "Login failed",
//         description: message,
//         variant: "destructive",
//       })
//       throw new Error(message)
//     }
//   }

//   // Register function
//   const register = async (name: string, email: string, password: string) => {
//     try {
//       const response = await axios.post("/auth/register", { name, email, password })

//       if (response.data.success) {
//         toast({
//           title: "Registration successful",
//           description: "Welcome to Linkly! Please sign in to continue.",
//         })
//         router.push("/login")
//       }
//     } catch (error: any) {
//       const message = error.response?.data?.message || "Please check your information and try again."
//       toast({
//         title: "Registration failed",
//         description: message,
//         variant: "destructive",
//       })
//       throw new Error(message)
//     }
//   }

//   // Logout function
//   const logout = async () => {
//     try {
//       await axios.post("/auth/logout")
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       // Always clear auth state and redirect
//       setAuth({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//       })

//       toast({
//         title: "Logged out successfully",
//         description: "You have been logged out of your account.",
//       })

//       router.push("/login")
//     }
//   }

//   const contextValue: AuthContextType = {
//     user: auth.user,
//     isAuthenticated: auth.isAuthenticated,
//     isLoading: auth.isLoading,
//     login,
//     register,
//     logout,
//   }

//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
// }

// // Main auth provider with RecoilRoot
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <RecoilRoot>
//       <AuthProviderInner>{children}</AuthProviderInner>
//     </RecoilRoot>
//   )
// }

// // Custom hook to use auth context
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
