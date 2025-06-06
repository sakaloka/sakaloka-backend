class EventsHandler {
  constructor(service) {
    this._service = service;

    this.getEventsHandler = this.getEventsHandler.bind(this);
    this.getEventByIdHandler = this.getEventByIdHandler.bind(this);
    this.postEventHandler = this.postEventHandler.bind(this);
    this.putEventHandler = this.putEventHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
  }

  getEventsHandler = async () => ({
    status: 'success',
    data: await this._service.getAllEvents()
  });

  getEventByIdHandler = async (request, h) => {
    const data = await this._service.getEventById(request.params.id);
    if (!data) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', data };
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