const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    throw new Error('JWT_SECRET environment variable is missing or empty.');
  }
  return secret;
};

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const updateLastActiveIfNeeded = (user) => {
  if (!user || user.role === 'ADMIN') return;
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : 0;
  if (Date.now() - lastActive > FIFTEEN_MINUTES_MS) {
    const now = new Date();
    user.lastActiveAt = now;
    prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: now },
    }).catch((err) => {
      console.error('Non-blocking lastActiveAt update failed:', err.message);
    });
  }
};

const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies?.auth_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const secret = getJwtSecret();

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        lastActiveAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    updateLastActiveIfNeeded(user);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.auth_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const secret = getJwtSecret();
      try {
        const decoded = jwt.verify(token, secret);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            lastActiveAt: true,
          },
        });
        if (user) {
          updateLastActiveIfNeeded(user);
          req.user = user;
        }
      } catch {
        // Ignore invalid token in optionalAuth
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions for this role.',
      });
    }

    next();
  };
};

const verifyOwnership = (ownerId, reqUser) => {
  if (!reqUser || !ownerId) return false;
  return reqUser.id === ownerId;
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorizeRoles,
  verifyOwnership,
};
