import PredictedReviewsHandler from './handler.js';
import routes from './route.js';

export default {
  name   : 'predicted-reviews',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new PredictedReviewsHandler(service);
    server.route(routes(handler));
  },
};