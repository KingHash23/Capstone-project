import React, { createContext, useState, useContext, useEffect } from 'react';
import { profileAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch job seeker profile
  const fetchJobSeekerProfile = async () => {
    if (!isAuthenticated || user.role !== 'job_seeker') return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getJobSeekerProfile();
      setProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update job seeker profile
  const updateJobSeekerProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.updateJobSeekerProfile(profileData);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch company profile
  const fetchCompanyProfile = async () => {
    if (!isAuthenticated || user.role !== 'employer') return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getCompanyProfile();
      setCompanyProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching company profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update company profile
  const updateCompanyProfile = async (companyData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.updateCompanyProfile(companyData);
      setCompanyProfile(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating company profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload resume
  const uploadResume = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.uploadResume(formData);
      // Update profile with new resume URL
      if (response.data.resumeUrl) {
        setProfile(prev => ({ ...prev, resumeUrl: response.data.resumeUrl }));
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading resume');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load appropriate profile when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'job_seeker') {
        fetchJobSeekerProfile();
      } else if (user.role === 'employer') {
        fetchCompanyProfile();
      }
    }
  }, [isAuthenticated, user]);

  const value = {
    profile,
    companyProfile,
    loading,
    error,
    fetchJobSeekerProfile,
    updateJobSeekerProfile,
    fetchCompanyProfile,
    updateCompanyProfile,
    uploadResume
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}