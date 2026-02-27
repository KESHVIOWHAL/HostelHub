import Payment from '../models/Payment.js';
import Student from '../models/Student.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin, Warden)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student payments
// @route   GET /api/payments/student/:studentId
// @access  Private
export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId })
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Admin)
export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    const populatedPayment = await Payment.findById(payment._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      });
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private (Admin)
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    Object.assign(payment, req.body);
    await payment.save();
    
    const updatedPayment = await Payment.findById(payment._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      });
    
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment stats
// @route   GET /api/payments/stats
// @access  Private (Admin)
export const getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await Payment.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
