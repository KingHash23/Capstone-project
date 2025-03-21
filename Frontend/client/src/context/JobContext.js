import React, { createContext, useState, useContext, useEffect } from 'react';
import { jobsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const { isAuthenticated, user } = useAuth();

  // Fetch all jobs with optional filters
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getAllJobs(filterParams);
      setJobs(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching jobs');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single job by ID
  const fetchJobById = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.getJobById(jobId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching job details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new job (employers only)
  const createJob = async (jobData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.createJob(jobData);
      // Refresh jobs list after creating a new job
      await fetchJobs(filters);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing job (employers only)
  const updateJob = async (jobId, jobData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsAPI.updateJob(jobId, jobData);
      // Refresh jobs list after updating a job
      await fetchJobs(filters);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a job (employers only)
  const deleteJob = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      await jobsAPI.deleteJob(jobId);
      // Remove the deleted job from state
      setJobs(jobs.filter(job => job.id !== jobId));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to jobs
  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchJobs(updatedFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    fetchJobs({});
  };

  // Load jobs when component mounts or when filters change
  useEffect(() => {
    fetchJobs(filters);
  }, []);

  const value = {
    jobs,
    loading,
    error,
    filters,
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    deleteJob,
    applyFilters,
    clearFilters
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};