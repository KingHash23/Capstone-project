import React, { createContext, useState, useContext, useEffect } from 'react';
import { recommendationsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const RecommendationContext = createContext();

export const useRecommendations = () => useContext(RecommendationContext);

export const RecommendationProvider = ({ children }) => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch recommended jobs for job seeker
  const fetchRecommendedJobs = async () => {
    if (!isAuthenticated || user.role !== 'job_seeker') return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationsAPI.getRecommendedJobs();
      setRecommendedJobs(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching job recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommended candidates for a job (employer)
  const fetchRecommendedCandidates = async (jobId) => {
    if (!isAuthenticated || user.role !== 'employer') return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await recommendationsAPI.getRecommendedCandidates(jobId);
      setRecommendedCandidates(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching candidate recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load recommended jobs when component mounts and user is a job seeker
  useEffect(() => {
    if (isAuthenticated && user.role === 'job_seeker') {
      fetchRecommendedJobs();
    }
  }, [isAuthenticated, user]);

  const value = {
    recommendedJobs,
    recommendedCandidates,
    loading,
    error,
    fetchRecommendedJobs,
    fetchRecommendedCandidates
  };

  return <RecommendationContext.Provider value={value}>{children}</RecommendationContext.Provider>;
};