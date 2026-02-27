import express from 'express';
import {
  getPayments,
  getStudentPayments,
  createPayment,
  updatePayment,
  getPaymentStats
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getPaymentStats);
router.route('/')
  .get(protect, authorize('admin', 'warden'), getPayments)
  .post(protect, authorize('admin'), createPayment);

router.get('/student/:studentId', protect, getStudentPayments);
router.put('/:id', protect, authorize('admin'), updatePayment);

export default router;
