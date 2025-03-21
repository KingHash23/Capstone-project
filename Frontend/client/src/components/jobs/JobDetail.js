import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Business,
  LocationOn,
  Work,
  AccessTime,
  AttachMoney,
  Description
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ApplicationForm from '../applications/ApplicationForm';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user && user.role === 'job_seeker') {
      checkApplicationStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError(
        error.response?.data?.message ||
        'Failed to fetch job details. Please try again.'
      );
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/applications/${id}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setHasApplied(response.data.hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApplicationSubmit = () => {
    setHasApplied(true);
    setShowApplicationForm(false);
  };

  const formatJobType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!job) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Job not found.
      </Alert>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {job.title}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Business sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">
                {job.company_name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {job.location}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Work sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                {formatJobType(job.job_type)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">
                Posted on {formatDate(job.created_at)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {job.salary_range && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body1">
              Salary Range: {job.salary_range}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Description sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
            Job Description
          </Typography>
          <Typography variant="body1" paragraph>
            {job.description}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Requirements
          </Typography>
          <Typography variant="body1" paragraph>
            {job.requirements}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Skills Required
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.skills && job.skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                color="primary"
                sx={{ mt: 1 }}
              />
            ))}
          </Stack>
        </Box>
        
        {user && user.role === 'job_seeker' && (
          <Box sx={{ mt: 3 }}>
            {hasApplied ? (
              <Alert severity="info">
                You have already applied for this job.
              </Alert>
            ) : (
              job.status === 'open' ? (
                showApplicationForm ? (
                  <ApplicationForm
                    jobId={id}
                    onApplicationSubmit={handleApplicationSubmit}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply for this Job
                  </Button>
                )
              ) : (
                <Alert severity="warning">
                  This job is no longer accepting applications.
                </Alert>
              )
            )}
          </Box>
        )}
        
        <Button
          sx={{ mt: 3 }}
          onClick={() => navigate(-1)}
        >
          Back to Jobs
        </Button>
      </Paper>
    </Box>
  );
};

export default JobDetail;
