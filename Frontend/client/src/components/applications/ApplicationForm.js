import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ApplicationForm = ({ jobId, onApplicationSubmit }) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        { coverLetter },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
      setCoverLetter('');
      if (onApplicationSubmit) {
        onApplicationSubmit(response.data);
      }
    } catch (error) {
      console.error('Application error:', error);
      setError(
        error.response?.data?.message ||
        'An error occurred while submitting your application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'job_seeker') {
    return (
      <Alert severity="info">
        You must be logged in as a job seeker to apply for this job.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Apply for this Position
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your application has been submitted successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Cover Letter"
          multiline
          rows={6}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
          placeholder="Introduce yourself and explain why you're a good fit for this position..."
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ApplicationForm;
