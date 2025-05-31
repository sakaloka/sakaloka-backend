import db from '../../db/database.js';

class UsersService {
  addUser = ({ email, password, name }) => {
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(email, password, name, timestamp, timestamp);

    return {
      id: result.lastInsertRowid,
      email,
      password,
      name,
      created_at: timestamp,
      updated_at: timestamp,
    };
  };

  findUserByEmailAndPassword = (email, password) => {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ? AND password = ?
    `);
    return stmt.get(email, password);
  };

  findUserById = (id) => {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE id = ?
    `);
    return stmt.get(id);
  };

  updateUserById = (id, { name }) => {
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE users SET name = ?, updated_at = ? WHERE id = ?
    `);

    const result = stmt.run(name, timestamp, id);
    if (result.changes === 0) return null;

    const updatedUser = this.findUserById(id);
    return updatedUser;
  };
}

export default UsersService;