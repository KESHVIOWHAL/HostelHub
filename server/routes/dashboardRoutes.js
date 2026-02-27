import express from 'express';
import {
  getAdminDashboard,
  getWardenDashboard,
  getStudentDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/warden', protect, authorize('warden'), getWardenDashboard);
router.get('/student/:studentId', protect, getStudentDashboard);

export default router;
