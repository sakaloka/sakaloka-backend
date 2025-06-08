class EventsHandler {
  constructor(service) {
    this._service = service;

    this.getEventsHandler = this.getEventsHandler.bind(this);
    this.getEventByIdHandler = this.getEventByIdHandler.bind(this);
    this.postEventHandler = this.postEventHandler.bind(this);
    this.putEventHandler = this.putEventHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
  }

  getEventsHandler = async (request, h) => {
    const { userId } = request.query;
  
    try {
      const events = await this._service.getAllEvents(userId); 
      return {
        status: 'success',
        data: events
      };
    } catch (err) {
      console.error(err);
      return h.response({
        status: 'error',
        message: 'Gagal mengambil data event'
      }).code(500);
    }
  };  

  getEventByIdHandler = async (request, h) => {
    const eventId = request.params.id;
    const {userId} = request.query;

    if (!userId) {
      return h.response({ status: 'fail', message: 'Terjadi kesalahan saat mencari pengguna' }).code(400);
    }

    try {
      const data = await this._service.getEventById(eventId, { userId });
      if (!data) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
      return { status: 'success', data };
    } catch (err) {
      console.error(err);
      return h.response({ status: 'error', message: 'Gagal mengambil detail event' }).code(500);
    }
  };

  postEventHandler = async (request, h) => {
    const { title, description, startDate, endDate, city_id, category, detail_url } = request.payload;

    if (!title || !startDate || !endDate || !city_id) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }

    const newEvent = await this._service.addEvent({
      title, description, startDate, endDate, city_id, category, detail_url
    });

    return h.response({
      status: 'success',
      data: {
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        startDate: newEvent.start_date,
        endDate: newEvent.end_date,
        city_id: newEvent.city_id,
        category: newEvent.category,
        detail_url: newEvent.detail_url
      }
    }).code(201);
  };

  putEventHandler = async (request, h) => {
    const updated = await this._service.updateEvent(request.params.id, request.payload);
    if (!updated) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Event berhasil diperbarui' };
  };

  deleteEventHandler = async (request, h) => {
    const deleted = await this._service.deleteEvent(request.params.id);
    if (!deleted) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Event berhasil dihapus' };
  };
}

export default EventsHandler;