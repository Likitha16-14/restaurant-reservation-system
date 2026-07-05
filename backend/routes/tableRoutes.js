import express from 'express';
import { getTables, createTable, updateTable, deleteTable } from '../controllers/tableController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { createTableValidator, updateTableValidator } from '../validators/tableValidators.js';

const router = express.Router();

router.get('/', authMiddleware, getTables);
router.post('/', authMiddleware, adminMiddleware, createTableValidator, createTable);
router.put('/:id', authMiddleware, adminMiddleware, updateTableValidator, updateTable);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTable);

export default router;
