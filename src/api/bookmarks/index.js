import BookmarksHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: 'bookmarks',
  version: '1.0.0',
  register: async (server, { service }) => {
    const bookmarksHandler = new BookmarksHandler(service);
    server.route(routes(bookmarksHandler));
  },
};