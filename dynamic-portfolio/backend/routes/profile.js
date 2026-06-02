const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// @route   GET api/profile
// @desc    Get profile details
// @access  Public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // If no profile entry exists in the database, seed a default one
      profile = new Profile();
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile
// @desc    Update profile details
// @access  Private (Admin only)
router.put('/', auth, async (req, res) => {
  const { 
    fullName, 
    title, 
    tagline, 
    avatar, 
    aboutImage, 
    aboutText1, 
    aboutText2, 
    aboutText3, 
    cgpa, 
    projectsCount, 
    email, 
    location, 
    sector, 
    githubUrl, 
    linkedinUrl, 
    instagramUrl, 
    facebookUrl,
    cvUrl
  } = req.body;

  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    // Update fields if provided
    if (fullName !== undefined) profile.fullName = fullName;
    if (title !== undefined) profile.title = title;
    if (tagline !== undefined) profile.tagline = tagline;
    if (avatar !== undefined) profile.avatar = avatar;
    if (aboutImage !== undefined) profile.aboutImage = aboutImage;
    if (aboutText1 !== undefined) profile.aboutText1 = aboutText1;
    if (aboutText2 !== undefined) profile.aboutText2 = aboutText2;
    if (aboutText3 !== undefined) profile.aboutText3 = aboutText3;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (projectsCount !== undefined) profile.projectsCount = projectsCount;
    if (email !== undefined) profile.email = email;
    if (location !== undefined) profile.location = location;
    if (sector !== undefined) profile.sector = sector;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (instagramUrl !== undefined) profile.instagramUrl = instagramUrl;
    if (facebookUrl !== undefined) profile.facebookUrl = facebookUrl;
    if (cvUrl !== undefined) profile.cvUrl = cvUrl;

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
