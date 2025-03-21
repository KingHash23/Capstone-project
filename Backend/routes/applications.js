const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Submit job application (job seekers only)
router.post('/:jobId', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    const hasApplied = await Application.hasApplied(jobId, req.user.id);
    if (hasApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      jobSeekerId: req.user.id,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Error submitting application' });
  }
});

// Get job seeker's applications
router.get('/my-applications', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const applications = await Application.findByJobSeeker(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Get applications for a specific job (employers only)
router.get('/job/:jobId', auth, checkRole(['employer']), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify that the employer owns this job listing
    if (job.company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.findByJob(jobId);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching job applications' });
  }
});

// Update application status (employers only)
router.patch('/:id/status', auth, checkRole(['employer']), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.job_id);
    if (job.company_id !== req.user.company_id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updatedApplication = await Application.updateStatus(req.params.id, req.body.status);
    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Error updating application status' });
  }
});

// Check if user has already applied for a job
router.get('/:jobId/check', auth, checkRole(['job_seeker']), async (req, res) => {
  try {
    const hasApplied = await Application.hasApplied(req.params.jobId, req.user.id);
    res.json({ hasApplied });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ message: 'Error checking application status' });
  }
});

module.exports = router; 