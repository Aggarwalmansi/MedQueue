"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchCurrentUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        localStorage.removeItem("token")
      }
    } catch (err) {
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, role) => {
    setError(null)
    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await response.json()

      if (data.success) {
        localStorage.setItem("token", data.data.token)
        setUser({
          id: data.data.id,
          email: data.data.email,
          role: data.data.role,
        })
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
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (data.success) {
        localStorage.setItem("token", data.data.token)
        setUser({
          id: data.data.id,
          email: data.data.email,
          role: data.data.role,
        })
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

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
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
