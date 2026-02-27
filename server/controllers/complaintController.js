import Complaint from '../models/Complaint.js';

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin, Warden)
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('resolvedBy', 'name')
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student complaints
// @route   GET /api/complaints/student/:studentId
// @access  Private
export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.params.studentId })
      .populate('resolvedBy', 'name')
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      });
    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Admin, Warden)
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    Object.assign(complaint, req.body);
    
    if (req.body.status === 'Resolved' && !complaint.resolvedDate) {
      complaint.resolvedDate = new Date();
      complaint.resolvedBy = req.user._id;
    }
    
    await complaint.save();
    
    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate('resolvedBy', 'name');
    
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
