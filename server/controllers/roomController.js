import Room from '../models/Room.js';
import Student from '../models/Student.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('wardenId', 'name email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('wardenId', 'name email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get students in this room
    const students = await Student.find({ roomId: room._id }).populate('userId', 'name email');
    
    res.json({ ...room.toObject(), students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin)
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin, Warden)
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    Object.assign(room, req.body);
    await room.save();
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room has students
    const studentsInRoom = await Student.countDocuments({ roomId: room._id });
    if (studentsInRoom > 0) {
      return res.status(400).json({ message: 'Cannot delete room with students' });
    }

    await room.deleteOne();
    res.json({ message: 'Room removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
