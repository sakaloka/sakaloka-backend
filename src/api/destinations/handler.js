class DestinationsHandler {
  constructor(service) {
    this._service = service;

    this.getDestinationsHandler = this.getDestinationsHandler.bind(this);
    this.getDestinationByIdHandler = this.getDestinationByIdHandler.bind(this);
    this.postDestinationHandler = this.postDestinationHandler.bind(this);
    this.putDestinationHandler = this.putDestinationHandler.bind(this);
    this.deleteDestinationHandler = this.deleteDestinationHandler.bind(this);
    
    this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    this.postUserPreferencesHandler = this.postUserPreferencesHandler.bind(this);

    this.getTopDestinationsHandler = this.getTopDestinationsHandler.bind(this);
    // Machine Learning
    this.getRecommendationsByPreferencesHandler = this.getRecommendationsByPreferencesHandler.bind(this);
  }

  getDestinationsHandler = (request, h) => {
    const data = this._service.getAllDestinations();
    if (!data) return h.response({ status: 'fail', message: 'Destinasi tidak ditemukan' }).code(404);
    return { status: 'success', data };
  };

  // Category
  getCategoriesHandler = (request, h) => {
    const data = this._service.getCategories();
    if (!data) return h.response({ status: 'fail', message: 'Kategori tidak ditemukan'}).code(404);
    return { status: 'success', data };
  }

  postUserPreferencesHandler = (request, h) => {
    const { userId, preferences } = request.payload;
  
    if (!preferences) {
      return h.response({
        status: 'fail',
        message: 'Kategori tidak boleh kosong',
      }).code(400);
    } else if (!userId){
      return h.response({
        status: 'fail',
        message: 'Terjadi masalah saat mengambil data pengguna',
      }).code(400);
    } 
  
    try {
      const result = this._service.postUserPreferences({ userId, preferences });
      return h.response({
        status: 'success',
        message: 'Preferensi kategori berhasil disimpan',
        data: result,
      }).code(201);
    } catch (error) {
      console.error(error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat menyimpan preferensi',
      }).code(500);
    }
  };  

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
  

  async getTopDestinationsHandler(request, h) {
    const data = await this._service.getTopDestinations();

    return h.response({
      status: 'success',
      data,
    }).code(200);
  }

  async getRecommendationsByPreferencesHandler(request, h) {
    try {
      const data = await this._service.getRecommendationsByPreferences(request.params.id);
      return { status: 'success', data };
    } catch (err) {
      console.error(err);
      return h.response({ status: 'error', message: 'Gagal mengambil rekomendasi' }).code(500);
    }
  }
}

export default DestinationsHandler;