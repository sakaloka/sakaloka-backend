import EventsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'events',
  version: '1.0.0',
  register: async (server, { service }) => {
    const eventsHandler = new EventsHandler(service);
    server.route(routes(eventsHandler));
  },
};