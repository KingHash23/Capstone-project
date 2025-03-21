const db = require('../config/db');

class Company {
  static async create(companyData) {
    try {
      const [result] = await db.promise().query(
        'INSERT INTO companies (employer_id, company_name, description, industry, website, location) VALUES (?, ?, ?, ?, ?, ?)',
        [
          companyData.employerId,
          companyData.companyName,
          companyData.description,
          companyData.industry,
          companyData.website,
          companyData.location
        ]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async update(employerId, companyData) {
    try {
      await db.promise().query(
        'UPDATE companies SET company_name = ?, description = ?, industry = ?, website = ?, location = ? WHERE employer_id = ?',
        [
          companyData.companyName,
          companyData.description,
          companyData.industry,
          companyData.website,
          companyData.location,
          employerId
        ]
      );
      return this.findByEmployerId(employerId);
    } catch (error) {
      throw error;
    }
  }

  static async findByEmployerId(employerId) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM companies WHERE employer_id = ?',
        [employerId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.promise().query(
        'SELECT * FROM companies WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.promise().query('SELECT * FROM companies');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Company; 