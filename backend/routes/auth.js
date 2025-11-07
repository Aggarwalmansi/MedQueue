
const express = require("express")
const { PrismaClient } = require("@prisma/client")
const {hashPassword, comparePassword} = require("../utils/password")
const {generateToken} = require("../utils/jwt")
const {authMiddleware} = require("../middleware/auth")

const router = express.Router()
const prisma = new PrismaClient()

// Validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 8
}


router.post("/test", (req, res) => {
  res.json({ message: "Test route is working!" })
})

router.post("/signup",async (req, res) => {
  console.log("Signup request body:", req.body);
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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      })
    }

    const hashedPassword = await hashPassword(password)

    console.log(hashedPassword, email, role);

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }


    const user = await prisma.user.findUnique({
      where: { email },
    })

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

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    })
  }
})


module.exports = router 