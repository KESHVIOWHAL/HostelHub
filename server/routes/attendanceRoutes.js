import express from 'express';
import {
  getAttendance,
  getStudentAttendance,
  markAttendance,
  bulkMarkAttendance
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'warden'), getAttendance)
  .post(protect, authorize('warden', 'admin'), markAttendance);

router.post('/bulk', protect, authorize('warden', 'admin'), bulkMarkAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

export default router;
