// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Job seeker endpoints
  JOB_SEEKER_PROFILE: `${API_BASE_URL}/job-seekers/profile`,
  
  // Jobs endpoints
  JOBS: `${API_BASE_URL}/jobs`,
  JOB_DETAIL: (id) => `${API_BASE_URL}/jobs/${id}`,
  COMPANY_JOBS: `${API_BASE_URL}/jobs/company/listings`,
  
  // Applications endpoints
  APPLICATIONS: `${API_BASE_URL}/applications`,
  MY_APPLICATIONS: `${API_BASE_URL}/applications/my-applications`,
  JOB_APPLICATIONS: (jobId) => `${API_BASE_URL}/applications/job/${jobId}`,
  APPLICATION_STATUS: (id) => `${API_BASE_URL}/applications/${id}/status`,
  APPLICATION_CHECK: (id) => `${API_BASE_URL}/applications/${id}/check`,
  
  // Recommendations endpoints
  JOB_RECOMMENDATIONS: `${API_BASE_URL}/recommendations/jobs`,
  
  // Analytics endpoints
  ANALYTICS: `${API_BASE_URL}/analytics`,
  
  // Employer endpoints
  COMPANY_PROFILE: `${API_BASE_URL}/employer/company`,
};

export { API_BASE_URL, API_ENDPOINTS };
