class EventsHandler {
  constructor(service) {
    this._service = service;

    this.getEventsHandler = this.getEventsHandler.bind(this);
    this.getEventByIdHandler = this.getEventByIdHandler.bind(this);
    this.postEventHandler = this.postEventHandler.bind(this);
    this.putEventHandler = this.putEventHandler.bind(this);
    this.deleteEventHandler = this.deleteEventHandler.bind(this);
  }

  getEventsHandler = () => ({
    status: 'success',
    data: this._service.getAllEvents()
  });

  getEventByIdHandler = (request, h) => {
    const data = this._service.getEventById(request.params.id);
    if (!data) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', data };
  };

  postEventHandler = (request, h) => {
    const { title, description, startDate, endDate } = request.payload;
    if (!title || !startDate || !endDate) {
      return h.response({ status: 'fail', message: 'Data tidak lengkap' }).code(400);
    }
    const newEvent = this._service.addEvent({ title, description, startDate, endDate });
    return h.response({ 
      status: 'success', 
      data: { 
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        startDate: newEvent.start_date,
        endDate: newEvent.end_date,
      } 
    }).code(201);
  };

  putEventHandler = (request, h) => {
    const updated = this._service.updateEvent(request.params.id, request.payload);
    if (!updated) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Event berhasil diperbarui' };
  };

  deleteEventHandler = (request, h) => {
    const deleted = this._service.deleteEvent(request.params.id);
    if (!deleted) return h.response({ status: 'fail', message: 'Event tidak ditemukan' }).code(404);
    return { status: 'success', message: 'Event berhasil dihapus' };
  };
}

export default EventsHandler;