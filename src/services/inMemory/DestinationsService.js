import db from '../../db/database.js';
import axios from 'axios';
import moment from 'moment-timezone'

const ML_BASE_URL = 'http://127.0.0.1:8000'; 

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
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
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
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
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

  getDestinationByName = (name) => {
    return db.prepare(`
      SELECT d.*, c.name AS city, GROUP_CONCAT(cat.name, ', ') AS categories,
        (SELECT photo_url
          FROM destination_photos
          WHERE destination_id = d.id
          AND is_gallery = 0
          LIMIT 1) AS main_photo
      FROM destinations d
      JOIN cities c ON d.city_id = c.id
      JOIN destination_categories dc ON dc.destination_id = d.id
      JOIN categories cat ON cat.id = dc.category_id
      WHERE d.name = ? LIMIT 1
    `).get(name);
  };

  // Categories
  getCategories = () => {
    const stmt = db.prepare(`
      SELECT *
      FROM categories
    `);
    return stmt.all(); 
  };  

  postUserPreferences = ({ userId, preferences }) => {
    const stmt = db.prepare(`
      INSERT INTO user_preferences (user_id, preferences)
      VALUES (?, ?)
    `);
  
    const result = stmt.run(userId, preferences);
    return result.changes;
  };  

  // Top
  getTopDestinations = async () => {
    const stmt = db.prepare(`
      SELECT d.id, d.name, c.name AS city, dp.photo_url, AVG(pr.predicted_rating) AS rating
      FROM destinations d
      JOIN cities c ON d.city_id = c.id
      JOIN destination_photos dp ON d.id = dp.destination_id
      JOIN predicted_reviews pr ON pr.destination_id = d.id
      WHERE dp.is_gallery = 0
        AND d.id IN (
          SELECT destination_id
          FROM predicted_reviews
          GROUP BY destination_id
          ORDER BY AVG(predicted_rating) DESC
          LIMIT 5
        )
      GROUP BY d.id, d.name, c.name, dp.photo_url
      ORDER BY rating DESC
    `);
  
    return stmt.all();
  }   

  getRecommendationsByPreferences = async (id) => {
    const result = db.prepare(`
      SELECT preferences 
      FROM user_preferences 
      WHERE user_id = ? 
    `).get(id);
    
    const preferences = result?.preferences;
    const { data } = await axios.post(`${ML_BASE_URL}/recommend/`, {
      query: preferences,
      top_n: 5,
    });

    const detailed = data.recommendations.map((rec) => {
      const dest = this.getDestinationByName(rec.place_name);
      if (!dest) return null; 
      return {
        id          : dest.id,
        name        : dest.name,
        city        : dest.city,
        categories  : dest.categories,
        latitude    : dest.latitude,
        longitude   : dest.longitude,
        description : dest.description,
        main_photo  : dest.main_photo,
        similarity  : rec.similarity_score,
      };
    }).filter(Boolean);       

    return detailed;
  };
}

export default DestinationsService;