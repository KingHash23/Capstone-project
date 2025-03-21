import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ApplicationList = ({ jobId }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId, user]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'employer' && jobId
        ? `http://localhost:5000/api/applications/job/${jobId}`
        : 'http://localhost:5000/api/applications/my-applications';
        
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(
        error.response?.data?.message ||
        'Failed to fetch applications. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/applications/${selectedApplication.id}/status`,
        { status: statusUpdate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the status in the local state
      setApplications(applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: statusUpdate } 
          : app
      ));
      
      // Close the dialog
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating application status:', error);
      setError(
        error.response?.data?.message ||
        'Failed to update application status. Please try again.'
      );
    }
  };

  const openStatusDialog = (application) => {
    setSelectedApplication(application);
    setStatusUpdate(application.status);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
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
      month: 'short',
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

  if (applications.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, my: 2 }}>
        <Typography variant="subtitle1" color="textSecondary" align="center">
          {user.role === 'employer'
            ? 'No applications have been submitted for this job yet.'
            : 'You haven\'t applied to any jobs yet.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {user.role === 'employer' ? 'Applications Received' : 'Your Applications'}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {user.role === 'employer' && (
                <>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Email</TableCell>
                </>
              )}
              {user.role === 'job_seeker' && (
                <>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Company</TableCell>
                </>
              )}
              <TableCell>Date Applied</TableCell>
              <TableCell>Status</TableCell>
              {user.role === 'employer' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                {user.role === 'employer' && (
                  <>
                    <TableCell>{application.applicant_name}</TableCell>
                    <TableCell>{application.applicant_email}</TableCell>
                  </>
                )}
                {user.role === 'job_seeker' && (
                  <>
                    <TableCell>{application.job_title}</TableCell>
                    <TableCell>{application.company_name}</TableCell>
                  </>
                )}
                <TableCell>{formatDate(application.created_at)}</TableCell>
                <TableCell>
                  <Chip 
                    label={application.status.charAt(0).toUpperCase() + application.status.slice(1)} 
                    color={getStatusColor(application.status)} 
                    size="small" 
                  />
                </TableCell>
                {user.role === 'employer' && (
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => openStatusDialog(application)}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Update Dialog */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the status for {selectedApplication?.applicant_name}'s application.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusUpdate}
              label="Status"
              onChange={(e) => setStatusUpdate(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationList;
