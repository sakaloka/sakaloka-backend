class EventsService {
  constructor() {
    this._events = [];
  }

  getAllEvents = () => this._events;

  getEventById = (id) => this._events.find(e => e.id === parseInt(id));

  addEvent = ({ title, description, startDate, endDate }) => {
    const id = this._events.length + 1;
    const timestamp = new Date().toISOString();
    const event = { id, title, description, start_date: startDate, end_date: endDate, created_at: timestamp, updated_at: timestamp };
    this._events.push(event);
    return event;
  };

  updateEvent = (id, data) => {
    const index = this._events.findIndex(e => e.id === parseInt(id));
    if (index === -1) return false;
    this._events[index] = { ...this._events[index], ...data, updated_at: new Date().toISOString() };
    return true;
  };

  deleteEvent = (id) => {
    const index = this._events.findIndex(e => e.id === parseInt(id));
    if (index === -1) return false;
    this._events.splice(index, 1);
    return true;
  };
}

export default EventsService;