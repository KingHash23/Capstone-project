import React, { createContext, useState, useContext, useEffect } from 'react';
import { applicationsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const ApplicationContext = createContext();

export const useApplications = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch user's applications (job seeker)
  const fetchUserApplications = async () => {
    if (!isAuthenticated || user.role !== 'job_seeker') return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsAPI.getUserApplications();
      setApplications(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching applications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for a specific job (employer)
  const fetchJobApplications = async (jobId) => {
    if (!isAuthenticated || user.role !== 'employer') return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsAPI.getJobApplications(jobId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching job applications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Apply for a job (job seeker)
  const applyForJob = async (jobId, applicationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsAPI.applyToJob(jobId, applicationData);
      // Refresh applications list after applying
      await fetchUserApplications();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error applying for job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update application status (employer)
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsAPI.updateApplicationStatus(applicationId, status);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating application status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has already applied for a job
  const checkApplicationStatus = async (jobId) => {
    if (!isAuthenticated || user.role !== 'job_seeker') return false;
    
    try {
      const response = await applicationsAPI.checkApplicationStatus(jobId);
      return response.data.hasApplied;
    } catch (err) {
      console.error('Error checking application status:', err);
      return false;
    }
  };

  // Load user applications when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user.role === 'job_seeker') {
      fetchUserApplications();
    }
  }, [isAuthenticated, user]);

  const value = {
    applications,
    loading,
    error,
    fetchUserApplications,
    fetchJobApplications,
    applyForJob,
    updateApplicationStatus,
    checkApplicationStatus
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};