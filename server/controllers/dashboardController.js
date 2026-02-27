import Student from '../models/Student.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';
import Complaint from '../models/Complaint.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalBeds: { $sum: '$capacity' },
          occupiedBeds: { $sum: '$occupiedBeds' }
        }
      }
    ]);

    const availableBeds = roomStats[0] ? roomStats[0].totalBeds - roomStats[0].occupiedBeds : 0;

    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = paymentStats.find(p => p._id === 'Paid')?.total || 0;
    const pendingFees = paymentStats.find(p => p._id === 'Pending')?.total || 0;

    const complaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const pendingComplaints = complaintStats.find(c => c._id === 'Pending')?.count || 0;

    res.json({
      totalStudents,
      totalRooms,
      availableBeds,
      totalRevenue,
      pendingFees,
      pendingComplaints,
      occupancyRate: roomStats[0] ? ((roomStats[0].occupiedBeds / roomStats[0].totalBeds) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get warden dashboard stats
// @route   GET /api/dashboard/warden
// @access  Private (Warden)
export const getWardenDashboard = async (req, res) => {
  try {
    const assignedRooms = await Room.find({ wardenId: req.user._id });
    const roomIds = assignedRooms.map(room => room._id);
    
    const studentsInBlock = await Student.countDocuments({ roomId: { $in: roomIds } });
    
    const complaints = await Complaint.find({
      studentId: { $in: await Student.find({ roomId: { $in: roomIds } }).distinct('_id') }
    });

    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;

    res.json({
      assignedRooms: assignedRooms.length,
      studentsInBlock,
      totalComplaints: complaints.length,
      pendingComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student/:studentId
// @access  Private (Student)
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('roomId', 'roomNumber blockName')
      .populate('userId', 'name email');

    const payments = await Payment.find({ studentId: req.params.studentId });
    const pendingPayments = payments.filter(p => p.status === 'Pending');
    
    const complaints = await Complaint.find({ studentId: req.params.studentId });
    const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;

    res.json({
      student,
      totalPayments: payments.length,
      pendingPayments: pendingPayments.length,
      totalComplaints: complaints.length,
      pendingComplaints
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
