import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date
  },
  guardianName: {
    type: String
  },
  guardianPhone: {
    type: String
  },
  address: {
    type: String
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  course: {
    type: String
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);
