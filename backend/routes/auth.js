const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { hashPassword, comparePassword } = require("../utils/password.js")
const { generateToken } = require("../utils/jwt.js")
const { authMiddleware } = require("../middleware/auth.js")

const router = express.Router()
const prisma = new PrismaClient()

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 8
}

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      })
    }

    const validRoles = ["USER", "HOSPITAL_MANAGER", "ADMIN"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be USER, HOSPITAL_MANAGER, or ADMIN",
      })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    })

    const token = generateToken(user.id, user.role)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({
      success: false,
      message: "Error during signup",
    })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    const token = generateToken(user.id, user.role)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Error during login",
    })
  }
})

// GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ success: false, message: "Error fetching user data" })
  }
})

// LOGOUT
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Error during logout" })
  }
})

// VERIFY TOKEN
router.post("/verify-token", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Token is valid", data: req.user })
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" })
  }
})

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      })
    }

    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    console.log(`Reset token for ${email}: ${resetToken}`)

    res.status(200).json({
      success: true,
      message: "Password reset instructions sent to email",
      testToken: resetToken,
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ success: false, message: "Error processing request" })
  }
})

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required",
      })
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.resetToken !== resetToken) {
      return res.status(400).json({ success: false, message: "Invalid reset token" })
    }

    if (new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ success: false, message: "Reset token has expired" })
    }

    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    })

    res.status(200).json({ success: true, message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ success: false, message: "Error resetting password" })
  }
})

module.exports = router
