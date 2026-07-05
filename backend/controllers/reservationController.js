import AppError from '../utils/appError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import User from '../models/User.js';

const SLOT_DURATION_HOURS = 2;
const VALID_TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

const isPastReservation = (reservationDate, startTime) => {
  const now = new Date();
  const reservationDateTime = new Date(`${reservationDate}T${startTime}:00`);
  return reservationDateTime < now;
};

const getEndTime = (startTime) => {
  const [hours] = startTime.split(':').map(Number);
  return `${String(hours + SLOT_DURATION_HOURS).padStart(2, '0')}:00`;
};

const getTimeInMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const isOverlap = (startA, endA, startB, endB) => {
  const startATime = getTimeInMinutes(startA);
  const endATime = getTimeInMinutes(endA);
  const startBTime = getTimeInMinutes(startB);
  const endBTime = getTimeInMinutes(endB);
  return startATime < endBTime && endATime > startBTime;
};

const enrichReservations = async (reservations) => {
  const users = await User.find({}).lean();
  const tables = await Table.find({}).lean();
  const userMap = new Map(users.map((user) => [user._id.toString(), user]));
  const tableMap = new Map(tables.map((table) => [table._id.toString(), table]));

  return reservations.map((reservation) => ({
    ...reservation,
    customer: userMap.get(reservation.customer?.toString()) || null,
    table: tableMap.get(reservation.table?.toString()) || null,
  }));
};

export const createReservation = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { reservationDate, startTime, guests } = req.body;
  if (!VALID_TIMES.includes(startTime)) {
    return next(new AppError('Invalid reservation time slot', 400));
  }
  if (isPastReservation(reservationDate, startTime)) {
    return next(new AppError('Reservation date cannot be in the past', 400));
  }

  const endTime = getEndTime(startTime);
  const tables = await Table.find({ isActive: true }).sort({ capacity: 1 }).lean();
  const bookedReservations = await Reservation.find({ reservationDate, status: 'Booked' }).lean();
  const availableTables = [];

  for (const table of tables) {
    if (table.capacity < guests) continue;

    const hasConflict = bookedReservations.some(
      (reservation) =>
        reservation.table?.toString() === table._id.toString() &&
        isOverlap(startTime, endTime, reservation.startTime, reservation.endTime)
    );

    if (!hasConflict) {
      availableTables.push(table);
    }
  }

  if (!availableTables.length) {
    return next(new AppError('No table available for the selected time slot', 400));
  }

  const selectedTable = availableTables[0];
  const reservation = await Reservation.create({
    customer: req.user._id,
    table: selectedTable._id,
    reservationDate,
    startTime,
    endTime,
    guests,
    status: 'Booked',
  });

  res.status(201).json({ success: true, reservation });
});

export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ customer: req.user._id }).sort({ reservationDate: 1, startTime: 1 }).lean();
  const enriched = await enrichReservations(reservations);
  res.json({ success: true, reservations: enriched });
});

export const cancelReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError('Reservation not found', 404));
  if (reservation.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, { status: 'Cancelled' }, { new: true });
  res.json({ success: true, reservation: updatedReservation });
});

export const getAdminReservations = asyncHandler(async (_req, res) => {
  const reservations = await Reservation.find({}).sort({ createdAt: -1 }).lean();
  const enriched = await enrichReservations(reservations);
  res.json({ success: true, reservations: enriched });
});

export const getReservationsByDate = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ reservationDate: req.params.date }).sort({ startTime: 1 }).lean();
  const enriched = await enrichReservations(reservations);
  res.json({ success: true, reservations: enriched });
});

export const updateReservation = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError('Reservation not found', 404));

  const { status } = req.body;
  const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, { status: status || reservation.status }, { new: true });
  res.json({ success: true, reservation: updatedReservation });
});

export const deleteReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError('Reservation not found', 404));
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Reservation deleted' });
});

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalReservations = await Reservation.countDocuments();
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = await Reservation.countDocuments({ reservationDate: today });
  const cancelledReservations = await Reservation.countDocuments({ status: 'Cancelled' });
  const availableTables = await Table.countDocuments({ isActive: true });
  const bookedTables = await Reservation.countDocuments({ status: 'Booked' });
  const recentReservations = await Reservation.find({}).sort({ createdAt: -1 }).limit(5).lean();
  const enriched = await enrichReservations(recentReservations);

  res.json({
    success: true,
    stats: {
      totalCustomers,
      totalReservations,
      todayReservations,
      cancelledReservations,
      availableTables,
      bookedTables,
    },
    recentReservations: enriched,
  });
});
