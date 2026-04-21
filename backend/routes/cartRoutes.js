const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// GET /api/cart — get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.property');
    res.status(200).json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

// POST /api/cart/:propertyId — add property to cart
router.post('/:propertyId', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ property: req.params.propertyId }] });
    } else {
      const alreadyInCart = cart.items.some(item => item.property.toString() === req.params.propertyId);
      if (alreadyInCart) {
        return res.status(400).json({ success: false, message: 'Property already in cart' });
      }
      cart.items.push({ property: req.params.propertyId });
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Added to cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
  }
});

// DELETE /api/cart/:propertyId — remove property from cart
router.delete('/:propertyId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.property.toString() !== req.params.propertyId);
    await cart.save();

    res.status(200).json({ success: true, message: 'Removed from cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from cart', error: error.message });
  }
});

module.exports = router;
