class ReviewsHandler {
  constructor(service) {
    this._service = service;

    this.getReviewsHandler = this.getReviewsHandler.bind(this);
    this.postReviewHandler = this.postReviewHandler.bind(this);
    this.putReviewHandler = this.putReviewHandler.bind(this);
    this.deleteReviewHandler = this.deleteReviewHandler.bind(this);
  }
  getReviewsHandler = () => ({
    status: 'success',
    data: this._service.getAllReviews(),
  });
  
  postReviewHandler = (request, h) => {
    const { comment, rating, userId, destinationId, eventId } = request.payload;
    if (!rating || !userId ) {
      return h.response({
        status: 'fail',
        message: 'Rating tidak boleh kosong',
      }).code(400);
    }
  
    const newReview = this._service.addReview({ comment, rating, userId, destinationId, eventId });
    return h.response({
      status: 'success',
      data: { id: newReview.id },
    }).code(201);
  }
  
  putReviewHandler = (request, h) => {
    const updated = this._service.updateReview(request.params.id, request.payload);
    if (!updated) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }
    return { status: 'success', message: 'Review berhasil diperbarui' };
  }
  
  deleteReviewHandler = (request, h) => {
    const deleted = this._service.deleteReview(request.params.id);
    if (!deleted) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }
    return { status: 'success', message: 'Review berhasil dihapus' };
  }
}

export default ReviewsHandler;