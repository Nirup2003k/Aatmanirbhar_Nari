const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'aatmanirbhar_nari_jwt_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const setAuthCookie = (res, token) => {
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000, // 1 hour in ms
    path: '/',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Strict ADMIN registration check
    if (role && String(role).toUpperCase() === 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Admin registration is not allowed.',
      });
    }

    let targetRole = 'CUSTOMER';
    if (role) {
      const upperRole = String(role).toUpperCase();
      if (upperRole === 'ENTREPRENEUR') {
        targetRole = 'ENTREPRENEUR';
      } else if (upperRole === 'CUSTOMER') {
        targetRole = 'CUSTOMER';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified. Only CUSTOMER or ENTREPRENEUR are allowed.',
        });
      }
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (password.length < 10 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 10 and 128 characters.',
      });
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered.',
      });
    }

    const passwordHash = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || '').trim(),
        passwordHash,
        role: targetRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, String(password));

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    setAuthCookie(res, token);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
