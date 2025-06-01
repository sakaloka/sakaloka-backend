class PredictedReviewsHandler {
  constructor(service) {
    this._service = service;

    this.getTopDestinationsHandler = this.getTopDestinationsHandler.bind(this);
    this.getUserPredictionsHandler = this.getUserPredictionsHandler.bind(this);
    this.bulkInsertHandler         = this.bulkInsertHandler.bind(this);
  }

  getTopDestinationsHandler(request, h) {
    const limit = parseInt(request.query.limit || 5);
    const data = this._service.getTopDestinations(limit);

    return h.response({
      status: 'success',
      data,
    }).code(200);
  }

  getUserPredictionsHandler(request, h) {
    const { userId } = request.params;
    const data = this._service.getUserPredictions(userId);

    return h.response({
      status: 'success',
      data,
    }).code(200);
  }

  bulkInsertHandler(request, h) {
    const rows = request.payload.rows;
    this._service.bulkInsert(rows);

    return h.response({
      status: 'success',
      message: 'Data ML berhasil disimpan',
    }).code(201);
  }
}
export default PredictedReviewsHandler;