const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create({ email, password, role, firstName, lastName }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.promise().query(
        'INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, role, firstName, lastName]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find a user by email
  static async findByEmail(email) {
    try {
        console.log(`Finding user with email: ${email}`); // Debugging
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Query result:', rows); // Debugging
        return rows[0] || null;
    } catch (error) {
        console.error('Error in findByEmail:', error);
        throw error;
    }
}


  // Find a user by ID
  static async findById(id) {
    try {
      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Fetch all users (for admin purposes)
  static async findAll() {
    try {
      const [rows] = await db.promise().query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user information
  static async update(id, { firstName, lastName, email, role, isActive }) {
    try {
      await db.promise().query(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
        [firstName, lastName, email, role, isActive, id]
      );
      return this.findById(id); // Return the updated user
    } catch (error) {
      throw error;
    }
  }

  // Delete a user by ID
  static async delete(id) {
    try {
      await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Change user password
  static async changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Compare password with hashed password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Alias for backward compatibility
  static async validatePassword(password, hashedPassword) {
    return this.comparePassword(password, hashedPassword);
  }
}

module.exports = User;