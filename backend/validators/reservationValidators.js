import { body, param } from 'express-validator';

export const createReservationValidator = [
  body('reservationDate').notEmpty().withMessage('Reservation date is required'),
  body('startTime').isIn(['10:00', '12:00', '14:00', '16:00', '18:00', '20:00']).withMessage('Invalid start time'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be greater than 0'),
  body('endTime').optional(),
];

export const updateReservationValidator = [
  param('id').isMongoId().withMessage('Invalid reservation id'),
  body('status').optional().isIn(['Booked', 'Cancelled', 'Completed']).withMessage('Invalid status'),
];
