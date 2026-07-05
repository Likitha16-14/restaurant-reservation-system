import { body, param } from 'express-validator';

export const createTableValidator = [
  body('tableNumber').isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
];

export const updateTableValidator = [
  param('id').isMongoId().withMessage('Invalid table id'),
  body('tableNumber').optional().isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];
