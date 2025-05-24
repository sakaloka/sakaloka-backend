class ReviewsHandler {
  constructor(service) {
    this._service = service;

    this.getReviewsHandler = this.getReviewsHandler.bind(this);
    this.postEventReviewHandler = this.postEventReviewHandler.bind(this);
    this.postDestinationReviewHandler = this.postDestinationReviewHandler.bind(this);
    this.putReviewHandler = this.putReviewHandler.bind(this);
    this.deleteReviewHandler = this.deleteReviewHandler.bind(this);
  }

  getReviewsHandler = (request, h) => {
    const { type, targetId } = request.query;
    if (type && targetId) {
      const data = this._service.getReviewsByTypeAndTarget(type, parseInt(targetId));
      return { status: 'success', data };
    }
    return { status: 'success', data: this._service.getAllReviews() };
  };

  postEventReviewHandler = (request, h) => {
    const { comment, rating, userId, eventId } = request.payload;
    if (!rating || !userId || !eventId) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }

    const newReview = this._service.addReview({ comment, rating, userId, eventId, destinationId: null });
    return h.response({ 
      status: 'success', 
      data: { 
        id: newReview.id,
        userId: newReview.userId,
        eventId: newReview.eventId,
        rating: newReview.rating,
        comment: newReview.comment
      } 
    }).code(201);
  };

  postDestinationReviewHandler = (request, h) => {
    const { comment, rating, userId, destinationId } = request.payload;
    if (!rating || !userId || !destinationId) {
      return h.response({ status: 'fail', message: 'Penilaian dan Destinasi tidak boleh kosong' }).code(400);
    }

    const newReview = this._service.addReview({ comment, rating, userId, destinationId, eventId: null });
    return h.response({ 
      status: 'success', 
      data: { 
        id: newReview.id,
        userId: newReview.userId,
        destinationId: newReview.destinationId,
        rating: newReview.rating,
        comment: newReview.comment
      } 
    }).code(201);
  };

  putReviewHandler = (request, h) => {
    const updated = this._service.updateReview(request.params.id, request.payload);
    if (!updated) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }
    return { 
      status: 'success', 
      message: 'Review berhasil diperbarui' 
    };
  };

  deleteReviewHandler = (request, h) => {
    const deleted = this._service.deleteReview(request.params.id);
    if (!deleted) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }
    return { status: 'success', message: 'Review berhasil dihapus' };
  };
}

export default ReviewsHandler;