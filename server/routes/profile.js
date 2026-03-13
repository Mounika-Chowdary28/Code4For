const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  const {
    previousRole,
    experience,
    careerBreakDuration,
    desiredCareerPath,
    skills,
    certifications,
    age,
    location,
    phone,
    education,
    linkedin,
    website,
    currentSalary,
    desiredSalary,
    languages,
    availability,
    workPreference,
    relocationWillingness,
    additionalNotes
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    console.log('Updating profile for user:', req.user.id);
    console.log('Received data:', req.body);

    user.profile = {
      previousRole,
      experience,
      careerBreakDuration,
      desiredCareerPath,
      skills,
      certifications,
      age,
      location,
      phone,
      education,
      linkedin,
      website,
      currentSalary,
      desiredSalary,
      languages,
      availability,
      workPreference,
      relocationWillingness,
      additionalNotes
    };

    await user.save();
    console.log('Profile saved successfully');
    res.json(user);
  } catch (err) {
    console.error('Error saving profile:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;