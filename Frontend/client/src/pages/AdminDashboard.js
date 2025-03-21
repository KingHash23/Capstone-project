import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersResponse, companiesResponse, jobsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users', { headers }),
        axios.get('http://localhost:5000/api/companies', { headers }),
        axios.get('http://localhost:5000/api/jobs', { headers }),
      ]);

      setUsers(usersResponse.data);
      setCompanies(companiesResponse.data);
      setJobs(jobsResponse.data);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`http://localhost:5000/api/admin/${type}/${id}`, { headers });
      fetchData(); // Refresh data after deletion
    } catch (error) {
      setError('Error deleting item. Please try again later.');
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Users
                </Typography>
                {users.map((user) => (
                  <Box key={user.id} sx={{ mb: 2 }}>
                    <Typography>{user.name}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete('users', user.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Companies
                </Typography>
                {companies.map((company) => (
                  <Box key={company.id} sx={{ mb: 2 }}>
                    <Typography>{company.company_name}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete('companies', company.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Jobs
                </Typography>
                {jobs.map((job) => (
                  <Box key={job.id} sx={{ mb: 2 }}>
                    <Typography>{job.title}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete('jobs', job.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;