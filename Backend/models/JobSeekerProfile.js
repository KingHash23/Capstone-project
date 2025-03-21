const db = require('../config/db');

class JobSeekerProfile {
  static async create(profileData) {
    try {
      const [result] = await db.promise().query(
        'INSERT INTO job_seeker_profiles (user_id, title, summary, experience_years, education_level, skills, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          profileData.userId,
          profileData.title,
          profileData.summary,
          profileData.experienceYears,
          profileData.educationLevel,
          profileData.skills,
          profileData.resumeUrl
        ]
      );
      return this.findByUserId(profileData.userId);
    } catch (error) {
      throw error;
    }
  }

  static async update(userId, profileData) {
    try {
      await db.promise().query(
        'UPDATE job_seeker_profiles SET title = ?, summary = ?, experience_years = ?, education_level = ?, skills = ?, resume_url = ? WHERE user_id = ?',
        [
          profileData.title,
          profileData.summary,
          profileData.experienceYears,
          profileData.educationLevel,
          profileData.skills,
          profileData.resumeUrl,
          userId
        ]
      );
      return this.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM job_seeker_profiles WHERE user_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM job_seeker_profiles WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobSeekerProfile; 