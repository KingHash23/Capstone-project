// const express = require('express');
// const router = express.Router();
// const { auth, checkRole } = require('../middleware/auth');
// const User = require('../models/User'); // Correct import path
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Get all users (admin only)
// router.get('/users', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const users = await Admin.getAllUsers();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Error fetching users.' });
//   }
// });

// // Get all companies (admin only)
// router.get('/companies', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const companies = await Admin.getAllCompanies();
//     res.json(companies);
//   } catch (error) {
//     console.error('Error fetching companies:', error);
//     res.status(500).json({ message: 'Error fetching companies.' });
//   }
// });

// // Get all jobs (admin only)
// router.get('/jobs', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const jobs = await Admin.getAllJobs();
//     res.json(jobs);
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     res.status(500).json({ message: 'Error fetching jobs.' });
//   }
// });

// // Delete a user (admin only)
// router.delete('/users/:id', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const userId = req.params.id;
//     await Admin.deleteUser(userId);
//     res.json({ message: 'User deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Error deleting user.' });
//   }
// });

// // Delete a company (admin only)
// router.delete('/companies/:id', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const companyId = req.params.id;
//     await Admin.deleteCompany(companyId);
//     res.json({ message: 'Company deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting company:', error);
//     res.status(500).json({ message: 'Error deleting company.' });
//   }
// });

// // Delete a job (admin only)
// router.delete('/jobs/:id', auth, checkRole(['admin']), async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     await Admin.deleteJob(jobId);
//     res.json({ message: 'Job deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting job:', error);
//     res.status(500).json({ message: 'Error deleting job.' });
//   }
// });

// // Admin Registration
// router.post('/register', async (req, res) => {
//     try {
//       const { firstName, lastName, email, password } = req.body;
  
//       // Check if the email is already registered
//       const existingUser = await User.findByEmail(email);
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already registered.' });
//       }
  
//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       // Create the admin user
//       const adminUser = await User.create({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword,
//         role: 'admin',
//       });
  
//       res.status(201).json({ message: 'Admin registered successfully.', user: adminUser });
//     } catch (error) {
//       console.error('Error registering admin:', error);
//       res.status(500).json({ message: 'Error registering admin.' });
//     }
//   });
  
//   // Admin Login
//   router.post('/login', async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       console.log('Login request received:', { email, password }); // Debugging
  
//       // Check if the user exists
//       const user = await User.findByEmail(email);
//       if (!user) {
//         console.log('User not found:', email); // Debugging
//         return res.status(400).json({ message: 'Invalid email or password.' });
//       }
  
//       // Check if the user is an admin
//       if (user.role !== 'admin') {
//         console.log('Access denied. User role:', user.role); // Debugging
//         return res.status(403).json({ message: 'Access denied. Admins only.' });
//       }
  
//       // Verify the password
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         console.log('Invalid password for user:', email); // Debugging
//         return res.status(400).json({ message: 'Invalid email or password.' });
//       }
  
//       // Generate a JWT token
//       const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//       });
  
//       res.json({ message: 'Login successful.', token });
//     } catch (error) {
//       console.error('Error logging in:', error); // Debugging
//       res.status(500).json({ message: 'Error logging in.' });
//     }
//   });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/User'); // Correct import path
const bcrypt = require('bcryptjs'); // Corrected import
const jwt = require('jsonwebtoken'); // Added JWT import

// Get all users (admin only)
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await Admin.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Get all companies (admin only)
router.get('/companies', auth, checkRole(['admin']), async (req, res) => {
  try {
    const companies = await Admin.getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies.' });
  }
});

// Get all jobs (admin only)
router.get('/jobs', auth, checkRole(['admin']), async (req, res) => {
  try {
    const jobs = await Admin.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs.' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    await Admin.deleteUser(userId);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// Delete a company (admin only)
router.delete('/companies/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const companyId = req.params.id;
    await Admin.deleteCompany(companyId);
    res.json({ message: 'Company deleted successfully.' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Error deleting company.' });
  }
});

// Delete a job (admin only)
router.delete('/jobs/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const jobId = req.params.id;
    await Admin.deleteJob(jobId);
    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Error deleting job.' });
  }
});

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const adminUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ message: 'Admin registered successfully.', user: adminUser });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Error registering admin.' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log('Login request received:', { email }); // Debug log
  
      // Find the user by email
      const user = await User.findByEmail({ email });
      if (!user) {
        console.log('User not found:', email); // Debug log
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      // Check if the user is an admin
      if (user.role !== 'admin') {
        console.log('Access denied. User role:', user.role); // Debug log
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Plaintext password:', password); // Debug log
      console.log('Stored hash:', user.password); // Debug log
      console.log('Comparison result:', isPasswordValid); // Debug log
  
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email); // Debug log
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      console.log('Login successful for user:', email); // Debug log
  
      res.json({ message: 'Login successful.', token });
    } catch (error) {
      console.error('Error logging in:', error); // Debug log
      res.status(500).json({ message: 'Error logging in.' });
    }
  });

module.exports = router;