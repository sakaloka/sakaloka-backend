import db from '../../db/database.js';

class DestinationsService {
  getAllDestinations = () => {
    const stmt = db.prepare('SELECT * FROM destinations');
    return stmt.all();
  };

  getDestinationById = (id) => {
    const stmt = db.prepare('SELECT * FROM destinations WHERE id = ?');
    return stmt.get(id);
  };

  addDestination = ({ name, cityId, latitude, longitude, description }) => {
    const timestamp = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO destinations (name, city_id, latitude, longitude, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, cityId, latitude, longitude, description, timestamp, timestamp);

    return {
      id: result.lastInsertRowid,
      name,
      city_id: cityId,
      latitude,
      longitude,
      description,
      created_at: timestamp,
      updated_at: timestamp
    };
  };

  updateDestination = (id, data) => {
    const timestamp = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE destinations
      SET name = ?, city_id = ?, latitude = ?, longitude = ?, description = ?, updated_at = ?
      WHERE id = ?
    `);
    const result = stmt.run(
      data.name,
      data.city_id,
      data.latitude,
      data.longitude,
      data.description,
      timestamp,
      id
    );

    return result.changes > 0;
  };

  deleteDestination = (id) => {
    const stmt = db.prepare('DELETE FROM destinations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  };
}

export default DestinationsService;