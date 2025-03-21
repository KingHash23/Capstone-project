import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { Work, Search, Business, Person } from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <Work fontSize="large" color="primary" />,
      title: 'Find Your Dream Job',
      description: 'Browse through thousands of job opportunities from top companies.',
    },
    {
      icon: <Business fontSize="large" color="primary" />,
      title: 'Post Job Openings',
      description: 'Employers can easily post and manage job listings.',
    },
    {
      icon: <Search fontSize="large" color="primary" />,
      title: 'Smart Search',
      description: 'Advanced search and filtering to find the perfect match.',
    },
    {
      icon: <Person fontSize="large" color="primary" />,
      title: 'Profile Management',
      description: 'Create and manage your professional profile.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Find Your Next Career Opportunity
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ mb: 4 }}
          >
            Connect with top employers and find the perfect job for your skills and experience.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Button
              component={RouterLink}
              to="/jobs"
              variant="contained"
              color="secondary"
              size="large"
            >
              Browse Jobs
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Post a Job
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                elevation={2}
              >
                {feature.icon}
                <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 