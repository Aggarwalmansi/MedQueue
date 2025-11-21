"use client"
import React from "react"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedRefreshToken = localStorage.getItem("refreshToken")

    if (storedToken) {
      setToken(storedToken)
      if (storedRefreshToken) setRefreshToken(storedRefreshToken)
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  // Helper to save tokens
  const saveTokens = (accessToken, newRefreshToken) => {
    localStorage.setItem("token", accessToken)
    setToken(accessToken)

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken)
      setRefreshToken(newRefreshToken)
    }
  }

  const verifyToken = async (authToken) => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Token invalid/expired, try refresh
        await tryRefreshToken()
      }
    } catch (err) {
      await tryRefreshToken()
    } finally {
      setLoading(false)
    }
  }

  const tryRefreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken")
    if (!storedRefreshToken) {
      logout()
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      })

      if (response.ok) {
        const data = await response.json()
        saveTokens(data.token, null) // Keep existing refresh token if not rotated
        // Retry fetching user
        const meResponse = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${data.token}` }
        })
        if (meResponse.ok) {
          const userData = await meResponse.json()
          setUser(userData.user)
        }
      } else {
        logout()
      }
    } catch (e) {
      logout()
    }
  }

  const signup = async (userData) => {
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (response.ok) {
        saveTokens(data.token, data.refreshToken)
        setUser(data.user)
        return { success: true }
      } else {
        setError(data.message)
        return { success: false, message: data.message }
      }
    } catch (err) {
      const message = "Signup failed. Please try again."
      setError(message)
      return { success: false, message }
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        saveTokens(data.token, data.refreshToken)
        setUser(data.user)
        return { success: true }
      } else {
        setError(data.message)
        return { success: false, message: data.message }
      }
    } catch (err) {
      const message = "Login failed. Please try again."
      setError(message)
      return { success: false, message }
    }
  }

  const handleGoogleCallback = async (newToken, newRefreshToken) => {
    saveTokens(newToken, newRefreshToken)
    await verifyToken(newToken)
  }

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem("refreshToken")
    if (storedRefreshToken) {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefreshToken })
        })
      } catch (e) {
        console.error("Logout error", e)
      }
    }

    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signup,
        login,
        handleGoogleCallback,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}