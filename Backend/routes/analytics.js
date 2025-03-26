// const express = require('express');
// const router = express.Router();
// const Analytics = require('../models/Analytics');
// // const auth = require('../middleware/auth');
// const { auth } = require('../middleware/auth');


// // Get analytics data for the current user
// router.get('/', auth, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userRole = req.user.role;
    
//     if (userRole === 'employer') {
//       // Get employer-specific analytics
//       const metrics = await Analytics.getUserEngagementMetrics(userId, userRole);
      
//       // Format the response for the frontend
//       const response = {
//         totalJobs: metrics.jobStats?.total_jobs || 0,
//         activeJobs: metrics.jobStats?.active_jobs || 0,
//         totalApplications: metrics.applicationStats?.total_applications || 0,
//         recentApplications: 0 // Will calculate this below
//       };
      
//       // Calculate recent applications (last 7 days)
//       if (metrics.applicationTrends) {
//         const now = new Date();
//         const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        
//         response.recentApplications = metrics.applicationTrends
//           .filter(trend => new Date(trend.date) >= sevenDaysAgo)
//           .reduce((sum, trend) => sum + trend.count, 0);
//       }
      
//       return res.json(response);
//     } else if (userRole === 'job_seeker') {
//       // Get job seeker-specific analytics
//       const metrics = await Analytics.getUserEngagementMetrics(userId, userRole);
      
//       // Format the response for the frontend
//       const response = {
//         totalApplications: metrics.applications?.total_applications || 0,
//         successfulApplications: metrics.applications?.successful_applications || 0,
//         companiesApplied: metrics.applications?.companies_applied || 0,
//         successRate: metrics.applications?.success_rate || 0
//       };
      
//       return res.json(response);
//     } else {
//       return res.status(403).json({ message: 'Unauthorized role' });
//     }
//   } catch (error) {
//     console.error('Error fetching analytics:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { auth } = require('../middleware/auth'); // ✅ Fixed Destructuring



// Get analytics data for the current user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    console.log('Fetching analytics for user:', { userId, userRole });

    if (!userId || !userRole) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    // Ensure getUserEngagementMetrics function exists
    if (!Analytics.getUserEngagementMetrics) {
      console.error('Error: getUserEngagementMetrics function is missing in Analytics model');
      return res.status(500).json({ message: 'Server error: Missing function' });
    }

    const metrics = await Analytics.getUserEngagementMetrics(userId, userRole);
    console.log('Metrics fetched:', metrics);

    if (userRole === 'employer') {
      const response = {
        totalJobs: metrics.jobStats?.total_jobs || 0,
        activeJobs: metrics.jobStats?.active_jobs || 0,
        totalApplications: metrics.applicationStats?.total_applications || 0,
        recentApplications: 0
      };

      if (metrics.applicationTrends) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        response.recentApplications = metrics.applicationTrends
          .filter(trend => new Date(trend.date) >= sevenDaysAgo)
          .reduce((sum, trend) => sum + trend.count, 0);
      }

      return res.json(response);
    } else if (userRole === 'job_seeker') {
      const response = {
        totalApplications: metrics.applications?.total_applications || 0,
        successfulApplications: metrics.applications?.successful_applications || 0,
        companiesApplied: metrics.applications?.companies_applied || 0,
        successRate: metrics.applications?.success_rate || 0
      };

      return res.json(response);
    } else {
      return res.status(403).json({ message: 'Unauthorized role' });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
