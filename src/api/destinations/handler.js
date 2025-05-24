class DestinationsHandler {
  constructor(service) {
    this._service = service;

    this.getDestinationsHandler = this.getDestinationsHandler.bind(this);
    this.getDestinationByIdHandler = this.getDestinationByIdHandler.bind(this);
    this.postDestinationHandler = this.postDestinationHandler.bind(this);
    this.putDestinationHandler = this.putDestinationHandler.bind(this);
    this.deleteDestinationHandler = this.deleteDestinationHandler.bind(this);
  }

  getDestinationsHandler = (request, h) => ({
    status: 'success',
    data: this._service.getAllDestinations()
  });

  getDestinationByIdHandler = (request, h) => {
    const data = this._service.getDestinationById(request.params.id);
    if (!data) return h.response({ status: 'fail', message: 'Destinasi tidak ditemukan' }).code(404);
    return { status: 'success', data };
  };

  postDestinationHandler = (request, h) => {
    const { name, cityId, latitude, longitude, description } = request.payload;
    if (!name || !cityId) {
      return h.response({ status: 'fail', message: 'Nama Destinasi, Kota, dan Lokasi tidak boleh kosong' }).code(400);
    }
    const newDest = this._service.addDestination({ name, cityId, latitude, longitude, description });
    return h.response({ 
      status: 'success', 
      data: { 
        id: newDest.id,
        cityId: newDest.city_id,
        latitude: newDest.latitude,
        longitude: newDest.longitude,
        description: newDest.description,
      } 
    }).code(201);
  };

  putDestinationHandler = (request, h) => {
    const updated = this._service.updateDestination(request.params.id, request.payload);
    if (!updated) return h.response({ status: 'fail', message: 'Destinasi tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Destinasi berhasil diperbarui' };
  };

  deleteDestinationHandler = (request, h) => {
    const deleted = this._service.deleteDestination(request.params.id);
    if (!deleted) return h.response({ status: 'fail', message: 'Destinasi tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Destinasi berhasil dihapus' };
  };
}

export default DestinationsHandler;