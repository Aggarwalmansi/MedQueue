const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Generate Access Token (Short Lived: 15m)
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token (Long Lived: 7d)
const generateRefreshToken = async (user, ipAddress) => {
  // Create a random token string
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Save to DB
  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    }
  });

  return refreshToken.token;
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
};