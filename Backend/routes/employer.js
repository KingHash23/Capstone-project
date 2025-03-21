const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Company = require('../models/Company');

// Get employer's company profile
router.get('/company', auth, checkRole(['employer']), async (req, res) => {
  try {
    const company = await Company.findByEmployerId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Error fetching company profile' });
  }
});
// Create company profile
router.post('/company', auth, checkRole(['employer']), async (req, res) => {
  try {
    const { companyName, description, industry, website, location } = req.body;

    // Validate required fields
    if (!companyName || !description || !industry || !location) {
      return res.status(400).json({ message: 'All fields are required except website.' });
    }

    // Check if the employer already has a company profile
    const existingCompany = await Company.findByEmployerId(req.user.id);
    if (existingCompany) {
      return res.status(400).json({ message: 'Company profile already exists. Use PUT to update.' });
    }

    // Create new company profile
    const companyData = {
      employerId: req.user.id,
      companyName,
      description,
      industry,
      website: website || null, // Website is optional
      location,
    };

    const company = await Company.create(companyData);
    res.status(201).json({ message: 'Company profile created successfully.', company });
  } catch (error) {
    console.error('Error creating company profile:', error);
    res.status(500).json({ message: 'Error creating company profile.' });
  }
});

// Update company profile
router.put('/company', auth, checkRole(['employer']), async (req, res) => {
  try {
    const { companyName, description, industry, website, location } = req.body;

    // Validate required fields
    if (!companyName || !description || !industry || !location) {
      return res.status(400).json({ message: 'All fields are required except website.' });
    }

    // Check if the employer has a company profile
    const existingCompany = await Company.findByEmployerId(req.user.id);
    if (!existingCompany) {
      return res.status(404).json({ message: 'Company profile not found. Use POST to create.' });
    }

    // Update company profile
    const companyData = {
      companyName,
      description,
      industry,
      website: website || null, // Website is optional
      location,
    };

    const updatedCompany = await Company.update(req.user.id, companyData);
    res.status(200).json({ message: 'Company profile updated successfully.', company: updatedCompany });
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Error updating company profile.' });
  }
});

// Get company by ID (public route)
router.get('/company/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Error fetching company' });
  }
});

module.exports = router; 