const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Add a new project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, image, githubUrl, liveUrl, tags } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({ msg: 'Title, description, and image URL are required' });
  }

  try {
    const newProject = new Project({
      title,
      description,
      image,
      githubUrl,
      liveUrl,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, image, githubUrl, liveUrl, tags } = req.body;

  const projectFields = {};
  if (title) projectFields.title = title;
  if (description) projectFields.description = description;
  if (image !== undefined) projectFields.image = image;
  if (githubUrl !== undefined) projectFields.githubUrl = githubUrl;
  if (liveUrl !== undefined) projectFields.liveUrl = liveUrl;
  if (tags !== undefined) {
    projectFields.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
  }

  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    await Project.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
