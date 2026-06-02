const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// @route   POST api/messages
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please include your name, email, and message' });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      subject,
      message
    });

    const msg = await newMessage.save();
    res.json({ success: true, msg });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/messages
// @desc    Get all contact messages
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    await Message.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Message removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
