import db from '../../db/database.js';

class PredictedReviewsService {
  bulkInsert = (rows) => {
    const stmt = db.prepare(`
      INSERT INTO predicted_reviews (user_id, place_id, predicted_rating)
      VALUES (@user_id, @place_id, @predicted_rating)
    `);
    const insertMany = db.transaction((data) => {
      data.forEach(row => stmt.run(row));
    });
    insertMany(rows);
  };

  getTopDestinations = (limit = 5) => {
    const stmt = db.prepare(`
      SELECT place_id, AVG(predicted_rating) AS avg_rating, COUNT(*) AS total
      FROM   predicted_reviews
      GROUP  BY place_id
      ORDER  BY avg_rating DESC
      LIMIT  ?
    `);
    return stmt.all(limit);
  };

  getUserPredictions = (userId) => {
    const stmt = db.prepare(`
      SELECT place_id, predicted_rating
      FROM   predicted_reviews
      WHERE  user_id = ?
    `);
    return stmt.all(userId);
  };
}

export default PredictedReviewsService;