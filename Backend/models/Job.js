const db = require('../config/db');

class Job {
  static async create(jobData) {
    try {
      const [result] = await db.promise().query(
        `INSERT INTO jobs (
          company_id, 
          title, 
          description, 
          requirements, 
          salary_range,
          min_salary,
          max_salary,
          location,
          job_type,
          experience_level,
          skills,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobData.companyId,
          jobData.title,
          jobData.description,
          jobData.requirements,
          jobData.salaryRange,
          jobData.minSalary,
          jobData.maxSalary,
          jobData.location,
          jobData.jobType,
          jobData.experienceLevel,
          jobData.skills,
          'open'
        ]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async update(jobId, jobData) {
    try {
      await db.promise().query(
        `UPDATE jobs SET 
          title = ?, 
          description = ?, 
          requirements = ?, 
          salary_range = ?,
          min_salary = ?,
          max_salary = ?,
          location = ?,
          job_type = ?,
          experience_level = ?,
          skills = ?,
          status = ?
        WHERE id = ?`,
        [
          jobData.title,
          jobData.description,
          jobData.requirements,
          jobData.salaryRange,
          jobData.minSalary,
          jobData.maxSalary,
          jobData.location,
          jobData.jobType,
          jobData.experienceLevel,
          jobData.skills,
          jobData.status,
          jobId
        ]
      );
      return this.findById(jobId);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.promise().query(
        `SELECT jobs.*, 
          companies.company_name, 
          companies.industry,
          companies.website
        FROM jobs 
        JOIN companies ON jobs.company_id = companies.id 
        WHERE jobs.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM jobs WHERE company_id = ?',
        [companyId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT jobs.*, 
          companies.company_name, 
          companies.industry
        FROM jobs 
        JOIN companies ON jobs.company_id = companies.id 
        WHERE jobs.status = 'open'
      `;
      const params = [];

      if (filters.title) {
        query += ' AND jobs.title LIKE ?';
        params.push(`%${filters.title}%`);
      }

      if (filters.location) {
        query += ' AND jobs.location LIKE ?';
        params.push(`%${filters.location}%`);
      }

      if (filters.jobType) {
        query += ' AND jobs.job_type = ?';
        params.push(filters.jobType);
      }

      if (filters.industry) {
        query += ' AND companies.industry = ?';
        params.push(filters.industry);
      }

      if (filters.experienceLevel) {
        query += ' AND jobs.experience_level = ?';
        params.push(filters.experienceLevel);
      }

      if (filters.minSalary) {
        query += ' AND jobs.min_salary >= ?';
        params.push(filters.minSalary);
      }

      if (filters.maxSalary) {
        query += ' AND jobs.max_salary <= ?';
        params.push(filters.maxSalary);
      }

      if (filters.skills && filters.skills.length > 0) {
        const skillConditions = filters.skills.map(skill => 
          'jobs.skills LIKE ?'
        ).join(' OR ');
        query += ` AND (${skillConditions})`;
        filters.skills.forEach(skill => {
          params.push(`%${skill}%`);
        });
      }

      query += ' ORDER BY jobs.created_at DESC';

      const [rows] = await db.promise().query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async delete(jobId) {
    try {
      await db.promise().query('DELETE FROM jobs WHERE id = ?', [jobId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Job; 