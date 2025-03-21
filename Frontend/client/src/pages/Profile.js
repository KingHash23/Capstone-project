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
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [profile, setProfile] = useState({
    title: '',
    summary: '',
    experienceYears: '',
    educationLevel: '',
    skills: [],
    resumeUrl: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'job_seeker') {
      navigate('/dashboard');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/job-seeker/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = response.data;
      setProfile({
        ...profileData,
        skills: profileData.skills ? profileData.skills.split(',') : []
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        setError('Error fetching profile');
      }
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/pages/profile',
        {
          ...profile,
          skills: profile.skills
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  const educationLevels = [
    'High School',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate',
    'Other'
  ];

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Job Seeker Profile
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
                  name="title"
                  label="Professional Title"
                  value={profile.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="summary"
                  label="Professional Summary"
                  value={profile.summary}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  name="experienceYears"
                  label="Years of Experience"
                  value={profile.experienceYears}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Education Level</InputLabel>
                  <Select
                    name="educationLevel"
                    value={profile.educationLevel}
                    label="Education Level"
                    onChange={handleChange}
                  >
                    {educationLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                    />
                    <IconButton
                      onClick={handleAddSkill}
                      color="primary"
                      disabled={!newSkill}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={<DeleteIcon />}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 