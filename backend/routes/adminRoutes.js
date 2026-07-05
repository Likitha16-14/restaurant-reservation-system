import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  getAdminReservations,
  getReservationsByDate,
  updateReservation,
  deleteReservation,
  getDashboardStats,
} from '../controllers/reservationController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/reservations', authMiddleware, adminMiddleware, getAdminReservations);
router.get('/reservations/date/:date', authMiddleware, adminMiddleware, getReservationsByDate);
router.put('/reservations/:id', authMiddleware, adminMiddleware, updateReservation);
router.delete('/reservations/:id', authMiddleware, adminMiddleware, deleteReservation);

export default router;
