import AppError from '../utils/appError.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validationResult } from 'express-validator';
import Table from '../models/Table.js';

export const getTables = asyncHandler(async (_req, res) => {
  const tables = await Table.find({}).sort({ tableNumber: 1 }).lean();
  res.json({ success: true, tables });
});

export const createTable = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { tableNumber, capacity, isActive } = req.body;
  const existing = await Table.findOne({ tableNumber: Number(tableNumber) });
  if (existing) {
    return next(new AppError('Table number already exists', 409));
  }

  const table = await Table.create({
    tableNumber: Number(tableNumber),
    capacity: Number(capacity),
    isActive,
  });
  res.status(201).json({ success: true, table });
});

export const updateTable = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const table = await Table.findById(req.params.id);
  if (!table) return next(new AppError('Table not found', 404));

  const { tableNumber, capacity, isActive } = req.body;
  if (tableNumber !== undefined && Number(tableNumber) !== table.tableNumber) {
    const duplicate = await Table.findOne({ tableNumber: Number(tableNumber) });
    if (duplicate) return next(new AppError('Table number already exists', 409));
  }

  const updatedTable = await Table.findByIdAndUpdate(
    req.params.id,
    {
      tableNumber: tableNumber !== undefined ? Number(tableNumber) : table.tableNumber,
      capacity: capacity !== undefined ? Number(capacity) : table.capacity,
      isActive: isActive !== undefined ? isActive : table.isActive,
    },
    { new: true, runValidators: true }
  );
  res.json({ success: true, table: updatedTable });
});

export const deleteTable = asyncHandler(async (req, res, next) => {
  const table = await Table.findById(req.params.id);
  if (!table) return next(new AppError('Table not found', 404));

  await Table.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Table deleted' });
});
