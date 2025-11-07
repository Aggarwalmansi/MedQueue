
const {verifyToken} = require("../utils/jwt")

 const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication error",
    })
  }
}

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!allowedRoles.includes(req.user.role)) {
      console.log(req.user.role)
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      })
    }
    next()
  }
}

module.exports = {
  authMiddleware,
  roleMiddleware,
}
