import Hapi from '@hapi/hapi';
import authJwt from './plugins/authJwt.js';
import users from './api/users/index.js';
import UsersService from './services/inMemory/UsersService.js';
import destinations from './api/destinations/index.js';
import DestinationsService from './services/inMemory/DestinationsService.js';
import events from './api/events/index.js';
import EventsService from './services/inMemory/EventsService.js';
import reviews from './api/reviews/index.js';
import ReviewsService from './services/inMemory/ReviewsService.js';
import predictedReviews from './api/predicted-reviews/index.js';
import PredictedReviewsService from './services/inMemory/PredictedReviewsService.js';

const init = async () => {
  const usersService = new UsersService(); 
  const destinationsService = new DestinationsService(); 
  const eventsService = new EventsService(); 
  const reviewsService = new ReviewsService(); 
  const predictedReviewService = new PredictedReviewsService();

  const server = Hapi.server({
    port: 9000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(authJwt);
  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: destinations,
      options: {
        service: destinationsService,
      },
    },
    {
      plugin: events,
      options: {
        service: eventsService,
      },
    },
    {
      plugin: reviews,
      options: {
        service: reviewsService,
      },
    },
    {
      plugin: predictedReviews,
      options: {
        service: predictedReviewService,
      }
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();