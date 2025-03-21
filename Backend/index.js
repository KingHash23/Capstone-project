const express = require('express');
const cors = require('cors');
// Only need to require dotenv once
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db'); // db.js also configures dotenv, but our config loads first

// Import routes
const authRoutes = require('./routes/auth');
const jobSeekerRoutes = require('./routes/jobSeeker');
const jobRoutes = require('./routes/jobs');
const employerRoutes = require('./routes/employer');
const adminRoutes = require('./routes/admin');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to MySQL database');
    connection.release();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/job-seekers', jobSeekerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', employerRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/HELLO', (req, res) => {
    res.json({ message: 'Welcome to Job Portal API' });
});
//  post method for jobseeker should api jobseeker profile routes
app.post('/api/job-seekers/profile', (req, res) => {
    const {
        title,
        summary,
        experienceYears,
        education,
        skills,
        workHistory,
        contactInfo
    } = req.body;

    // Update or create job seeker profile
    db.query(
        'UPDATE job_seekers SET title =?, summary =?, experience_years =?, education =?, skills =?, work_history =?, contact_info =? WHERE user_id =?',
        [
            title,
            summary,
            experienceYears,
            education,
            skills,
            workHistory,
            contactInfo,
            req.user.id
        ],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating profile' });

            res.json({ message: 'Profile updated successfully' });
        }
    );
});
// Legacy routes - these can be removed once the route files are fully implemented
//  Register User (Without bcrypt or JWT)
app.post('/api/auth/register-legacy', (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;
 
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert new user
        db.query(
            'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [email, password, role, firstName, lastName],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });

                const userId = result.insertId;
                res.status(201).json({
                    message: 'User registered successfully',
                    user: { id: userId, email, role, firstName, lastName }
                });
            }
        );
    });
});

// Login User (Without bcrypt or JWT)
app.post('/api/auth/login-legacy', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Simple password check ( Not secure, will be improved later)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name }
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000; // Changed to a less common port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
