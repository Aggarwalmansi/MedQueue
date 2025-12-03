const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const passport = require('passport');

const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName, phone, hospitalName, address, city, latitude, longitude } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction to create User and Hospital (if role is HOSPITAL)
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          fullName,
          phone
        }
      });

      if (role === 'HOSPITAL') {
        if (!hospitalName || !latitude || !longitude) {
          throw new Error('Hospital details required for HOSPITAL role');
        }
        const hospital = await prisma.hospital.create({
          data: {
            name: hospitalName,
            address: address || '',
            city: city || '',
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            phone: phone || '',
            managerId: user.id
          }
        });
        return { user, hospital };
      }

      return { user };
    });

    const accessToken = generateAccessToken(result.user);
    const refreshToken = await generateRefreshToken(result.user);

    res.status(201).json({
      message: 'User registered successfully',
      token: accessToken,
      refreshToken,
      user: result.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('[LOGIN] Login request received for email:', req.body.email);
  try {
    const { email, password } = req.body;

    console.log('[LOGIN] Finding user in database...');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('[LOGIN] User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('[LOGIN] User found:', user.id);

    console.log('[LOGIN] Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[LOGIN] Password mismatch for user:', user.id);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('[LOGIN] Password match successful');

    console.log('[LOGIN] Generating access token...');
    const accessToken = generateAccessToken(user);
    console.log('[LOGIN] Access token generated');

    console.log('[LOGIN] Generating refresh token...');
    const refreshToken = await generateRefreshToken(user);
    console.log('[LOGIN] Refresh token generated');

    res.json({
      token: accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName }
    });
    console.log('[LOGIN] Login response sent successfully');
  } catch (error) {
    console.error('[LOGIN] Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.revoked || new Date() > storedToken.expiresAt) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(storedToken.user);

    // Optionally rotate refresh token here (security best practice)
    // For now, we just return a new access token

    res.json({ token: accessToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (Revoke Refresh Token)
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true }
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // Ignore error if token not found
    res.json({ message: 'Logged out successfully' });
  }
});

// Me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Use verifyAccessToken from utils if you want, or keep using jwt.verify directly (utils is cleaner)
    // But since middleware usually handles this, we can check if we want to use middleware here.
    // For now, let's stick to the existing logic but use the secret from env.

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { hospital: true }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    // Generate tokens
    const accessToken = generateAccessToken(req.user);
    const refreshToken = await generateRefreshToken(req.user);

    // Redirect to frontend with tokens
    let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Ensure no trailing slash
    if (frontendUrl.endsWith('/')) {
      frontendUrl = frontendUrl.slice(0, -1);
    }

    console.log('[OAUTH] Redirecting to:', frontendUrl);

    // Pass both tokens in query (Note: In production, refresh token should ideally be httpOnly cookie)
    res.redirect(`${frontendUrl}/oauth-callback?token=${accessToken}&refreshToken=${refreshToken}`);
  }
);

module.exports = router;
