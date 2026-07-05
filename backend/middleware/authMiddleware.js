import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { asyncHandler } from './errorHandler.js';
import User from '../models/User.js';

export const authMiddleware = asyncHandler(async (req, _res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authenticated', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurant-reservation-super-secret');
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User not found', 401));
  }

  const safeUser = user.toObject();
  delete safeUser.password;
  req.user = safeUser;
  next();
});

export const adminMiddleware = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
