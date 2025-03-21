const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Recommendation = require('../models/Recommendation');

// Get recommended jobs for a job seeker
router.get('/jobs', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const recommendations = await Recommendation.getRecommendedJobs(req.user.id);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    res.status(500).json({ message: 'Error getting job recommendations' });
  }
});

// Get recommended job seekers for a job (employers only)
router.get('/candidates/:jobId', auth, checkRole(['employer']), async (req, res) => {
  try {
    const recommendations = await Recommendation.getJobSeekerRecommendations(req.params.jobId);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting candidate recommendations:', error);
    res.status(500).json({ message: 'Error getting candidate recommendations' });
  }
});

module.exports = router; 