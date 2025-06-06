const routes = (handler) => [
  {
    method: 'GET',
    path: '/bookmarks/{id}',
    handler: handler.getBookmarksByUserHandler,
  },
  {
    method: 'POST',
    path: '/bookmarks',
    handler: handler.addBookmarkHandler,
  },
  {
    method: 'DELETE',
    path: '/bookmarks',
    handler: handler.deleteBookmarkHandler,
  },
];

export default routes;