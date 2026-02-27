import User from '../models/User.js';

// @desc    Get all users (with optional role filter)
// @route   GET /api/auth/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/auth/users/:id
// @access  Private (Admin)
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/auth/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    Object.assign(user, updateData);
    
    // Update password if provided
    if (password) {
      user.password = password;
    }
    
    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/auth/users/stats
// @access  Private (Admin)
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const wardenCount = await User.countDocuments({ role: 'warden' });
    const studentCount = await User.countDocuments({ role: 'student' });
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      totalUsers,
      adminCount,
      wardenCount,
      studentCount,
      activeUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
