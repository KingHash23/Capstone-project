const db = require('../config/db');

class Application {
  static async create(applicationData) {
    try {
      const [result] = await db.promise().query(
        'INSERT INTO applications (job_id, job_seeker_id, cover_letter) VALUES (?, ?, ?)',
        [
          applicationData.jobId,
          applicationData.jobSeekerId,
          applicationData.coverLetter
        ]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      await db.promise().query(
        'UPDATE applications SET status = ? WHERE id = ?',
        [status, id]
      );
      return this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.promise().query(
        `SELECT applications.*, 
          jobs.title as job_title,
          users.first_name, users.last_name, users.email
        FROM applications 
        JOIN jobs ON applications.job_id = jobs.id
        JOIN users ON applications.job_seeker_id = users.id
        WHERE applications.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByJobSeeker(jobSeekerId) {
    try {
      const [rows] = await db.promise().query(
        `SELECT applications.*, 
          jobs.title as job_title,
          companies.company_name
        FROM applications 
        JOIN jobs ON applications.job_id = jobs.id
        JOIN companies ON jobs.company_id = companies.id
        WHERE applications.job_seeker_id = ?
        ORDER BY applications.created_at DESC`,
        [jobSeekerId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByJob(jobId) {
    try {
      const [rows] = await db.promise().query(
        `SELECT applications.*, 
          users.first_name, users.last_name, users.email,
          job_seeker_profiles.title, job_seeker_profiles.experience_years, job_seeker_profiles.skills
        FROM applications 
        JOIN users ON applications.job_seeker_id = users.id
        LEFT JOIN job_seeker_profiles ON users.id = job_seeker_profiles.user_id
        WHERE applications.job_id = ?
        ORDER BY applications.created_at DESC`,
        [jobId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async hasApplied(jobId, jobSeekerId) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM applications WHERE job_id = ? AND job_seeker_id = ?',
        [jobId, jobSeekerId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Application;