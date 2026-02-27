import express from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  assignRoom
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'warden'), getStudents)
  .post(protect, authorize('admin'), createStudent);

router.route('/:id')
  .get(protect, getStudent)
  .put(protect, authorize('admin'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

router.put('/:id/assign-room', protect, authorize('admin'), assignRoom);

export default router;
