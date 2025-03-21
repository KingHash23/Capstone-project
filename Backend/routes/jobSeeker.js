const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// Get job seeker profile
router.get('/profile', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Create or update job seeker profile
router.post('/profile', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const {
      title,
      summary,
      experienceYears,
      educationLevel,
      skills,
      resumeUrl
    } = req.body;

    const profileData = {
      userId: req.user.id,
      title,
      summary,
      experienceYears,
      educationLevel,
      skills: Array.isArray(skills) ? skills.join(',') : skills,
      resumeUrl
    };

    const existingProfile = await JobSeekerProfile.findByUserId(req.user.id);
    let profile;

    if (existingProfile) {
      profile = await JobSeekerProfile.update(req.user.id, profileData);
    } else {
      profile = await JobSeekerProfile.create(profileData);
    }

    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Upload resume
router.post('/resume', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    // Resume upload logic will be implemented here
    // This will handle file upload to a storage service
    res.status(501).json({ message: 'Resume upload not implemented yet' });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Error uploading resume' });
  }
});

module.exports = router; 