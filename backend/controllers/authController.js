import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'restaurant-reservation-super-secret', { expiresIn: '7d' });

const sendTokenResponse = (user, res) => {
  const token = createToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists', 409));
  }

  const user = await User.create({ name, email, password, role: role || 'customer' });
  sendTokenResponse(user, res);
});

export const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  sendTokenResponse(user, res);
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
