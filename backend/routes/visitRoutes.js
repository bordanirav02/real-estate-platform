const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// POST /api/visits — schedule a visit
router.post('/', protect, roleCheck('customer'), async (req, res) => {
  try {
    const { propertyId, scheduledDate, timeSlot, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const visit = await Visit.create({
      property: propertyId,
      customer: req.user.id,
      agent: property.agent,
      scheduledDate,
      timeSlot,
      notes
    });

    res.status(201).json({ success: true, message: 'Visit scheduled successfully', data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error scheduling visit', error: error.message });
  }
});

// GET /api/visits/my — get customer's visits
router.get('/my', protect, async (req, res) => {
  try {
    const visits = await Visit.find({ customer: req.user.id })
      .populate('property', 'title location price images')
      .populate('agent', 'name email phone')
      .sort({ scheduledDate: -1 });
    res.status(200).json({ success: true, count: visits.length, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching visits', error: error.message });
  }
});

// GET /api/visits/agent — get agent's scheduled visits
router.get('/agent', protect, roleCheck('agent'), async (req, res) => {
  try {
    const visits = await Visit.find({ agent: req.user.id })
      .populate('property', 'title location price')
      .populate('customer', 'name email phone')
      .sort({ scheduledDate: 1 });
    res.status(200).json({ success: true, count: visits.length, data: visits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching visits', error: error.message });
  }
});

// PUT /api/visits/:id — update visit status (agent/admin)
router.put('/:id', protect, roleCheck('agent', 'admin'), async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.status(200).json({ success: true, message: 'Visit status updated', data: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating visit', error: error.message });
  }
});

// DELETE /api/visits/:id — cancel a visit
router.delete('/:id', protect, async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });

    if (visit.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await visit.deleteOne();
    res.status(200).json({ success: true, message: 'Visit cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling visit', error: error.message });
  }
});

module.exports = router;
