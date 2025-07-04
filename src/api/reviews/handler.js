class ReviewsHandler {
  constructor(service) {
    this._service = service;

    this.getReviewsHandler = this.getReviewsHandler.bind(this);
    this.getReviewsByUserHandler = this.getReviewsByUserHandler.bind(this);
    this.getRatingStatsHandler = this.getRatingStatsHandler.bind(this);
    this.postEventReviewHandler = this.postEventReviewHandler.bind(this);
    this.postDestinationReviewHandler = this.postDestinationReviewHandler.bind(this);
    this.putReviewHandler = this.putReviewHandler.bind(this);
    this.deleteReviewHandler = this.deleteReviewHandler.bind(this);
  }

  getReviewsHandler = async (request, h) => {
    const { type, targetId } = request.query;

    if (type && targetId) {
      const data = await this._service.getReviewsByTypeAndTarget(type, parseInt(targetId));
      return { status: 'success', data };
    }

    const data = await this._service.getAllReviews();
    return { status: 'success', data };
  };

  getReviewsByUserHandler = async (request, h) => {
    const { userId } = request.query;

    if (!userId) {
      return h.response({ status: 'fail', message: 'User ID tidak boleh kosong' }).code(400);
    }

    const data = await this._service.getReviewsByUser(userId);

    if (data.length === 0) {
      return h.response({ status: 'fail', message: 'Tidak ada ulasan yang sudah dibuat' }).code(404);
    }

    return { status: 'success', data };
  };

  getRatingStatsHandler = async (request, h) => {
    const { type, id } = request.params;

    if (!['event', 'destination'].includes(type)) {
      return h.response({ status: 'fail', message: 'Tipe tidak valid' }).code(400);
    }

    const stats = await this._service.getRatingStats(type, parseInt(id));
    return { status: 'success', data: stats };
  };

  postEventReviewHandler = async (request, h) => {
    const { comment, rating, userId, eventId } = request.payload;

    if (!rating || !userId || !eventId) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }

    const newReview = await this._service.addReview({ comment, rating, userId, eventId, destinationId: null });

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

  postDestinationReviewHandler = async (request, h) => {
    const { comment, rating, userId, destinationId } = request.payload;

    if (!rating || !userId || !destinationId) {
      return h.response({ status: 'fail', message: 'Penilaian dan Destinasi tidak boleh kosong' }).code(400);
    }

    const newReview = await this._service.addReview({ comment, rating, userId, destinationId, eventId: null });

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

  putReviewHandler = async (request, h) => {
    const updated = await this._service.updateReview(request.params.id, request.payload);

    if (!updated) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }

    return {
      status: 'success',
      message: 'Review berhasil diperbarui'
    };
  };

  deleteReviewHandler = async (request, h) => {
    const deleted = await this._service.deleteReview(request.params.id);

    if (!deleted) {
      return h.response({ status: 'fail', message: 'Review tidak ditemukan' }).code(404);
    }

    return { status: 'success', message: 'Review berhasil dihapus' };
  };
}

export default ReviewsHandler;