import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    companyName: '',
    description: '',
    industry: '',
    website: '',
    location: '',
  });
  const [hasProfile, setHasProfile] = useState(false); // Track if the employer has a profile

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Services',
    'Other',
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'employer') {
      navigate('/dashboard');
      return;
    }

    fetchCompanyProfile();
  }, [user, navigate]);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/company', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setHasProfile(true); // Employer already has a profile
    } catch (error) {
      if (error.response?.status === 404) {
        // No company profile found, initialize empty profile
        setProfile({
          companyName: '',
          description: '',
          industry: '',
          website: '',
          location: '',
        });
        setHasProfile(false); // Employer does not have a profile
      } else {
        setError('Error fetching company profile. Please try again later.');
      }
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!profile.companyName || !profile.description || !profile.industry || !profile.location) {
      setError('Please fill out all required fields.');
      return false;
    }

    if (profile.website && !profile.website.startsWith('http://') && !profile.website.startsWith('https://')) {
      setError('Website URL must start with http:// or https://.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    try {
      const token = localStorage.getItem('token');
      const url = 'http://localhost:5000/api/company';
      const method = hasProfile ? 'put' : 'post'; // Use PUT if profile exists, POST otherwise
  
      // Make the API request
      await axios[method](url, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Set success message
      setSuccess(
        hasProfile
          ? 'Company profile updated successfully.'
          : 'Company profile created successfully.'
      );
  
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Error saving company profile.');
      } else if (error.request) {
        setError('No response from the server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Company Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="companyName"
                  label="Company Name"
                  value={profile.companyName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Company Description"
                  value={profile.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    name="industry"
                    value={profile.industry}
                    label="Industry"
                    onChange={handleChange}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="website"
                  label="Company Website"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="location"
                  label="Company Location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Profile'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompanyProfile;