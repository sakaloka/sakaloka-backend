import bcrypt from 'bcrypt';
import db from '../../db/database.js';
import moment from 'moment-timezone';

class UsersService {
  addUser = async ({ email, password, name }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

      const [result] = await db.execute(
        `INSERT INTO users (email, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, name, now, now]
      );

      return {
        id: result.insertId,
        email,
        name,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email sudah digunakan');
      }
      throw error;
    }
  };

  findUserByEmailAndPassword = async (email, password) => {
    const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    const user = rows[0];
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    delete user.password;
    return user;
  };

  findUserById = async (id) => {
    const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    const user = rows[0];
    if (!user) return null;

    delete user.password;
    return user;
  };

  updateUserById = async (id, { name }) => {
    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    const [result] = await db.execute(
      `UPDATE users SET name = ?, updated_at = ? WHERE id = ?`,
      [name, now, id]
    );

    if (result.affectedRows === 0) return null;
    return this.findUserById(id);
  };

  getUserSummary = async (id) => {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(ub.id) AS bookmark_total, 
        (SELECT COUNT(e.id) FROM events e) AS event_total,
        (SELECT COUNT(d.id) FROM destinations d) AS destination_total,
        (
          SELECT COUNT(*) 
          FROM reviews r 
          WHERE r.user_id = ? AND r.destination_id IS NOT NULL
        ) AS rating_dest_count
      FROM user_bookmark ub 
      WHERE ub.user_id = ?
      GROUP BY ub.user_id
    `, [id, id]);
    const user = rows[0];
    if (!user) return null;

    return user;
  }
}

export default UsersService;