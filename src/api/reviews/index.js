import ReviewsHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'reviews',
  version: '1.0.0',
  register: async (server, { service }) => {
    const reviewsHandler = new ReviewsHandler(service);
    server.route(routes(reviewsHandler));
  },
};