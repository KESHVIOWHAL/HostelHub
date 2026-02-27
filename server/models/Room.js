import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  blockName: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  occupiedBeds: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Full', 'Maintenance'],
    default: 'Available'
  },
  wardenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for available beds
roomSchema.virtual('availableBeds').get(function() {
  return this.capacity - this.occupiedBeds;
});

// Update status based on occupancy
roomSchema.pre('save', function(next) {
  if (this.occupiedBeds >= this.capacity) {
    this.status = 'Full';
  } else if (this.status !== 'Maintenance') {
    this.status = 'Available';
  }
  next();
});

roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

export default mongoose.model('Room', roomSchema);
