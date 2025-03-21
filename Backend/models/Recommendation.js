const db = require('../config/db');

class Recommendation {
  static async getRecommendedJobs(userId) {
    try {
      // Get user profile and skills
      const [profile] = await db.promise().query(
        `SELECT * FROM job_seeker_profiles WHERE user_id = ?`,
        [userId]
      );

      if (!profile[0]) {
        return [];
      }

      const userProfile = profile[0];
      const userSkills = userProfile.skills ? userProfile.skills.split(',').map(s => s.trim().toLowerCase()) : [];

      // Find matching jobs based on skills, experience level, and other factors
      const query = `
        SELECT 
          j.*,
          c.company_name,
          c.industry,
          MATCH(j.skills) AGAINST(? IN BOOLEAN MODE) as skill_match_score,
          CASE 
            WHEN j.experience_level = ? THEN 2
            ELSE 0
          END as experience_match_score
        FROM jobs j
        JOIN companies c ON j.company_id = c.id
        WHERE j.status = 'open'
        AND (
          MATCH(j.skills) AGAINST(? IN BOOLEAN MODE)
          OR j.experience_level = ?
          OR j.industry IN (
            SELECT industry 
            FROM applications a
            JOIN jobs j2 ON a.job_id = j2.id
            JOIN companies c2 ON j2.company_id = c2.id
            WHERE a.job_seeker_id = ?
            GROUP BY industry
          )
        )
        ORDER BY (skill_match_score + experience_match_score) DESC, j.created_at DESC
        LIMIT 10
      `;

      const skillSearchString = userSkills.map(skill => `+${skill}*`).join(' ');
      
      const [jobs] = await db.promise().query(query, [
        skillSearchString,
        userProfile.experience_level,
        skillSearchString,
        userProfile.experience_level,
        userId
      ]);

      // Calculate match percentage for each job
      return jobs.map(job => {
        const jobSkills = job.skills ? job.skills.split(',').map(s => s.trim().toLowerCase()) : [];
        const matchingSkills = userSkills.filter(skill => 
          jobSkills.some(jobSkill => jobSkill.includes(skill))
        );

        const matchScore = {
          skills: (matchingSkills.length / Math.max(userSkills.length, 1)) * 100,
          experience: job.experience_level === userProfile.experience_level ? 100 : 50,
          recency: 100 // Base score for new jobs
        };

        // Calculate overall match percentage
        const overallMatch = Math.round(
          (matchScore.skills * 0.5) + // 50% weight for skills
          (matchScore.experience * 0.3) + // 30% weight for experience
          (matchScore.recency * 0.2) // 20% weight for recency
        );

        return {
          ...job,
          matchPercentage: overallMatch,
          matchingSkills
        };
      });
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw error;
    }
  }

  static async getJobSeekerRecommendations(jobId) {
    try {
      // Get job details and required skills
      const [job] = await db.promise().query(
        `SELECT * FROM jobs WHERE id = ?`,
        [jobId]
      );

      if (!job[0]) {
        return [];
      }

      const jobDetails = job[0];
      const requiredSkills = jobDetails.skills ? jobDetails.skills.split(',').map(s => s.trim().toLowerCase()) : [];

      // Find matching job seekers based on skills and experience
      const query = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          p.*,
          MATCH(p.skills) AGAINST(? IN BOOLEAN MODE) as skill_match_score,
          CASE 
            WHEN p.experience_level = ? THEN 2
            ELSE 0
          END as experience_match_score
        FROM job_seeker_profiles p
        JOIN users u ON p.user_id = u.id
        WHERE u.role = 'job_seeker'
        AND MATCH(p.skills) AGAINST(? IN BOOLEAN MODE)
        ORDER BY (skill_match_score + experience_match_score) DESC
        LIMIT 10
      `;

      const skillSearchString = requiredSkills.map(skill => `+${skill}*`).join(' ');

      const [candidates] = await db.promise().query(query, [
        skillSearchString,
        jobDetails.experience_level,
        skillSearchString
      ]);

      // Calculate match percentage for each candidate
      return candidates.map(candidate => {
        const candidateSkills = candidate.skills ? candidate.skills.split(',').map(s => s.trim().toLowerCase()) : [];
        const matchingSkills = requiredSkills.filter(skill => 
          candidateSkills.some(candSkill => candSkill.includes(skill))
        );

        const matchScore = {
          skills: (matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100,
          experience: candidate.experience_level === jobDetails.experience_level ? 100 : 50
        };

        // Calculate overall match percentage
        const overallMatch = Math.round(
          (matchScore.skills * 0.7) + // 70% weight for skills
          (matchScore.experience * 0.3) // 30% weight for experience
        );

        return {
          ...candidate,
          matchPercentage: overallMatch,
          matchingSkills
        };
      });
    } catch (error) {
      console.error('Error getting candidate recommendations:', error);
      throw error;
    }
  }
}

module.exports = Recommendation; 