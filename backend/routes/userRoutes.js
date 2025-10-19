const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort('-createdAt');

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin or viewing own profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// @route   POST /api/users/:id/favorites/:propertyId
// @desc    Add property to favorites
// @access  Private
router.post('/:id/favorites/:propertyId', protect, async (req, res) => {
  try {
    // Check if user is updating own favorites
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if property already in favorites
    if (user.favorites.includes(req.params.propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    user.favorites.push(req.params.propertyId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property added to favorites',
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/:id/favorites/:propertyId
// @desc    Remove property from favorites
// @access  Private
router.delete('/:id/favorites/:propertyId', protect, async (req, res) => {
  try {
    // Check if user is updating own favorites
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.propertyId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
});

// @route   GET /api/users/:id/favorites
// @desc    Get user's favorite properties
// @access  Private
router.get('/:id/favorites', protect, async (req, res) => {
  try {
    // Check if user is viewing own favorites
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.params.id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'agent',
          select: 'name email phone'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
});

module.exports = router;