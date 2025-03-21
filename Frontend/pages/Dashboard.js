import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Work,
  Business,
  Person,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  People,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import JobRecommendations from '../components/recommendations/JobRecommendations';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentApplications: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'employer') {
      fetchEmployerJobs();
      fetchEmployerAnalytics();
    } else if (user.role === 'job_seeker') {
      fetchJobSeekerApplications();
    }
  }, [user, navigate]);

  const fetchEmployerJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/jobs/company/listings',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchJobSeekerApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/applications/my-applications',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchEmployerAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      // Calculate analytics from jobs and applications data
      const activeJobs = jobs.filter(job => job.status === 'open').length;
      const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
      const recentApplications = jobs.reduce((sum, job) => {
        const recent = job.applications?.filter(app => {
          const date = new Date(app.created_at);
          const now = new Date();
          return (now - date) / (1000 * 60 * 60 * 24) <= 7; // Last 7 days
        }).length || 0;
        return sum + recent;
      }, 0);

      setAnalytics({
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        recentApplications
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchEmployerJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleViewApplications = async (job) => {
    setSelectedJob(job);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/applications/job/${job.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedJob({ ...job, applications: response.data });
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      handleViewApplications(selectedJob);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      reviewed: 'info',
      shortlisted: 'success',
      rejected: 'error',
      accepted: 'success'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const AnalyticsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4">{analytics.totalJobs}</Typography>
                <Typography>Total Jobs</Typography>
              </Box>
              <Work fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4">{analytics.activeJobs}</Typography>
                <Typography>Active Jobs</Typography>
              </Box>
              <TrendingUp fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4">{analytics.totalApplications}</Typography>
                <Typography>Total Applications</Typography>
              </Box>
              <People fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4">{analytics.recentApplications}</Typography>
                <Typography>Recent Applications</Typography>
              </Box>
              <Assessment fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const EmployerDashboard = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Employer Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/jobs/new')}
        >
          Post New Job
        </Button>
      </Box>

      <AnalyticsCards />

      <Typography variant="h5" sx={{ mb: 3 }}>Active Job Listings</Typography>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {job.location}
                    </Typography>
                    <Chip
                      icon={<Work />}
                      label={job.job_type.split('_').join(' ').toUpperCase()}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <IconButton onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteJob(job.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => handleViewApplications(job)}
                  sx={{ mt: 2 }}
                >
                  View Applications
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const JobSeekerDashboard = () => (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        My Dashboard
      </Typography>

      {/* Analytics Section */}
      <Box sx={{ mb: 4 }}>
        <AnalyticsDashboard />
      </Box>

      {/* Job Recommendations Section */}
      <Box sx={{ mb: 4 }}>
        <JobRecommendations />
      </Box>

      <Typography variant="h5" gutterBottom>
        My Applications
      </Typography>

      <Grid container spacing={3}>
        {applications.map((application) => (
          <Grid item xs={12} key={application.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {application.job_title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {application.company_name}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Applied on: {formatDate(application.created_at)}
                  </Typography>
                  <Chip
                    label={application.status.toUpperCase()}
                    color={getStatusColor(application.status)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {user?.role === 'employer' ? <EmployerDashboard /> : <JobSeekerDashboard />}

      {/* Applications Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Applications for {selectedJob?.title}
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedJob?.applications?.map((application) => (
              <React.Fragment key={application.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<CheckCircle />}
                        color="success"
                        variant={application.status === 'accepted' ? 'contained' : 'outlined'}
                        onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Cancel />}
                        color="error"
                        variant={application.status === 'rejected' ? 'contained' : 'outlined'}
                        onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${application.first_name} ${application.last_name}`}
                    secondary={
                      <>
                        <Typography variant="body2">{application.email}</Typography>
                        <Typography variant="body2">
                          Applied: {formatDate(application.created_at)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cover Letter: {application.cover_letter}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 