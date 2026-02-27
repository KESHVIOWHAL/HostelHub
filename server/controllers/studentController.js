import Student from '../models/Student.js';
import User from '../models/User.js';
import Room from '../models/Room.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin, Warden)
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('userId', 'name email phone')
      .populate('roomId', 'roomNumber blockName');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('roomId', 'roomNumber blockName capacity occupiedBeds');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone, studentId, dateOfBirth, guardianName, guardianPhone, address, course, year } = req.body;

    // Create user first
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      phone
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      studentId,
      dateOfBirth,
      guardianName,
      guardianPhone,
      address,
      course,
      year
    });

    const populatedStudent = await Student.findById(student._id).populate('userId', 'name email phone');
    res.status(201).json(populatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, phone, ...studentData } = req.body;

    // Update user data
    if (name || email || phone) {
      await User.findByIdAndUpdate(student.userId, { name, email, phone });
    }

    // Update student data
    Object.assign(student, studentData);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate('userId', 'name email phone')
      .populate('roomId', 'roomNumber blockName');
    
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // If student has room, decrease occupancy
    if (student.roomId) {
      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
    }

    await User.findByIdAndDelete(student.userId);
    await student.deleteOne();

    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign room to student
// @route   PUT /api/students/:id/assign-room
// @access  Private (Admin)
export const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.occupiedBeds >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Remove from old room if exists
    if (student.roomId) {
      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
    }

    // Assign new room
    student.roomId = roomId;
    await student.save();

    // Increase occupancy
    room.occupiedBeds += 1;
    await room.save();

    const updatedStudent = await Student.findById(student._id)
      .populate('userId', 'name email phone')
      .populate('roomId', 'roomNumber blockName capacity occupiedBeds');
    
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
