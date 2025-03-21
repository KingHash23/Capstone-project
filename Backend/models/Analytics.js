const db = require('../config/db');

class Analytics {
  static async getSystemMetrics() {
    try {
      // Get total counts
      const [totalCounts] = await db.promise().query(`
        SELECT
          (SELECT COUNT(*) FROM users WHERE role = 'job_seeker') as total_job_seekers,
          (SELECT COUNT(*) FROM users WHERE role = 'employer') as total_employers,
          (SELECT COUNT(*) FROM jobs) as total_jobs,
          (SELECT COUNT(*) FROM applications) as total_applications
      `);

      // Get application success rate
      const [applicationStats] = await db.promise().query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM applications
      `);

      // Get job posting trends (last 30 days)
      const [jobTrends] = await db.promise().query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM jobs
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `);

      // Get application trends (last 30 days)
      const [applicationTrends] = await db.promise().query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `);

      // Calculate match quality metrics
      const [matchMetrics] = await db.promise().query(`
        SELECT 
          AVG(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as acceptance_rate,
          COUNT(DISTINCT job_id) as jobs_with_applications,
          COUNT(DISTINCT job_seeker_id) as active_job_seekers
        FROM applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      // Get popular job categories
      const [popularCategories] = await db.promise().query(`
        SELECT 
          jobs.job_type,
          COUNT(*) as posting_count,
          COUNT(DISTINCT applications.id) as application_count
        FROM jobs
        LEFT JOIN applications ON jobs.id = applications.job_id
        GROUP BY jobs.job_type
        ORDER BY posting_count DESC
      `);

      return {
        totalCounts: totalCounts[0],
        applicationStats: {
          ...applicationStats[0],
          successRate: applicationStats[0].total > 0 
            ? (applicationStats[0].accepted / applicationStats[0].total * 100).toFixed(2)
            : 0
        },
        jobTrends,
        applicationTrends,
        matchMetrics: matchMetrics[0],
        popularCategories
      };
    } catch (error) {
      console.error('Error getting system metrics:', error);
      throw error;
    }
  }

  static async getUserEngagementMetrics(userId, role) {
    try {
      let metrics = {};

      if (role === 'job_seeker') {
        // Get job seeker specific metrics
        const [applications] = await db.promise().query(`
          SELECT 
            COUNT(*) as total_applications,
            COUNT(DISTINCT jobs.company_id) as companies_applied,
            SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as successful_applications,
            AVG(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as success_rate
          FROM applications
          JOIN jobs ON applications.job_id = jobs.id
          WHERE job_seeker_id = ?
        `, [userId]);

        const [applicationTrends] = await db.promise().query(`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM applications
          WHERE job_seeker_id = ?
          AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY DATE(created_at)
          ORDER BY date
        `, [userId]);

        metrics = {
          applications: applications[0],
          applicationTrends
        };
      } else if (role === 'employer') {
        // Get employer specific metrics
        const [jobStats] = await db.promise().query(`
          SELECT 
            COUNT(*) as total_jobs,
            SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as active_jobs,
            COUNT(DISTINCT applications.job_seeker_id) as total_applicants
          FROM jobs
          LEFT JOIN applications ON jobs.id = applications.job_id
          WHERE company_id = (SELECT id FROM companies WHERE employer_id = ?)
        `, [userId]);

        const [applicationStats] = await db.promise().query(`
          SELECT 
            COUNT(*) as total_applications,
            SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_applications,
            AVG(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as acceptance_rate
          FROM applications
          JOIN jobs ON applications.job_id = jobs.id
          WHERE jobs.company_id = (SELECT id FROM companies WHERE employer_id = ?)
        `, [userId]);

        metrics = {
          jobStats: jobStats[0],
          applicationStats: applicationStats[0]
        };
      }

      return metrics;
    } catch (error) {
      console.error('Error getting user engagement metrics:', error);
      throw error;
    }
  }

  static async getRecommendationMetrics() {
    try {
      // Get recommendation success metrics
      const [metrics] = await db.promise().query(`
        SELECT 
          COUNT(DISTINCT applications.job_seeker_id) as users_with_applications,
          COUNT(DISTINCT applications.job_id) as jobs_with_applications,
          AVG(CASE WHEN applications.status = 'accepted' THEN 1 ELSE 0 END) as recommendation_success_rate
        FROM applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      return metrics[0];
    } catch (error) {
      console.error('Error getting recommendation metrics:', error);
      throw error;
    }
  }
}

module.exports = Analytics; 