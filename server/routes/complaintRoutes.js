import express from 'express';
import {
  getComplaints,
  getStudentComplaints,
  createComplaint,
  updateComplaint,
  deleteComplaint
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'warden'), getComplaints)
  .post(protect, createComplaint);

router.get('/student/:studentId', protect, getStudentComplaints);

router.route('/:id')
  .put(protect, authorize('admin', 'warden'), updateComplaint)
  .delete(protect, authorize('admin'), deleteComplaint);

export default router;
