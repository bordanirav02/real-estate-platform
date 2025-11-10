const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// @route   GET /api/properties
// @desc    Get all properties with filters
// @access  Public (only shows approved) / Private for admin (shows all)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      city,
      state,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      status,
      isFeatured,
      search,
      showAll, // NEW: admin can see all properties
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Only show approved properties for public users
    // Admin can see all if showAll=true
    if (showAll !== 'true' || !req.user || req.user.role !== 'admin') {
      filter.isApproved = true;
    }

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (status) filter.status = status;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Bedrooms
    if (bedrooms) filter['features.bedrooms'] = Number(bedrooms);

    // Bathrooms
    if (bathrooms) filter['features.bathrooms'] = Number(bathrooms);

    // Area range
    if (minArea || maxArea) {
      filter['features.area'] = {};
      if (minArea) filter['features.area'].$gte = Number(minArea);
      if (maxArea) filter['features.area'].$lte = Number(maxArea);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const properties = await Property.find(filter)
      .populate('agent', 'name email phone avatar agentDetails')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name email phone avatar agentDetails');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
});

// @route   POST /api/properties
// @desc    Create new property (Agent/Admin only)
// @access  Private (Agent, Admin)
router.post('/', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      agent: req.user.id
    };

    // If admin creates property, it's auto-approved
    if (req.user.role === 'admin') {
      propertyData.isApproved = true;
    } else {
      // Agent properties need approval
      propertyData.isApproved = false;
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Agent owns property or Admin)
router.put('/:id', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Agent owns property or Admin)
router.delete('/:id', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

// @route   PUT /api/properties/:id/approve
// @desc    Approve property (Admin only)
// @access  Private (Admin)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property approved successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving property',
      error: error.message
    });
  }
});

// @route   GET /api/properties/agent/:agentId
// @desc    Get all properties by specific agent (FIXED - shows all for agent)
// @access  Public
router.get('/agent/:agentId', optionalAuth, async (req, res) => {
  try {
    const filter = { agent: req.params.agentId };
    
    // If the requesting user is the agent themselves or admin, show all properties
    // Otherwise only show approved
    if (!req.user || (req.user.id !== req.params.agentId && req.user.role !== 'admin')) {
      filter.isApproved = true;
    }

    const properties = await Property.find(filter)
      .populate('agent', 'name email phone avatar agentDetails')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent properties',
      error: error.message
    });
  }
});

module.exports = router;