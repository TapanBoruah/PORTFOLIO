const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ proficiency: -1, name: 1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/skills
// @desc    Add a new skill
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, category, icon, proficiency } = req.body;

  if (!name || !icon) {
    return res.status(400).json({ msg: 'Name and icon path are required' });
  }

  try {
    const newSkill = new Skill({
      name,
      category,
      icon,
      proficiency
    });

    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, category, icon, proficiency } = req.body;

  // Build skill object
  const skillFields = {};
  if (name) skillFields.name = name;
  if (category) skillFields.category = category;
  if (icon !== undefined) skillFields.icon = icon;
  if (proficiency !== undefined) skillFields.proficiency = proficiency;

  try {
    let skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: 'Skill not found' });

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: skillFields },
      { new: true }
    );

    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ msg: 'Skill not found' });

    await Skill.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Skill removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
