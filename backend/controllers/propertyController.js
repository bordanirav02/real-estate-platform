const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    const { city, state, type, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, page = 1, limit = 12 } = req.query;

    const filter = { isApproved: true };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (type) filter.propertyType = type;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (bedrooms) filter['features.bedrooms'] = Number(bedrooms);
    if (bathrooms) filter['features.bathrooms'] = Number(bathrooms);
    if (minArea || maxArea) filter['features.area'] = {};
    if (minArea) filter['features.area'].$gte = Number(minArea);
    if (maxArea) filter['features.area'].$lte = Number(maxArea);

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching properties', error: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone avatar');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    property.views += 1;
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching property', error: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, agent: req.user.id });
    res.status(201).json({ success: true, message: 'Property created and pending approval', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating property', error: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Property updated successfully', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating property', error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting property', error: error.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, message: 'Property approved', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error approving property', error: error.message });
  }
};
