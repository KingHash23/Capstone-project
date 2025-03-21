const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Job = require('../models/Job');
const Company = require('../models/Company');

// Get all jobs with advanced filters
router.get('/', async (req, res) => {
  try {
    const filters = {
      title: req.query.title,
      location: req.query.location,
      jobType: req.query.jobType,
      industry: req.query.industry,
      experienceLevel: req.query.experienceLevel,
      minSalary: req.query.minSalary ? parseInt(req.query.minSalary) : null,
      maxSalary: req.query.maxSalary ? parseInt(req.query.maxSalary) : null,
      skills: req.query.skills ? req.query.skills.split(',') : null
    };

    const jobs = await Job.findAll(filters);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Error fetching job' });
  }
});

// Create new job posting (employers only)
router.post('/', auth, checkRole(['employer']), async (req, res) => {
  try {
    const company = await Company.findByEmployerId(req.user.id);
    if (!company) {
      return res.status(400).json({ message: 'Please create a company profile first' });
    }

    const jobData = {
      companyId: company.id,
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      salaryRange: req.body.salaryRange,
      location: req.body.location,
      jobType: req.body.jobType,
      experienceLevel: req.body.experienceLevel,
      skills: Array.isArray(req.body.skills) ? req.body.skills.join(',') : req.body.skills,
      minSalary: req.body.minSalary,
      maxSalary: req.body.maxSalary
    };

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Error creating job posting' });
  }
});

// Update job posting (employers only)
router.put('/:id', auth, checkRole(['employer']), async (req, res) => {
  try {
    const company = await Company.findByEmployerId(req.user.id);
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company_id !== company.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.update(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      salaryRange: req.body.salaryRange,
      location: req.body.location,
      jobType: req.body.jobType,
      experienceLevel: req.body.experienceLevel,
      skills: Array.isArray(req.body.skills) ? req.body.skills.join(',') : req.body.skills,
      minSalary: req.body.minSalary,
      maxSalary: req.body.maxSalary,
      status: req.body.status
    });

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Error updating job posting' });
  }
});

// Delete job posting (employers only)
router.delete('/:id', auth, checkRole(['employer']), async (req, res) => {
  try {
    const company = await Company.findByEmployerId(req.user.id);
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company_id !== company.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.delete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Error deleting job posting' });
  }
});

// Get company's job postings (employers only)
router.get('/company/listings', auth, checkRole(['employer']), async (req, res) => {
  try {
    const company = await Company.findByEmployerId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const jobs = await Job.findByCompanyId(company.id);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ message: 'Error fetching company job listings' });
  }
});

module.exports = router; 