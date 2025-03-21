import React, { createContext, useState, useContext, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [systemAnalytics, setSystemAnalytics] = useState(null);
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch user-specific analytics
  const fetchUserAnalytics = async () => {
    if (!isAuthenticated) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getUserAnalytics();
      setUserAnalytics(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching user analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch system-wide analytics (admin only)
  const fetchSystemAnalytics = async () => {
    if (!isAuthenticated || user.role !== 'admin') return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getSystemAnalytics();
      setSystemAnalytics(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching system analytics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular job categories
  const fetchPopularCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsAPI.getPopularCategories();
      setPopularCategories(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching popular categories');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load user analytics when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAnalytics();
      fetchPopularCategories();
      
      if (user.role === 'admin') {
        fetchSystemAnalytics();
      }
    }
  }, [isAuthenticated, user]);

  const value = {
    userAnalytics,
    systemAnalytics,
    popularCategories,
    loading,
    error,
    fetchUserAnalytics,
    fetchSystemAnalytics,
    fetchPopularCategories
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};