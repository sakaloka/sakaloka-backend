import db from '../../db/database.js';
import moment from 'moment-timezone';

class EventsService {
  getAllEvents = async () => {
    const [rows] = await db.execute(`
      SELECT e.*, c.name AS city 
      FROM events e 
      LEFT JOIN cities c ON e.city_id = c.id
    `);
    return rows;
  };

  getEventById = async (id) => {
    const [rows] = await db.execute(`
      SELECT e.*, c.name AS city 
      FROM events e 
      LEFT JOIN cities c ON e.city_id = c.id 
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  };

  addEvent = async ({ title, description, startDate, endDate, city_id, category, detail_url }) => {
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.execute(`
      INSERT INTO events (title, description, start_date, end_date, city_id, category, detail_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, startDate, endDate, city_id, category, detail_url, timestamp, timestamp]);

    return {
      id: result.insertId,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      city_id,
      category,
      detail_url,
      created_at: timestamp,
      updated_at: timestamp
    };
  };

  updateEvent = async (id, data) => {
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.execute(`
      UPDATE events
      SET title = ?, description = ?, start_date = ?, end_date = ?, city_id = ?, category = ?, detail_url = ?, updated_at = ?
      WHERE id = ?
    `, [
      data.title,
      data.description,
      data.start_date,
      data.end_date,
      data.city_id,
      data.category,
      data.detail_url,
      timestamp,
      id
    ]);

    return result.affectedRows > 0;
  };

  deleteEvent = async (id) => {
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows > 0;
  };
}

export default EventsService;