const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const auth = require('../middleware/auth');

// @route   GET api/education
// @desc    Get all education records
// @access  Public
router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/education
// @desc    Add a new education record
// @access  Private
router.post('/', auth, async (req, res) => {
  const { institution, degree, duration, grade, order } = req.body;

  if (!institution || !degree || !duration) {
    return res.status(400).json({ msg: 'Institution, degree, and duration are required' });
  }

  try {
    const newEd = new Education({
      institution,
      degree,
      duration,
      grade,
      order
    });

    const ed = await newEd.save();
    res.json(ed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/education/:id
// @desc    Update an education record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { institution, degree, duration, grade, order } = req.body;

  const edFields = {};
  if (institution) edFields.institution = institution;
  if (degree) edFields.degree = degree;
  if (duration) edFields.duration = duration;
  if (grade !== undefined) edFields.grade = grade;
  if (order !== undefined) edFields.order = order;

  try {
    let ed = await Education.findById(req.params.id);
    if (!ed) return res.status(404).json({ msg: 'Education record not found' });

    ed = await Education.findByIdAndUpdate(
      req.params.id,
      { $set: edFields },
      { new: true }
    );

    res.json(ed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/education/:id
// @desc    Delete an education record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const ed = await Education.findById(req.params.id);
    if (!ed) return res.status(404).json({ msg: 'Education record not found' });

    await Education.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Education record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
