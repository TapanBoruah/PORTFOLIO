const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');

// @route   GET api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1 });
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/achievements
// @desc    Add a new achievement
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, order } = req.body;

  if (!title || !description) {
    return res.status(400).json({ msg: 'Title and description are required' });
  }

  try {
    const newAch = new Achievement({
      title,
      description,
      order
    });

    const ach = await newAch.save();
    res.json(ach);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/achievements/:id
// @desc    Update an achievement
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, order } = req.body;

  const achFields = {};
  if (title) achFields.title = title;
  if (description) achFields.description = description;
  if (order !== undefined) achFields.order = order;

  try {
    let ach = await Achievement.findById(req.params.id);
    if (!ach) return res.status(404).json({ msg: 'Achievement not found' });

    ach = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $set: achFields },
      { new: true }
    );

    res.json(ach);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/achievements/:id
// @desc    Delete an achievement
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const ach = await Achievement.findById(req.params.id);
    if (!ach) return res.status(404).json({ msg: 'Achievement not found' });

    await Achievement.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Achievement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
