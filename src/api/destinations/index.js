import DestinationsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'destinations',
  version: '1.0.0',
  register: async (server, { service }) => {
    const destinationsHandler = new DestinationsHandler(service);
    server.route(routes(destinationsHandler));
  },
};