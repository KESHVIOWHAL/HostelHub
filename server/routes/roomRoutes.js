import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(protect, getRoom)
  .put(protect, authorize('admin', 'warden'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

export default router;
