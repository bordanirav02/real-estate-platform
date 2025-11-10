const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/chat/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email avatar role')
    .populate('receiver', 'name email avatar role')
    .sort('-createdAt');

    // Group by conversation partner
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === userId ? 
        msg.receiver._id.toString() : msg.sender._id.toString();
      
      if (!conversationsMap.has(partnerId)) {
        const partner = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        
        // Count unread messages from this partner
        const unreadCount = messages.filter(m => 
          m.sender._id.toString() === partnerId && 
          m.receiver._id.toString() === userId && 
          !m.isRead
        ).length;
        
        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: unreadCount
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// @route   GET /api/chat/messages/:userId
// @desc    Get chat messages between current user and another user
// @access  Private
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'name email avatar role')
    .populate('receiver', 'name email avatar role')
    .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// @route   POST /api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { receiver, message, property } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      message: message.trim(),
      property
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
});

module.exports = router;