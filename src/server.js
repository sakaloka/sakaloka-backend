import Hapi from '@hapi/hapi';
import authJwt from './plugins/authJwt.js';
import users from './api/users/index.js';
import UsersService from './services/inMemory/UsersService.js';
import reviews from './api/reviews/index.js';
import ReviewsService from './services/inMemory/ReviewsService.js';
import posts from './api/posts/index.js';
import PostsService from './services/inMemory/PostsService.js';


const init = async () => {
  const usersService = new UsersService(); 
  const reviewsService = new ReviewsService(); 
  const postsService = new PostsService(); 

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
      plugin: reviews,
      options: {
        service: reviewsService,
      },
    },
    {
      plugin: posts,
      options: {
        service: postsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();