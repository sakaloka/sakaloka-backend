class EventsService {
  constructor() {
    this._events = []
  }

  getAllEvents = () => this._events;
  
  getEventById = (id) => this._events.find(e => e.id === parseInt(id));
}

export default EventsService;