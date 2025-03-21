import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import JobForm from './pages/JobForm';
import Profile from './pages/Profile';
import CompanyProfile from './pages/CompanyProfile';
import Dashboard from './pages/Dashboard';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Context
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/new" element={<JobForm />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/jobs/:id/edit" element={<JobForm />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/company-profile" element={<CompanyProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin/register" element={<AdminRegister />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
