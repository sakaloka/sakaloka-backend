const routes = (handler) => [
  {
    method: 'GET',
    path: '/reviews',
    handler: handler.getReviewsHandler,
  },
  {
    method: 'POST',
    path: '/reviews',
    handler: handler.postReviewHandler,
  },
  {
    method: 'PUT',
    path: '/reviews/{id}',
    handler: handler.putReviewHandler,
  },
  {
    method: 'DELETE',
    path: '/reviews/{id}',
    handler: handler.deleteReviewHandler,
  },
];

export default routes;