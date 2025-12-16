"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import * as api from "@/lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  username: string | null
  login: (username: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)

  const checkAuth = useCallback(async () => {
    try {
      await api.getTrainings()
      setIsAuthenticated(true)
      const savedUsername = localStorage.getItem("username")
      if (savedUsername) {
        setUsername(savedUsername)
      }
    } catch {
      setIsAuthenticated(false)
      setUsername(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (usernameInput: string, password: string) => {
    await api.login(usernameInput, password)
    setIsAuthenticated(true)
    setUsername(usernameInput)
    localStorage.setItem("username", usernameInput)
  }

  const register = async (email: string, usernameInput: string, password: string) => {
    await api.register(email, usernameInput, password)
  }

  const logout = async () => {
    await api.logout()
    setIsAuthenticated(false)
    setUsername(null)
    localStorage.removeItem("username")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
