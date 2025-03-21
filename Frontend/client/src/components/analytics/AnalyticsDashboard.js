import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, Work, People, Assessment } from '@mui/icons-material';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentApplications: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const analyticsData = [
    { label: 'Total Jobs', value: analytics.totalJobs, icon: <Work fontSize="large" />, bgcolor: 'primary.light' },
    { label: 'Active Jobs', value: analytics.activeJobs, icon: <TrendingUp fontSize="large" />, bgcolor: 'success.light' },
    { label: 'Total Applications', value: analytics.totalApplications, icon: <People fontSize="large" />, bgcolor: 'info.light' },
    { label: 'Recent Applications', value: analytics.recentApplications, icon: <Assessment fontSize="large" />, bgcolor: 'secondary.light' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {analyticsData.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ bgcolor: item.bgcolor, color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4">{item.value}</Typography>
                  <Typography>{item.label}</Typography>
                </Box>
                {item.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsDashboard;
