import AppError from '../utils/appError.js';

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate value entered' });
  }

  return res.status(500).json({ success: false, message: 'Internal server error' });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
};
