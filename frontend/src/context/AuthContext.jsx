"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (authToken) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      } else {
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (err) {
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentUser = async (authToken) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (err) {
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, role) => {
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await response.json()

      if (data.success) {
        const newToken = data.data.token
        localStorage.setItem("token", newToken)
        setToken(newToken)
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (data.success) {
        const newToken = data.data.token
        localStorage.setItem("token", newToken)
        setToken(newToken)
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
    setToken(null)
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
