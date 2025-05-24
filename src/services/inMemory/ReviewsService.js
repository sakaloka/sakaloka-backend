class ReviewsService {
  constructor() {
    this._reviews = [];
  }
  getAllReviews = () => this._reviews;

  getReviewsByTypeAndTarget = (type, id) => {
    if (type === 'event') {
      return this._reviews.filter(r => r.eventId === id);
    } else if (type === 'destination') {
      return this._reviews.filter(r => r.destinationId === id);
    }
    return [];
  };
  
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