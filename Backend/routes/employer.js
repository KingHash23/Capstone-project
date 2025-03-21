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

// Create or update company profile
router.post('/company', auth, checkRole(['employer']), async (req, res) => {
  try {
    const {
      companyName,
      description,
      industry,
      website,
      location
    } = req.body;

    const companyData = {
      employerId: req.user.id,
      companyName,
      description,
      industry,
      website,
      location
    };

    const existingCompany = await Company.findByEmployerId(req.user.id);
    let company;

    if (existingCompany) {
      company = await Company.update(req.user.id, companyData);
    } else {
      company = await Company.create(companyData);
    }

    res.json(company);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Error updating company profile' });
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