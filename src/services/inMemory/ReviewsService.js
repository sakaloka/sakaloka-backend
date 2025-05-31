class ReviewsService {
  constructor() {
    this._reviews = [];
  }
  getAllReviews = () => this._reviews;

  getRatingStats = (type, id) => {
    let filtered = [];
  
    if (type === 'event') {
      filtered = this._reviews.filter(r => r.eventId === id);
    } else if (type === 'destination') {
      filtered = this._reviews.filter(r => r.destinationId === id);
    }
  
    const totalReviews = filtered.length;
    if (totalReviews === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
  
    const totalRating = filtered.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRating / totalReviews;
  
    return { averageRating, totalReviews };
  };
  
  getReviewsByTypeAndTarget = (type, id) => {
    if (type === 'event') {
      return this._reviews.filter(r => r.eventId === id);
    } else if (type === 'destination') {
      return this._reviews.filter(r => r.destinationId === id);
    }
    return [];
  };
  
  getReviewsByUser = (userId) => {
    return this._reviews.filter(r => r.userId === parseInt(userId));
  }

  addReview = ({ comment, rating, userId, destinationId, eventId }) => {
    const id = this._reviews.length + 1;
    const timestamp = new Date().toISOString();
    const review = {
      id,
      comment,
      rating,
      userId,
      destinationId,
      eventId,
      created_at: timestamp,
      updated_at: timestamp,
    };
    this._reviews.push(review);
    return review;
  };
  
  updateReview = (id, { comment, rating }) => {
    const index = this._reviews.findIndex(r => r.id === parseInt(id));
    if (index === -1) return false;
  
    const updated_at = new Date().toISOString();
    this._reviews[index] = {
      ...this._reviews[index],
      comment,
      rating,
      updated_at,
    };
  
    return true;
  };
  
  deleteReview = (id) => {
    const index = this._reviews.findIndex(r => r.id === parseInt(id));
    if (index === -1) return false;
    this._reviews.splice(index, 1);
    return true;
  };
}

export default ReviewsService;