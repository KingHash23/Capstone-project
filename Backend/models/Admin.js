const db = require('../config/db');

class Admin {
  // Get all users
  static async getAllUsers() {
    try {
      const [rows] = await db.promise().query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all companies
  static async getAllCompanies() {
    try {
      const [rows] = await db.promise().query('SELECT * FROM companies');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all jobs
  static async getAllJobs() {
    try {
      const [rows] = await db.promise().query('SELECT * FROM jobs');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user by ID
  static async deleteUser(userId) {
    try {
      await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete a company by ID
  static async deleteCompany(companyId) {
    try {
      await db.promise().query('DELETE FROM companies WHERE id = ?', [companyId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete a job by ID
  static async deleteJob(jobId) {
    try {
      await db.promise().query('DELETE FROM jobs WHERE id = ?', [jobId]);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Admin;