import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  category: {
    type: String,
    enum: ['Maintenance', 'Food', 'Cleanliness', 'Security', 'Other'],
    default: 'Other'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Complaint', complaintSchema);
