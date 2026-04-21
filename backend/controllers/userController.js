const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, isVerified },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { propertyId } = req.params;

    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ success: false, message: 'Property already in favorites' });
    }

    user.favorites.push(propertyId);
    await user.save();
    res.status(200).json({ success: true, message: 'Added to favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding favorite', error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.propertyId);
    await user.save();
    res.status(200).json({ success: true, message: 'Removed from favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing favorite', error: error.message });
  }
};
