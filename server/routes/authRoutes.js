import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { getUsers, getUser, updateUser, deleteUser, getUserStats } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// User management routes (Admin only)
router.get('/users/stats', protect, authorize('admin'), getUserStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.get('/users/:id', protect, authorize('admin'), getUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
