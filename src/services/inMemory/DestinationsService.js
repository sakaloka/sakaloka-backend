import db from '../../db/database.js';
import axios from 'axios';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config();

class DestinationsService {
  getAllDestinations = async () => {
    const [rows] = await db.execute(`
      SELECT 
        d.id,
        d.name,
        d.latitude,
        d.longitude,
        d.description,
        CONCAT (c.name, ', ', p.name) AS location,
        GROUP_CONCAT(DISTINCT cat.name) AS categories
      FROM destinations d
      JOIN cities c ON c.id = d.city_id
      JOIN provinces p ON p.id = c.province_id
      LEFT JOIN destination_categories dc ON dc.destination_id = d.id
      LEFT JOIN categories cat ON cat.id = dc.category_id
      GROUP BY d.id
      `);
    return rows;
  };

  getDestinationById = async (destinationId, {userId}) => {
    const [rows] = await db.execute(`
      SELECT 
        d.id,
        d.name,
        d.latitude,
        d.longitude,
        d.description,
        CONCAT (c.name, ', ', p.name) AS location,
        GROUP_CONCAT(DISTINCT cat.name) AS categories,
        GROUP_CONCAT(DISTINCT dp.photo_url SEPARATOR ' || ') AS photo_urls,
        MAX(CASE WHEN ub.id IS NOT NULL THEN TRUE ELSE FALSE END) AS is_saved
      FROM destinations d
      JOIN cities c ON c.id = d.city_id
      JOIN provinces p ON p.id = c.province_id
      LEFT JOIN destination_categories dc ON dc.destination_id = d.id
      LEFT JOIN categories cat ON cat.id = dc.category_id
      LEFT JOIN destination_photos dp ON dp.destination_id = d.id
      LEFT JOIN user_bookmark ub ON ub.destination_id = d.id AND ub.user_id = ? AND ub.type = 'Destinasi'
      WHERE d.id = ?
      GROUP BY d.id
    `, [userId, destinationId]);
  
    return rows[0];
  };  

  addDestination = async ({ name, cityId, latitude, longitude, description }) => {
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.execute(`
      INSERT INTO destinations (name, city_id, latitude, longitude, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, cityId, latitude, longitude, description, timestamp, timestamp]);

    return {
      id: result.insertId,
      name,
      city_id: cityId,
      latitude,
      longitude,
      description,
      created_at: timestamp,
      updated_at: timestamp
    };
  };

  updateDestination = async (id, data) => {
    const timestamp = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.execute(`
      UPDATE destinations
      SET name = ?, city_id = ?, latitude = ?, longitude = ?, description = ?, updated_at = ?
      WHERE id = ?
    `, [data.name, data.city_id, data.latitude, data.longitude, data.description, timestamp, id]);

    return result.affectedRows > 0;
  };

  deleteDestination = async (id) => {
    const [result] = await db.execute('DELETE FROM destinations WHERE id = ?', [id]);
    return result.affectedRows > 0;
  };

  getDestinationByName = async (name) => {
    const [rows] = await db.execute(`
      SELECT 
        d.id, 
        d.name, 
        d.latitude, 
        d.longitude, 
        d.description, 
        CONCAT (c.name, ', ', p.name) AS location, 
        (
          SELECT GROUP_CONCAT(DISTINCT cat.name SEPARATOR ', ')
              FROM destination_categories dc
              JOIN categories cat ON cat.id = dc.category_id
              WHERE dc.destination_id = 1
          ) AS categories,
        dp.photo_url AS main_photo
      FROM destinations d 
      JOIN cities c ON d.city_id = c.id
      JOIN provinces p ON c.province_id = p.id
      JOIN destination_photos dp ON d.id = dp.destination_id 
      where d.name = ? and dp.is_gallery = 0;
    `, [name]);

    return rows[0];
  };

  getCategories = async () => {
    const [rows] = await db.execute('SELECT * FROM categories');
    return rows;
  };

  postUserPreferences = async ({ userId, preferences }) => {
    const [result] = await db.execute(`
      INSERT INTO user_preferences (user_id, preferences) VALUES (?, ?)
    `, [userId, preferences]);
    return result.affectedRows;
  };

  getTopDestinations = async () => {
    const [rows] = await db.execute(`
      SELECT 
        d.id,
        d.name,
        CONCAT (c.name, ', ', p.name) AS location,
        dp.photo_url AS photo,
        AVG(pr.predicted_rating) AS rating
      FROM destinations d
      JOIN cities c ON d.city_id = c.id
      JOIN provinces p ON c.province_id = p.id
      JOIN predicted_reviews pr ON pr.destination_id = d.id
      JOIN destination_photos dp ON dp.destination_id = d.id AND dp.is_gallery = 0
      GROUP BY d.id, d.name, c.name, dp.photo_url
      ORDER BY rating DESC
      LIMIT 5;
    `);
    return rows;
  };

  getRecommendationsByPreferences = async (userId) => {
    const [rows] = await db.execute('SELECT preferences FROM user_preferences WHERE user_id = ?', [userId]);
    const preferences = rows[0]?.preferences;
    if (!preferences) return [];

    const { data } = await axios.post(`${process.env.ML_BASE_URL}/recommend/`, {
      query: preferences,
      top_n: 5,
    });

    const detailed = await Promise.all(data.recommendations.map(async (rec) => {
      const dest = await this.getDestinationByName(rec.place_name);
      if (!dest) return null;

      return {
        id: dest.id,
        name: dest.name,
        location: dest.location,
        latitude: dest.latitude,
        longitude: dest.longitude,
        description: dest.description,
        similarity: rec.similarity_score,
      };
    }));

    return detailed.filter(Boolean);
  };
}

export default DestinationsService;