
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

 const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "30d" })
}

 const decodeToken = (token) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}


module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  decodeToken,
}