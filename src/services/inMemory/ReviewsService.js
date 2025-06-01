import db from '../../db/database.js';

class ReviewsService {
  getAllReviews = () => {
    const stmt = db.prepare(`SELECT * FROM reviews`);
    return stmt.all();
  };

  getRatingStats = (type, id) => {
    let stmt;

    if (type === 'event') {
      stmt = db.prepare(`SELECT rating FROM reviews WHERE event_id = ?`);
    } else if (type === 'destination') {
      stmt = db.prepare(`SELECT rating FROM reviews WHERE destination_id = ?`);
    } else {
      return { averageRating: 0, totalReviews: 0 };
    }

    const ratings = stmt.all(id);
    const totalReviews = ratings.length;

    if (totalReviews === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / totalReviews;

    return { averageRating, totalReviews };
  };

  getReviewsByTypeAndTarget = (type, id) => {
    let stmt;
    if (type === 'event') {
      stmt = db.prepare(`SELECT * FROM reviews WHERE event_id = ?`);
    } else if (type === 'destination') {
      stmt = db.prepare(`SELECT * FROM reviews WHERE destination_id = ?`);
    } else {
      return [];
    }

    return stmt.all(id);
  };

  getReviewsByUser = (userId) => {
    const stmt = db.prepare(`SELECT * FROM reviews WHERE user_id = ?`);
    return stmt.all(userId);
  };

  addReview = ({ comment, rating, userId, destinationId, eventId }) => {
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO reviews (comment, rating, user_id, destination_id, event_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(comment, rating, userId, destinationId, eventId, timestamp, timestamp);

    return {
      id: result.lastInsertRowid,
      comment,
      rating,
      userId,
      destinationId,
      eventId,
      created_at: timestamp,
      updated_at: timestamp,
    };
  };

  updateReview = (id, { comment, rating }) => {
    const timestamp = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE reviews SET comment = ?, rating = ?, updated_at = ? WHERE id = ?
    `);

    const result = stmt.run(comment, rating, timestamp, id);
    return result.changes > 0;
  };

  deleteReview = (id) => {
    const stmt = db.prepare(`DELETE FROM reviews WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  };
}

export default ReviewsService;