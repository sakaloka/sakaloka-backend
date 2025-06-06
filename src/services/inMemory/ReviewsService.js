import db from '../../db/database.js';

class ReviewsService {
  getAllReviews = async () => {
    const [rows] = await db.execute(`SELECT * FROM reviews`);
    return rows;
  };

  getRatingStats = async (type, id) => {
    let query = '';
    if (type === 'event') {
      query = `SELECT rating FROM reviews WHERE event_id = ?`;
    } else if (type === 'destination') {
      query = `SELECT rating FROM reviews WHERE destination_id = ?`;
    } else {
      return { averageRating: 0, totalReviews: 0 };
    }

    const [ratings] = await db.execute(query, [id]);
    const totalReviews = ratings.length;

    if (totalReviews === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / totalReviews;

    return { averageRating, totalReviews };
  };

  getReviewsByTypeAndTarget = async (type, id) => {
    let query = '';
    if (type === 'event') {
      query = `SELECT * FROM reviews WHERE event_id = ?`;
    } else if (type === 'destination') {
      query = `SELECT * FROM reviews WHERE destination_id = ?`;
    } else {
      return [];
    }

    const [rows] = await db.execute(query, [id]);
    return rows;
  };

  getReviewsByUser = async (userId) => {
    const [rows] = await db.execute(`SELECT * FROM reviews WHERE user_id = ?`, [userId]);
    return rows;
  };

  addReview = async ({ comment, rating, userId, destinationId, eventId }) => {
    const now = new Date();

    const [result] = await db.execute(`
      INSERT INTO reviews (comment, rating, user_id, destination_id, event_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [comment, rating, userId, destinationId, eventId, now, now]
    );

    return {
      id: result.insertId,
      comment,
      rating,
      userId,
      destinationId,
      eventId,
      created_at: now,
      updated_at: now,
    };
  };

  updateReview = async (id, { comment, rating }) => {
    const now = new Date();

    const [result] = await db.execute(
      `UPDATE reviews SET comment = ?, rating = ?, updated_at = ? WHERE id = ?`,
      [comment, rating, now, id]
    );

    return result.affectedRows > 0;
  };

  deleteReview = async (id) => {
    const [result] = await db.execute(`DELETE FROM reviews WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  };
}

export default ReviewsService;