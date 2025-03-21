import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  LinearProgress,
  Grid,
  Divider,
} from '@mui/material';
import {
  Work,
  LocationOn,
  Business,
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';

const JobRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/recommendations/jobs',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRecommendations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Error fetching job recommendations');
      setLoading(false);
    }
  };

  const formatJobType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Typography align="center" color="textSecondary">
        No recommendations available. Please update your profile with more skills and experience.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recommended Jobs for You
      </Typography>
      <Grid container spacing={2}>
        {recommendations.map((job) => (
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
                      {job.company_name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {job.location}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${job.matchPercentage}% Match`}
                    color={job.matchPercentage > 80 ? 'success' : 'primary'}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Matching Skills:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {job.matchingSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    icon={<Work />}
                    label={formatJobType(job.job_type)}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default JobRecommendations; 