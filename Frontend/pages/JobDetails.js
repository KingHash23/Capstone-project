import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Business,
  Work,
  AttachMoney,
  Description,
  Assignment,
  Language,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (user?.role === 'job_seeker') {
      checkApplicationStatus();
    }
  }, [id, user]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      setError('Error fetching job details');
      console.error('Error fetching job details:', error);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/applications/${id}/check`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setHasApplied(response.data.hasApplied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setApplicationError('');
    setCoverLetter('');
  };

  const handleSubmitApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/applications/${id}`,
        { coverLetter },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setApplicationSuccess(true);
      setHasApplied(true);
      handleCloseDialog();
    } catch (error) {
      setApplicationError(error.response?.data?.message || 'Error submitting application');
    }
  };

  const formatJobType = (type) => {
    return type?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!job) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" color="error" align="center">
            {error || 'Loading...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/jobs')}
          sx={{ mb: 3 }}
        >
          Back to Jobs
        </Button>

        {applicationSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Application submitted successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Job Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {job.company_name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<Work />}
                      label={formatJobType(job.job_type)}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocationOn />}
                      label={job.location}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Job Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {job.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body1">
                    {job.requirements}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Job Overview
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney />
                    </ListItemIcon>
                    <ListItemText
                      primary="Salary Range"
                      secondary={job.salary_range || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary="Industry"
                      secondary={job.industry}
                    />
                  </ListItem>
                  {job.website && (
                    <ListItem>
                      <ListItemIcon>
                        <Language />
                      </ListItemIcon>
                      <ListItemText
                        primary="Company Website"
                        secondary={job.website}
                      />
                    </ListItem>
                  )}
                </List>

                <Box sx={{ mt: 3 }}>
                  {user?.role === 'job_seeker' && (
                    hasApplied ? (
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        disabled
                      >
                        Applied
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleApply}
                      >
                        Apply Now
                      </Button>
                    )
                  )}
                  {user?.role === 'employer' && job.company_id === user.company_id && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={() => navigate(`/jobs/${id}/edit`)}
                    >
                      Edit Job
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Application Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogContent>
            {applicationError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {applicationError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Cover Letter"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you would be a good fit for this position..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmitApplication}
              variant="contained"
              disabled={!coverLetter.trim()}
            >
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default JobDetails; 