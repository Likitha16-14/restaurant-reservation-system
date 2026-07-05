import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;
