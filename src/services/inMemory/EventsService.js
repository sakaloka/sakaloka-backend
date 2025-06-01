import db from '../../db/database.js';

class EventsService {
  getAllEvents = () => {
    const stmt = db.prepare('SELECT * FROM events');
    return stmt.all();
  };

  getEventById = (id) => {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    return stmt.get(id);
  };

  addEvent = ({ title, description, startDate, endDate, location, category, detail_url }) => {
    const timestamp = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO events (title, description, start_date, end_date, location, category, detail_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, startDate, endDate, location, category, detail_url, timestamp, timestamp);
  
    return {
      id: result.lastInsertRowid,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      location,
      category,
      detail_url,
      created_at: timestamp,
      updated_at: timestamp
    };
  };
  
  updateEvent = (id, data) => {
    const timestamp = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE events
      SET title = ?, description = ?, start_date = ?, end_date = ?, location = ?, category = ?, detail_url = ?, updated_at = ?
      WHERE id = ?
    `);
    const result = stmt.run(
      data.title,
      data.description,
      data.start_date,
      data.end_date,
      data.location,
      data.category,
      data.detail_url,
      timestamp,
      id
    );
  
    return result.changes > 0;
  };

  deleteEvent = (id) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  };
}

export default EventsService;