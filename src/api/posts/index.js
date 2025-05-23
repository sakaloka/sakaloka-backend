import PostsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'posts',
  version: '1.0.0',
  register: async (server, { service }) => {
    const postsHandler = new PostsHandler(service);
    server.route(routes(postsHandler));
  },
};