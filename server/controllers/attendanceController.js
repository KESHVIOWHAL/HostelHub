import Attendance from '../models/Attendance.js';

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private (Admin, Warden)
export const getAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendance = await Attendance.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('markedBy', 'name')
      .sort('-date');
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student attendance
// @route   GET /api/attendance/student/:studentId
// @access  Private
export const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
      .sort('-date');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Warden)
export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    
    // Check if attendance already marked
    const existingAttendance = await Attendance.findOne({ studentId, date });
    
    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.markedBy = req.user._id;
      await existingAttendance.save();
      return res.json(existingAttendance);
    }

    const attendance = await Attendance.create({
      studentId,
      date,
      status,
      markedBy: req.user._id
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('markedBy', 'name');
    
    res.status(201).json(populatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk mark attendance
// @route   POST /api/attendance/bulk
// @access  Private (Warden)
export const bulkMarkAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of { studentId, date, status }
    
    const results = [];
    for (const data of attendanceData) {
      const existingAttendance = await Attendance.findOne({ 
        studentId: data.studentId, 
        date: data.date 
      });
      
      if (existingAttendance) {
        existingAttendance.status = data.status;
        existingAttendance.markedBy = req.user._id;
        await existingAttendance.save();
        results.push(existingAttendance);
      } else {
        const attendance = await Attendance.create({
          ...data,
          markedBy: req.user._id
        });
        results.push(attendance);
      }
    }
    
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
