import db from '../../db/database.js';
import moment from 'moment-timezone';

class EventsService {
  getAllEvents = async (userId) => {
    const [rows] = await db.execute(`
      SELECT 
        e.id,
        e.title,
        CONCAT(c.name, ', ', p.name) AS location,
        e.category,
        e.start_date,
        e.end_date,
        e.description,
        e.detail_url,
        MAX(CASE WHEN ub.id IS NOT NULL THEN TRUE ELSE FALSE END) AS is_saved
      FROM events e 
      JOIN cities c ON e.city_id = c.id
      JOIN provinces p ON c.province_id = p.id
      LEFT JOIN user_bookmark ub ON ub.event_id = e.id AND ub.user_id = ? AND ub.type = 'Acara Budaya'
      GROUP BY 
        e.id, e.title, c.name, p.name, e.category, e.start_date, e.end_date, e.description, e.detail_url
    `, [userId]);

    return rows;
  };

  getEventById = async (eventId, { userId }) => {
    const [rows] = await db.execute(`
      SELECT 
        e.id,
        e.title,
        CONCAT(c.name, ', ', p.name) AS location,
        e.category,
        e.start_date,
        e.end_date,
        e.description,
        e.detail_url,
        TRIM(TRAILING '.0' FROM ROUND(AVG(r.rating), 1)) AS rating_average,
        COUNT(r.id) AS rating_count,
        (SELECT COUNT(*) FROM user_bookmark WHERE event_id = e.id AND type = 'Acara Budaya') AS bookmark_count,
        MAX(CASE WHEN ub.id IS NOT NULL THEN TRUE ELSE FALSE END) AS is_saved
      FROM events e
      JOIN cities c ON e.city_id = c.id
      JOIN provinces p ON c.province_id = p.id
      LEFT JOIN user_bookmark ub ON ub.event_id = e.id AND ub.user_id = ? AND ub.type = 'Acara Budaya'
      LEFT JOIN reviews r ON r.event_id = e.id
      WHERE e.id = ?
      GROUP BY 
        e.id, e.title, c.name, p.name, e.category, e.start_date, e.end_date, e.description, e.detail_url
    `, [userId, eventId]);
  
    return rows;
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