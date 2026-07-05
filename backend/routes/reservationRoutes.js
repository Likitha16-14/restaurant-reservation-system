import express from 'express';
import {
  createReservation,
  getMyReservations,
  cancelReservation,
} from '../controllers/reservationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createReservationValidator } from '../validators/reservationValidators.js';

const router = express.Router();

router.post('/', authMiddleware, createReservationValidator, createReservation);
router.get('/my', authMiddleware, getMyReservations);
router.delete('/:id', authMiddleware, cancelReservation);

export default router;
