import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Slider,
  Autocomplete,
  Paper,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Business,
  Work,
  AttachMoney,
  FilterList,
} from '@mui/icons-material';
import axios from 'axios';

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    jobType: '',
    industry: '',
    experienceLevel: '',
    salaryRange: [0, 200000],
    skills: [],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const jobTypes = ['full_time', 'part_time', 'contract', 'internship'];
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Services',
    'Other',
  ];
  const experienceLevels = [
    'Entry Level',
    'Junior',
    'Mid-Level',
    'Senior',
    'Lead',
    'Manager',
    'Executive',
  ];
  const commonSkills = [
    'JavaScript',
    'Python',
    'Java',
    'React',
    'Node.js',
    'SQL',
    'Project Management',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Agile',
    'DevOps',
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'salaryRange') {
            queryParams.append('minSalary', value[0]);
            queryParams.append('maxSalary', value[1]);
          } else if (key === 'skills' && value.length > 0) {
            queryParams.append('skills', value.join(','));
          } else if (value !== '') {
            queryParams.append(key, value);
          }
        }
      });
      
      const response = await axios.get(`http://localhost:5000/api/jobs?${queryParams}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalaryRangeChange = (event, newValue) => {
    setFilters({
      ...filters,
      salaryRange: newValue,
    });
  };

  const handleSkillsChange = (event, newValue) => {
    setFilters({
      ...filters,
      skills: newValue,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatJobType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatSalary = (value) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Listings
        </Typography>

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box component="form" onSubmit={handleSearch}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Job Title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <LocationOn />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      name="jobType"
                      value={filters.jobType}
                      label="Job Type"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {formatJobType(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      name="industry"
                      value={filters.industry}
                      label="Industry"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    startIcon={<FilterList />}
                    sx={{ height: '100%' }}
                  >
                    {showAdvancedFilters ? 'Less Filters' : 'More Filters'}
                  </Button>
                </Grid>
              </Grid>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Experience Level</InputLabel>
                        <Select
                          name="experienceLevel"
                          value={filters.experienceLevel}
                          label="Experience Level"
                          onChange={handleFilterChange}
                        >
                          <MenuItem value="">All</MenuItem>
                          {experienceLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography gutterBottom>Salary Range</Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={filters.salaryRange}
                          onChange={handleSalaryRangeChange}
                          valueLabelDisplay="auto"
                          valueLabelFormat={formatSalary}
                          min={0}
                          max={200000}
                          step={5000}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">
                            {formatSalary(filters.salaryRange[0])}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatSalary(filters.salaryRange[1])}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={commonSkills}
                        value={filters.skills}
                        onChange={handleSkillsChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Required Skills"
                            placeholder="Select skills"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              key={option}
                            />
                          ))
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Search Jobs
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Job Listings */}
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
                        {job.company_name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {job.location}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        icon={<Work />}
                        label={formatJobType(job.job_type)}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" paragraph>
                    {job.description.length > 200
                      ? `${job.description.substring(0, 200)}...`
                      : job.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                      {job.skills?.split(',').map((skill) => (
                        <Chip
                          key={skill}
                          label={skill.trim()}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
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
    </Container>
  );
};

export default JobList; 